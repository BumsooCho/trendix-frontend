import ClientAuthGuard from "@/app/components/Auth/ClientAuthGuard";
import { VideoProvider } from "@/context/VideoContext";
import { InterestProvider } from "@/context/InterestContext";
import { interestList } from "@/app/utils/interestList";

export default async function UserLayout({ children }: { children: React.ReactNode }) {

    const interRestList = await interestList();

    return (
        <ClientAuthGuard>
            <InterestProvider initialInterestList={interRestList}>
                <VideoProvider>
                    <div className="container mx-auto max-w-7xl p-6 lg:pt-28 pt-16">
                        {children}
                    </div>
                </VideoProvider>
            </InterestProvider>
        </ClientAuthGuard>
    )
}