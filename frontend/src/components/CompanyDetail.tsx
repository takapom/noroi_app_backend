'use client';

interface CompanyDetailProps {
  company: {
    id: string;
    title: string;
    time: string;
    color: 'orange' | 'purple';
    completed: boolean;
  };
  category: string;
  onClose: () => void;
}

export default function CompanyDetail({ company, category, onClose }: CompanyDetailProps) {
  const categoryLabels: { [key: string]: string } = {
    main: '本選考',
    intern: 'インターン選考',
    info: '説明会',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />

      {/* Detail View */}
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <div className="bg-white w-full sm:max-w-2xl sm:mx-4 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-200 rounded-t-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-task-text">企業詳細</h2>
              <button
                onClick={onClose}
                className="text-task-text-light hover:text-task-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Company Icon and Name */}
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  company.color === 'orange' ? 'bg-task-orange' : 'bg-task-purple'
                }`}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-task-text">{company.title}</h3>
                <span className="inline-block mt-1 px-3 py-1 bg-task-purple text-white text-sm rounded-full">
                  {categoryLabels[category]}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* 企業のマイページ/採用ページ */}
            <div className="bg-task-bg rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <h4 className="font-bold text-task-text">企業のマイページ/採用ページ</h4>
              </div>
              <input
                type="url"
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-task-text text-sm focus:outline-none focus:border-task-purple"
                placeholder="https://example.com/recruit"
                defaultValue=""
              />
              <p className="text-xs text-task-text-light mt-2">企業の採用ページやマイページのURLを入力してください</p>
            </div>

            {/* 志望理由 */}
            <div className="bg-task-bg rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h4 className="font-bold text-task-text">志望理由</h4>
              </div>
              <textarea
                className="w-full min-h-[100px] p-3 bg-white border border-gray-300 rounded-xl text-task-text text-sm focus:outline-none focus:border-task-purple resize-none"
                placeholder="この企業を志望する理由を記入してください..."
                defaultValue=""
              />
            </div>

            {/* この企業に入って何がやりたいか */}
            <div className="bg-task-bg rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="font-bold text-task-text">この企業に入って何がやりたいか</h4>
              </div>
              <textarea
                className="w-full min-h-[100px] p-3 bg-white border border-gray-300 rounded-xl text-task-text text-sm focus:outline-none focus:border-task-purple resize-none"
                placeholder="入社後に実現したいことや挑戦したいことを記入してください..."
                defaultValue=""
              />
            </div>

            {/* 就活軸 */}
            <div className="bg-task-bg rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h4 className="font-bold text-task-text">就活軸</h4>
              </div>
              <textarea
                className="w-full min-h-[100px] p-3 bg-white border border-gray-300 rounded-xl text-task-text text-sm focus:outline-none focus:border-task-purple resize-none"
                placeholder="あなたの就職活動における軸や価値観を記入してください..."
                defaultValue=""
              />
            </div>

            {/* 自分の強みがどう生きるか */}
            <div className="bg-task-bg rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-task-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h4 className="font-bold text-task-text">自分の強みがどう生きるか</h4>
              </div>
              <textarea
                className="w-full min-h-[100px] p-3 bg-white border border-gray-300 rounded-xl text-task-text text-sm focus:outline-none focus:border-task-purple resize-none"
                placeholder="あなたの強みがこの企業でどのように活かせるかを記入してください..."
                defaultValue=""
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 h-12 bg-task-purple text-white rounded-xl font-medium hover:bg-opacity-90 transition-all">
                保存
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-12 bg-task-bg text-task-text rounded-xl font-medium hover:bg-gray-300 transition-all"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
