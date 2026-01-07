import { categoryList } from "@/app/actions/categoryList";
import UserMain from "@/app/components/User/Main";
import { HotTrendType } from "@/types/hotTrend";

// 동적 라우트로 명시적 설정 (no-store fetch 사용으로 인한 빌드 에러 방지)
export const dynamic = 'force-dynamic';

export default async function UserMainPage() {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trends/categories/hot?limit=4&platform=youtube`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
            method: 'GET',
        });
        const data = await res.json();

        const hotTrend = await Promise.all(data.items.filter((category: HotTrendType) => category.category !== "uncategorized").map((category: HotTrendType) => categoryList(category.category, 4)));

        const flattenedList: Video[] = [];
        const maxLength = Math.max(...hotTrend.map(trend => trend.items?.length || 0));
        for (let i = 0; i < maxLength; i++) {
            for (const trend of hotTrend) {
                if (trend.items[i]) {
                    flattenedList.push({
                        ...trend.items[i]
                    });
                }
            }
        }

        return <UserMain hotTrend={flattenedList} />
    } catch (error) {
        console.log(error);
        return <div>
            <h1>에러가 발생했습니다.</h1>
        </div>
    }


}




