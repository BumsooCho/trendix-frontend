# 비디오 조회수 추이 API 문서

## 개요
특정 비디오의 일별 조회수, 좋아요, 댓글 수 이력을 제공하는 API입니다. 날짜 순서대로 정렬된 데이터를 반환하며, 프론트엔드에서 막대 그래프로 시각화됩니다.

## API 엔드포인트

### GET `/api/trends/videos/{video_id}/view_history`

특정 비디오의 조회수 추이 데이터를 조회합니다.

#### 요청 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|--------|------|
| `video_id` | string | O | - | 조회할 비디오 ID (경로 파라미터) |
| `platform` | string | X | `youtube` | 플랫폼 (현재 youtube만 지원) |
| `limit` | number | X | `30` | 조회할 최대 일수 (1-100) |

#### 요청 예시

```bash
GET /api/trends/videos/B2-2ruHPz38/view_history?platform=youtube&limit=30
```

#### 응답 형식

```json
{
  "history": [
    {
      "snapshot_date": "2025-12-31",
      "view_count": 78881,
      "like_count": 1472,
      "comment_count": 97
    },
    {
      "snapshot_date": "2026-01-01",
      "view_count": 85000,
      "like_count": 1500,
      "comment_count": 100
    }
  ],
  "meta": {
    "video_id": "B2-2ruHPz38",
    "platform": "youtube",
    "limit": 2,
    "requested_limit": 30
  }
}
```

#### 응답 필드

**history[]**
- `snapshot_date` (string): 스냅샷 날짜 (YYYY-MM-DD 형식)
- `view_count` (number): 해당 날짜의 조회수
- `like_count` (number): 해당 날짜의 좋아요 수
- `comment_count` (number): 해당 날짜의 댓글 수

**meta**
- `video_id` (string): 조회한 비디오 ID
- `platform` (string): 플랫폼
- `limit` (number): 실제 반환된 데이터 개수
- `requested_limit` (number): 요청한 최대 개수

#### 오류 응답

```json
{
  "history": [],
  "meta": {
    "video_id": "invalid_id",
    "platform": "youtube",
    "limit": 0,
    "message": "조회수 이력이 없습니다."
  }
}
```

## 데이터베이스 구조

### SQL 쿼리

```sql
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
```

### 테이블 스키마 (public.video)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| video_id | varchar(100) | 비디오 고유 ID |
| platform | varchar(50) | 플랫폼 (youtube 등) |
| view_count | int8 | 조회수 |
| like_count | int8 | 좋아요 수 |
| comment_count | int8 | 댓글 수 |
| crawled_at | timestamp | 크롤링 시간 |

## 프론트엔드 구현

### 컴포넌트 위치
- `app/components/Home/TrendingVideos/VideoDetailModal.tsx`

### 그래프 특징

#### 1. 막대 그래프
- 각 날짜별 데이터를 막대로 표시
- 조회수와 좋아요 수를 별도 그래프로 시각화
- 색상:
  - 조회수: 파란색 (`bg-blue-500`)
  - 좋아요: 핑크색 (`bg-pink-500`)

#### 2. Y축 스케일
- 최댓값 = 현재 데이터의 실제 최댓값
- 최솟값 = 0
- 가장 높은 막대가 100% 높이로 표시되어 데이터 차이가 명확하게 보임

#### 3. X축 라벨
- 날짜를 짧은 형식으로 표시 (예: "1월 3일")
- 데이터가 많으면 간격을 두고 표시 (최대 ~10개)
- 첫 날짜와 마지막 날짜는 항상 표시

#### 4. 인터랙션
- 막대에 마우스 오버 시 툴팁 표시
- 툴팁에 날짜와 정확한 수치 표시

### 데이터 흐름

```
1. 비디오 카드 클릭
   ↓
2. VideoDetailModal 열림
   ↓
3. useEffect로 API 호출
   GET /api/trends/videos/{video_id}/view_history
   ↓
4. 응답 데이터를 날짜 순서대로 정렬
   ↓
5. 막대 그래프로 렌더링
```

### 코드 예시

```typescript
// API 호출
const res = await fetch(
  `${apiBaseUrl}/trends/videos/${video.id}/view_history?platform=youtube&limit=30`,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  }
)

// 데이터 처리
const data = await res.json()
const history: ViewHistoryItem[] = data.history || []

// 날짜 순서대로 정렬
const sortedByDate = history.sort((a, b) => {
  const dateA = new Date(a.snapshot_date).getTime()
  const dateB = new Date(b.snapshot_date).getTime()
  return dateA - dateB
})

// 그래프에 표시
setViewHistory(sortedByDate)
```

## 환경 설정

### 1. 데이터베이스 연결

`.env.local` 파일에 PostgreSQL 연결 정보를 추가하세요:

```bash
# PostgreSQL 데이터베이스 연결
DATABASE_URL=postgresql://username:password@host:port/database

# 또는
SQL_HOST=postgresql://username:password@host:port/database

# 예시
DATABASE_URL=postgresql://postgres:password@localhost:5432/trendix
```

### 2. 패키지 설치

```bash
npm install pg @types/pg
```

### 3. 서버 재시작

환경 변수 변경 후 Next.js 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 디버깅

### 콘솔 로그 확인

브라우저 개발자 도구 콘솔에서 다음 로그를 확인할 수 있습니다:

```javascript
// API 요청
Fetching view history from: http://localhost:8000/api/trends/videos/B2-2ruHPz38/view_history?platform=youtube&limit=30

// 데이터 로드 성공
View history loaded: 30 days
First date: 2025-12-05 view_count: 50000
Last date: 2026-01-03 view_count: 85000
```

### 일반적인 오류

#### 1. "NEXT_PUBLIC_API_BASE_URL is not defined"
- `.env.local` 파일에 `DATABASE_URL` 또는 `SQL_HOST` 추가
- 서버 재시작

#### 2. "Failed to fetch view history: 500"
- 데이터베이스 연결 확인
- `public.video` 테이블 존재 여부 확인
- PostgreSQL 서버 실행 상태 확인

#### 3. "조회수 이력이 없습니다"
- 해당 `video_id`가 데이터베이스에 존재하는지 확인
- `crawled_at` 필드가 NULL이 아닌지 확인

## 성능 최적화

### 1. 데이터베이스 인덱스

```sql
-- video_id와 platform을 조합한 인덱스 추가 (검색 성능 향상)
CREATE INDEX idx_video_id_platform_crawled 
ON public.video (video_id, platform, crawled_at);
```

### 2. 연결 풀링

API 라우트에서 PostgreSQL 연결 풀을 사용하여 성능 향상:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                      // 최대 연결 수
  idleTimeoutMillis: 30000,     // 유휴 타임아웃
  connectionTimeoutMillis: 2000 // 연결 타임아웃
})
```

### 3. 캐싱 전략

- API 응답을 클라이언트에서 캐싱 (선택사항)
- 같은 비디오를 재방문 시 빠른 로딩

## 향후 개선 사항

- [ ] 시간 단위 조회수 추이 지원
- [ ] 카테고리별 평균 대비 비교 기능
- [ ] CSV/Excel 다운로드 기능
- [ ] 그래프 확대/축소 기능
- [ ] 여러 비디오 비교 기능
- [ ] 실시간 업데이트 (WebSocket)

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

