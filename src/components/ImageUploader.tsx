import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { api } from '../services/api.ts';

interface ImageUploaderProps {
  label: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  aspectRatio?: 'square' | 'portrait' | 'video' | 'any';
  placeholderText?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImageUrl,
  onImageUploaded,
  aspectRatio = 'portrait',
  placeholderText = 'Pilih atau seret foto ke area ini',
  helperText = 'Format JPG, PNG, atau WebP (Maks. 5 MB)'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Hanya berkas gambar (JPG, PNG, WebP) yang diizinkan.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas 5 MB.`);
      return;
    }

    setIsUploading(true);
    try {
      const result = await api.uploadFile(file, file.name);
      onImageUploaded(result.url);
      setSuccessMsg('Gambar berhasil diunggah!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah gambar. Menggunakan pratinjau lokal.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'portrait' ? 'aspect-3/4' :
    aspectRatio === 'video' ? 'aspect-video' : 'h-36';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">{label}</label>
        {currentImageUrl && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Foto Tersedia
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Preview Frame */}
        {currentImageUrl ? (
          <div className="sm:col-span-4 relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
            <div className={`w-full ${aspectClass} overflow-hidden bg-slate-900/5 flex items-center justify-center`}>
              <img
                src={currentImageUrl}
                alt={label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/headmaster_sman1julok_1793290495217.jpg';
                }}
              />
            </div>

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                title="Ganti Foto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                <span className="text-[10px]">Ganti</span>
              </button>
              <button
                type="button"
                onClick={() => onImageUploaded('')}
                className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-600 text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                title="Hapus Foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Hapus</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Upload Dropzone */}
        <div className={currentImageUrl ? 'sm:col-span-8' : 'sm:col-span-12'}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragOver
                ? 'border-sky-500 bg-sky-50'
                : 'border-slate-300 hover:border-sky-500 hover:bg-slate-50/80 bg-white'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center">
              {isUploading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? 'Mengunggah foto...' : placeholderText}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Klik untuk memilih file dari komputer atau seret gambar ke sini
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-800 text-white text-[11px] font-bold shadow-2xs hover:bg-sky-700">
                <Camera className="w-3 h-3" />
                Pilih Berkas Foto
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>{helperText}</span>
        {currentImageUrl && (
          <span className="text-slate-400 font-mono truncate max-w-xs text-[10px]">
            {currentImageUrl.startsWith('data:') ? 'Data URL (Tersimpan)' : currentImageUrl}
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
