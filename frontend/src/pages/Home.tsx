import { Camera, Image as ImageIcon, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Assuming backend runs on 3001 locally, or use a relative path if proxied
      const res = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      setIsUploading(false);
      
      if (res.ok) {
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
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          disabled={isUploading}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors"
          onClick={() => {
            // For camera, could specify capture="environment" on a separate input
            fileInputRef.current?.click();
          }}
        >
          <div className="w-12 h-12 bg-green-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-3">
            {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
          </div>
          <span className="font-semibold text-gray-700">拍照/相册</span>
        </motion.button>

        {/* ... remaining unchanged */}

        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors"
          onClick={() => navigate('/reader')}
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
            <ImageIcon size={24} />
          </div>
          <span className="font-semibold text-gray-700">相册上传</span>
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
        
        {/* Placeholder for history */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-gray-400 text-center text-sm py-8">
            暂无历史识别记录
          </div>
        </div>
      </div>
    </div>
  );
}
