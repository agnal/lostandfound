import React, { useRef, useState } from 'react';
import { UploadIcon, XIcon } from 'lucide-react';

export const FileUpload = ({ onFileSelect, accept = 'image/*', maxSize = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileValidation = (file) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return false;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!handleFileValidation(file)) {
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={`flex flex-col w-full min-h-[93px] items-center justify-center py-8 px-6 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
            isDragging
              ? 'bg-[#1a1a1a] border-[#a0f1bd]'
              : 'bg-[#080707] border-neutral-300 hover:bg-[#1a1a1a] hover:border-[#a0f1bd]'
          }`}
        >
          <UploadIcon className="w-8 h-8 text-white mb-3" />
          <span className="font-inter text-white text-base text-center">
            {isDragging ? 'Drop image here' : 'Click or drag file to this area to upload image'}
          </span>
          <span className="font-inter text-gray-400 text-sm text-center mt-2">
            Max file size: {maxSize}MB
          </span>
        </div>
      ) : (
        <div className="relative w-full">
          <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-300">
            <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">{selectedFile?.name}</span>
            <span className="ml-2">({((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB)</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
      )}
    </div>
  );
};