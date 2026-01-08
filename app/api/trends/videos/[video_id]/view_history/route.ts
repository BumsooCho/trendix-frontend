import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL 연결 풀 생성
let pool: Pool | null = null

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.SQL_HOST
    
    if (!connectionString) {
      throw new Error('DATABASE_URL or SQL_HOST environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function GET(
  request: NextRequest,
  { params }: { params: { video_id: string } }
) {
  const { video_id } = params
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const platform = searchParams.get('platform') || 'youtube'
  const limit = Math.max(1, Math.min(Number(searchParams.get('limit') || '30'), 100))

  if (!video_id) {
    return NextResponse.json(
      {
        items: [],
        meta: {
          video_id: null,
          platform,
          limit: 0,
          message: 'video_id가 필요합니다.',
        },
      },
      { status: 400 }
    )
  }

  try {
    const db = getPool()

    // public.video 테이블에서 해당 비디오의 시계열 데이터 조회
    // crawled_at 기준으로 하루 단위로 그룹핑하여 최신 조회수 가져오기
    const query = `
      SELECT 
        DATE(crawled_at) as snapshot_date,
        MAX(view_count) as view_count,
        MAX(like_count) as like_count,
        MAX(comment_count) as comment_count
      FROM public.video
      WHERE video_id = $1
        AND platform = $2
        AND crawled_at IS NOT NULL
      GROUP BY DATE(crawled_at)
      ORDER BY snapshot_date ASC
      LIMIT $3
    `

    const result = await db.query(query, [video_id, platform, limit])

    if (result.rows.length === 0) {
      console.log(`No view history found for video_id: ${video_id}`)
      return NextResponse.json({
        history: [],
        meta: {
          video_id,
          platform,
          limit: 0,
          requested_limit: limit,
          message: '조회수 이력이 없습니다.',
        },
      })
    }

    // 날짜 순서대로 정렬 (오래된 것 -> 최신)
    const sortedByDate = result.rows.sort((a, b) => {
      const dateA = new Date(a.snapshot_date).getTime()
      const dateB = new Date(b.snapshot_date).getTime()
      return dateA - dateB
    })

    // 필요한 필드만 추출
    const history = sortedByDate.map((row) => ({
      snapshot_date: row.snapshot_date,
      view_count: Number(row.view_count) || 0,
      like_count: Number(row.like_count) || 0,
      comment_count: Number(row.comment_count) || 0,
    }))

    console.log(`View history loaded for ${video_id}: ${history.length} days`)

    return NextResponse.json({
      history,
      meta: {
        video_id,
        platform,
        limit: history.length,
        requested_limit: limit,
      },
    })
  } catch (error) {
    console.error('Failed to fetch video view history from database:', error)

    return NextResponse.json(
      {
        history: [],
        meta: {
          video_id,
          platform,
          limit: 0,
          message: '비디오 조회수 추이 데이터를 가져오는 중 오류가 발생했습니다.',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}

