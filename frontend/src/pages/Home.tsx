import { Camera, Image as ImageIcon, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface HistoryItem {
  id: string;
  timestamp: number;
  preview: string;
  html: string;
}

export default function Home() {
  const navigate = useNavigate();
  const fileInputRefCamera = useRef<HTMLInputElement>(null);
  const fileInputRefUpload = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('kanjikana_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const previewText = temp.textContent || temp.innerText || '解析结果';
    
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      preview: previewText.substring(0, 30).trim() + '...',
      html: html
    };
    
    const newHistory = [newItem, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('kanjikana_history', JSON.stringify(newHistory));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 通过 Vite 代理发送请求，这样在手机上通过 ngrok 访问时才不会因为 localhost 找不到后端
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      setIsUploading(false);
      
      if (res.ok) {
        saveToHistory(data.html);
        navigate('/reader', { state: { html: data.html } });
      } else {
        alert('解析失败: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      setIsUploading(false);
      alert('请求错误: ' + err.message);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="text-center mt-4 mb-2">
        <h2 className="text-2xl font-bold text-gray-800">开始学习</h2>
        <p className="text-gray-500 text-sm mt-1">拍摄或上传日语文本，自动标注发音</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={fileInputRefCamera} 
        onChange={handleFileChange}
      />
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRefUpload} 
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          disabled={isUploading}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors"
          onClick={() => {
            fileInputRefCamera.current?.click();
          }}
        >
          <div className="w-12 h-12 bg-green-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-3">
            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
          </div>
          <span className="font-semibold text-gray-700">拍照</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          disabled={isUploading}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors"
          onClick={() => {
            fileInputRefUpload.current?.click();
          }}
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <ImageIcon size={24} />}
          </div>
          <span className="font-semibold text-gray-700">上传图片</span>
        </motion.button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">历史记录</h3>
          <button 
            onClick={() => navigate('/vocab')}
            className="text-sm font-medium text-[var(--color-primary)] flex items-center gap-1"
          >
            <BookOpen size={16} /> 生词本
          </button>
        </div>
        
        {history.length > 0 ? (
          <div className="flex flex-col gap-3">
            {history.map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate('/reader', { state: { html: item.html } })}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 transition-colors flex justify-between items-center"
              >
                <div className="truncate pr-4 text-gray-700 text-sm font-medium">{item.preview}</div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-gray-400 text-center text-sm py-8">
              暂无历史识别记录
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
