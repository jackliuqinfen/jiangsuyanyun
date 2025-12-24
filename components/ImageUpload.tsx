
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = "上传图片", className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (!file) return;

    // Simple size check (limit to ~3MB for LocalStorage safety)
    if (file.size > 3 * 1024 * 1024) {
      alert("图片过大，请上传 3MB 以内的图片（LocalStorage 限制）");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (base64String) {
          onChange(base64String);
      }
    };
    reader.onerror = () => {
        alert("图片读取失败");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset value to ensure onChange triggers even for same file
        fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button 
               type="button"
               onClick={triggerFileSelect}
               className="p-2 bg-white rounded-full text-gray-700 hover:text-primary transition-colors"
               title="更换图片"
             >
               <Upload size={18} />
             </button>
             <button 
               type="button"
               onClick={() => onChange('')}
               className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
               title="移除图片"
             >
               <X size={18} />
             </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={triggerFileSelect}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          }`}
        >
          <div className="p-3 bg-blue-50 text-primary rounded-full mb-3">
             <ImageIcon size={24} />
          </div>
          <p className="text-sm font-medium text-gray-700">点击上传或拖拽图片至此</p>
          <p className="text-xs text-gray-400 mt-1">支持 PNG, JPG (Max 3MB)</p>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default ImageUpload;