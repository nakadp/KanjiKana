import { ArrowLeft, Book, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';

export default function Vocab() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [vocabList, setVocabList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`/api/favorites?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          setVocabList(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch vocab list', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  return (
    <div className="flex flex-col h-screen bg-[var(--color-bg)]">
      <div className="flex items-center p-4 bg-white shadow-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-semibold text-gray-800 ml-2">生词本</h2>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium whitespace-nowrap">全部</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">按日期</button>
          <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">按五十音</button>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center items-center py-12 text-[var(--color-primary)]">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : vocabList.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              还没有收藏任何单词哦
            </div>
          ) : (
            vocabList.map((word, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{word.kanji}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{word.reading}</p>
                </div>
                <div className="flex items-center text-gray-400">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
