import { useState, type MouseEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedWord, setSelectedWord] = useState<any>(null);

  // Get HTML from routing state, or fallback to mock
  const htmlContent = location.state?.html || `
    <div class="text-xl leading-relaxed space-y-4">
      <p>没有收到分析结果，请返回首页重新上传图片。</p>
    </div>
  `;

  const handleWordClick = (e: MouseEvent<HTMLDivElement>) => {
    // Check if a ruby tag was clicked
    const target = e.target as HTMLElement;
    const ruby = target.closest('ruby');
    
    if (ruby) {
      setSelectedWord({
        kanji: ruby.getAttribute('data-kanji') || ruby.textContent?.split('\n')[0] || '',
        reading: ruby.getAttribute('data-reading') || '',
        romaji: ruby.getAttribute('data-romaji') || '',
        meaning: '暂无释义 (待连接字典API)',
        jlpt: '未知'
      });
    } else {
      setSelectedWord(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)]">
      {/* Reader Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-semibold text-gray-800">阅读结果</h2>
        <button onClick={() => setShowRomaji(!showRomaji)} className="p-2 -mr-2 text-gray-600">
          {showRomaji ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      </div>

      {/* Reader Content Area */}
      <div 
        className={`flex-1 overflow-y-auto p-6 bg-[var(--color-bg)] custom-reader ${!showRomaji ? 'hide-rt' : ''}`}
        onClick={handleWordClick}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="text-gray-800"
        />
      </div>

      {/* Bottom Sheet for Word Details */}
      <AnimatePresence>
        {selectedWord && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedWord(null)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl z-50 p-6 pb-10"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              
              <div className="text-center mb-6">
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{selectedWord.kanji}</h3>
                <p className="text-lg text-gray-600">{selectedWord.reading} {showRomaji && <span className="text-gray-400 text-sm ml-2">[{selectedWord.romaji}]</span>}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <p className="text-gray-700 font-medium">释义：</p>
                <p className="text-gray-600 mt-1">{selectedWord.meaning}</p>
                <div className="mt-3 inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  JLPT {selectedWord.jlpt}
                </div>
              </div>

              <button className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform">
                <Star size={24} fill="white" />
                加入收藏
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
