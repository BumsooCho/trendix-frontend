'use client';

import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import TrendingVideosWidget from '@/app/components/Dashboard/Widgets/TrendingVideosWidget';
import ChannelAnalysisWidget from '@/app/components/Dashboard/Widgets/ChannelAnalysisWidget';
import VideoCompareWidget from '@/app/components/Dashboard/Widgets/VideoCompareWidget';
import VideoDetailModal from '@/app/components/Home/TrendingVideos/VideoDetailModal';
import { Video } from '@/app/components/Home/TrendingVideos/VideoCard';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- 위젯 타입 정의 ---
const WIDGET_TYPES = [
    { type: 'trendingVideos', name: '급등 영상', defaultW: 6, defaultH: 4 },
    { type: 'channelAnalysis', name: '내 채널 분석', defaultW: 6, defaultH: 4 },
    { type: 'videoCompare', name: '동영상 비교', defaultW: 6, defaultH: 4 },
    { type: 'hotKeywords', name: '지금 뜨는 키워드', defaultW: 6, defaultH: 2 },
];

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

const getInitialWidgets = () => [
  //  { i: '1', type: 'trendingVideos', name: '급등 영상' },
];

const generateLayouts = (widgets) => {
    const layouts = {};
    for (const breakpoint of Object.keys(breakpoints)) {
        layouts[breakpoint] = widgets.map((widget, index) => {
            const widgetType = WIDGET_TYPES.find(w => w.type === widget.type);
            const w = widgetType?.defaultW || 4;
            return {
                i: widget.i,
                x: (index * w) % (cols[breakpoint] || 12),
                y: Infinity, // compactType: 'vertical'이 위치를 잡아줍니다.
                w: w,
                h: widgetType?.defaultH || 2,
            }
        });
    }
    return layouts;
};


const DashboardClient = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [widgets, setWidgets] = useState([]);
    const [layouts, setLayouts] = useState({});
    const [detailVideo, setDetailVideo] = useState<Video | null>(null); // 비디오 상세 모달 상태

    useEffect(() => {
        let savedWidgets = null;
        let savedLayouts = null;
        try {
            savedWidgets = JSON.parse(localStorage.getItem('dashboard_widgets_v2'));
            savedLayouts = JSON.parse(localStorage.getItem('dashboard_layouts_v2'));
        } catch (error) { console.error("대시보드 데이터를 불러오는 중 오류 발생:", error); }

        if (savedWidgets && savedLayouts && savedWidgets.length > 0) {
            setWidgets(savedWidgets);
            setLayouts(savedLayouts);
        } else {
            const initialWidgets = getInitialWidgets();
            setWidgets(initialWidgets);
            setLayouts(generateLayouts(initialWidgets));
        }
    }, []);

    const handleLayoutChange = (layout, allLayouts) => { if (isEditMode) setLayouts(allLayouts); };

    const handleSave = () => {
        localStorage.setItem('dashboard_widgets_v2', JSON.stringify(widgets));
        localStorage.setItem('dashboard_layouts_v2', JSON.stringify(layouts));
        setIsEditMode(false);
    };
    
    const handleCancel = () => {
        let savedWidgets = null;
        let savedLayouts = null;
        try {
            savedWidgets = JSON.parse(localStorage.getItem('dashboard_widgets_v2'));
            savedLayouts = JSON.parse(localStorage.getItem('dashboard_layouts_v2'));
        } catch (error) { console.error("대시보드 데이터를 불러오는 중 오류 발생:", error); }
        if (savedWidgets && savedLayouts && savedWidgets.length > 0) {
            setWidgets(savedWidgets); 
            setLayouts(savedLayouts);
        } else {
            const initialWidgets = getInitialWidgets();
            setWidgets(initialWidgets); 
            setLayouts(generateLayouts(initialWidgets));
        }
        setIsEditMode(false);
    };

    const handleAddItem = (widgetType) => {
        const newItemId = String(Date.now());
        const newWidget = { i: newItemId, type: widgetType.type, name: widgetType.name };
        const updatedWidgets = [...widgets, newWidget];
        setWidgets(updatedWidgets);

        const newLayouts = { ...layouts };
        for (const breakpoint in newLayouts) {
            newLayouts[breakpoint] = [
                ...newLayouts[breakpoint],
                { i: newItemId, x: 0, y: Infinity, w: widgetType.defaultW, h: widgetType.defaultH }
            ];
        }
        setLayouts(newLayouts);
        setIsAddModalOpen(false);
    };

    const handleRemoveItem = (itemId) => {
        setWidgets(widgets.filter(w => w.i !== itemId));
        const newLayouts = { ...layouts };
        for (const breakpoint in newLayouts) {
            newLayouts[breakpoint] = newLayouts[breakpoint].filter(l => l.i !== itemId);
        }
        setLayouts(newLayouts);
    };

    // --- 모달 핸들러 ---
    const handleVideoClick = (video: Video) => {
        setDetailVideo(video);
    };
    const handleCloseModal = () => {
        setDetailVideo(null);
    };
    
    const renderWidgetContent = (widget) => {
        switch (widget.type) {
            case 'trendingVideos':
                return <TrendingVideosWidget onVideoClick={handleVideoClick} />;
            case 'channelAnalysis':
                return <ChannelAnalysisWidget />;
            case 'videoCompare':
                return <VideoCompareWidget />;
            default:
                return <span className="text-xl font-bold text-gray-700 dark:text-gray-300">{widget.name}</span>;
        }
    }

    const widgetStyle = 'bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden p-4';

    return (
        <div>
            <VideoDetailModal video={detailVideo} onClose={handleCloseModal} />

            {/* --- 컨트롤 버튼 --- */}
            <div className="mb-4 flex gap-2 justify-end">
                {!isEditMode ? (
                    <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">수정하기</button>
                ) : (
                    <>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">저장</button>
                        <button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">취소</button>
                        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">위젯 추가</button>
                    </>
                )}
            </div>

            {/* --- 위젯 추가 모달 --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[75vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">추가할 위젯 종류를 선택하세요</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {WIDGET_TYPES.map(widgetType => (
                                <button key={widgetType.type} onClick={() => handleAddItem(widgetType)} className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-100 text-center">
                                    <span className="mb-2 text-4xl">📊</span> {/* Placeholder for image */}
                                    {widgetType.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- 대시보드 그리드 --- */}
            {widgets.length > 0 ? (
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    onLayoutChange={handleLayoutChange}
                    breakpoints={breakpoints}
                    cols={cols}
                    rowHeight={100}
                    isDraggable={isEditMode}
                    isResizable={isEditMode}
                    compactType='vertical'
                    draggableCancel=".no-drag"
                >
                    {widgets.map((widget) => (
                        <div key={widget.i} className={widgetStyle}>
                            {renderWidgetContent(widget)}
                            {isEditMode && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleRemoveItem(widget.i); }}
                                    className="no-drag absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                    aria-label="Remove widget"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                        </div>
                    ))}
                </ResponsiveGridLayout>
            ) : (
                 <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                        <p className="text-lg text-gray-500">대시보드가 비어있습니다.</p>
                        {isEditMode ? <p className="text-sm text-gray-400">'위젯 추가' 버튼을 눌러 새 위젯을 만드세요.</p> : <p className="text-sm text-gray-400">'수정하기' 버튼을 눌러 대시보드 편집을 시작하세요.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardClient;
