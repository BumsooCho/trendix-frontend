import { Metadata } from 'next';
import DashboardClient from './DashboardClient';
import Breadcrumb from '../components/Common/Breadcrumb';

export const metadata: Metadata = {
    title: '대시보드 - Trendix',
    description: '나만의 대시보드를 구성하여 트렌드를 한눈에 파악하세요.',
};

const DashboardPage = () => {
    return (
        <>
            <Breadcrumb pageName="대시보드" pageDescription={metadata.description} />
            <div className="container mx-auto p-4">
                <DashboardClient />
            </div>
        </>
    );
};

export default DashboardPage;