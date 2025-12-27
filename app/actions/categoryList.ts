'use server'
export const categoryList = async (category: string, count: number) => {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trends/categories/${category}/recommendations?limit=${count}&days=90&platform=youtube `, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
            method: 'GET',
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}