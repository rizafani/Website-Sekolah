import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  Image as ImageIcon, 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Table as TableIcon, 
  Minus, 
  Link as LinkIcon, 
  Eye, 
  Edit3, 
  Globe, 
  Copy, 
  Check, 
  Sparkles, 
  Tag as TagIcon, 
  Calendar, 
  User, 
  Share2, 
  Clock, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { EditorialArticle, PermissionKey } from '../types/index.ts';
import { ImageUploader } from './ImageUploader.tsx';
import { api } from '../services/api.ts';

interface RichArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: EditorialArticle | null;
  onSave: (articleData: Partial<EditorialArticle>) => Promise<EditorialArticle | void>;
  userPermissions: PermissionKey[];
  currentUserRole?: string;
}

export const RichArticleEditorModal: React.FC<RichArticleEditorModalProps> = ({
  isOpen,
  onClose,
  article,
  onSave,
  userPermissions,
  currentUserRole
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<EditorialArticle['category']>('Kegiatan');
  const [status, setStatus] = useState<EditorialArticle['status']>('draft');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_sman1julok_1793290495969.jpg');
  const [tags, setTags] = useState<string[]>(['SMAN 1 Julok']);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isUploadingInline, setIsUploadingInline] = useState(false);
  const [publishedUrlResult, setPublishedUrlResult] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setSlug(article.slug || generateSlug(article.title || ''));
      setCategory(article.category || 'Kegiatan');
      setStatus(article.status || 'draft');
      setExcerpt(article.excerpt || '');
      setContent(article.content || '');
      setImageUrl(article.imageUrl || '/src/assets/images/hero_sman1julok_1793290495969.jpg');
      setTags(Array.isArray(article.tags) ? article.tags : ['SMAN 1 Julok']);
    } else {
      setTitle('');
      setSlug('');
      setCategory('Kegiatan');
      setStatus('draft');
      setExcerpt('');
      setContent('');
      setImageUrl('/src/assets/images/hero_sman1julok_1793290495969.jpg');
      setTags(['SMAN 1 Julok', 'Buket Seuraja']);
    }
    setActiveTab('editor');
    setPublishedUrlResult(null);
  }, [article, isOpen]);

  if (!isOpen) return null;

  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!article) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Text formatting tools
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Inline Image Upload Handler
  const handleInlineImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Hanya berkas gambar yang dapat disisipkan.');
      return;
    }

    setIsUploadingInline(true);
    try {
      const result = await api.uploadFile(file, `inline_${file.name}`);
      const caption = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      const imageMarkdown = `\n\n![${caption}](${result.url})\n*Dokumentasi: ${caption}*\n\n`;

      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
        setContent(newContent);
      } else {
        setContent((prev) => prev + imageMarkdown);
      }
    } catch {
      alert('Gagal mengunggah gambar inline.');
    } finally {
      setIsUploadingInline(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const articleFullUrl = `https://sman1julok.sch.id/#/berita/${slug || 'artikel'}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(articleFullUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: EditorialArticle['status']) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Judul dan isi artikel wajib diisi!');
      return;
    }

    const finalStatus = overrideStatus || status;
    const finalSlug = slug.trim() || generateSlug(title);

    setIsSaving(true);
    try {
      const savedArticle = await onSave({
        title: title.trim(),
        slug: finalSlug,
        category,
        status: finalStatus,
        excerpt: excerpt.trim() || title.substring(0, 140),
        content,
        imageUrl: imageUrl || '/src/assets/images/hero_sman1julok_1793290495969.jpg',
        tags
      });

      if (finalStatus === 'published') {
        setPublishedUrlResult(`https://sman1julok.sch.id/#/berita/${finalSlug}`);
      } else {
        onClose();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan artikel.');
    } finally {
      setIsSaving(false);
    }
  };

  // Metrics
  const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charsCount = content.length;
  const readTimeMin = Math.max(1, Math.ceil(wordsCount / 180));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {article ? 'Edit Berita & Artikel Sekolah' : 'Menu Editor Berita & Artikel Lengkap'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-400" />
                  URL Publik:
                </span>
                <span className="text-xs text-sky-300 font-mono truncate max-w-xs sm:max-w-md">
                  {articleFullUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                  title="Salin URL Artikel"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editor Konten
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Pratinjau Halaman ({wordsCount} kata)
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-white flex-1">
          {publishedUrlResult ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Artikel Berhasil Diterbitkan!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Artikel Anda telah aktif di portal publik SMA Negeri 1 Julok dan dapat diakses langsung melalui URL resmi:
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-emerald-200 max-w-lg mx-auto">
                <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-mono font-semibold text-slate-800 truncate select-all">
                  {publishedUrlResult}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer shrink-0"
                >
                  {copiedUrl ? 'Tersalin!' : 'Salin URL'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href={`#/berita/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-sky-800 text-white text-xs font-bold hover:bg-sky-700 shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  Buka Halaman Artikel
                  <Globe className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          ) : activeTab === 'editor' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cover Image Upload (No URL input needed!) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <ImageUploader
                  label="Gambar Sampul / Foto Utama Artikel"
                  currentImageUrl={imageUrl}
                  onImageUploaded={(url) => setImageUrl(url)}
                  aspectRatio="video"
                  placeholderText="Pilih atau seret foto sampul artikel ke sini"
                  helperText="Format JPG, PNG, atau WebP (Disarankan rasio landscape 16:9)"
                />
              </div>

              {/* Title & Slug */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Artikel Lengkap</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Contoh: Siswa SMAN 1 Julok Juara 1 Olimpiade Sains Nasional Tingkat Provinsi Aceh"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 shadow-2xs"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                      URL Slug:
                    </span>
                    <span className="text-xs font-mono text-slate-400 shrink-0">https://sman1julok.sch.id/#/berita/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(generateSlug(e.target.value))}
                      placeholder="slug-artikel"
                      className="text-xs font-mono font-bold text-sky-800 bg-white px-2 py-1 border border-slate-200 rounded-md focus:ring-1 focus:ring-sky-500 flex-1 min-w-[150px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-sky-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md cursor-pointer shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Tersalin' : 'Salin URL'}</span>
                  </button>
                </div>
              </div>

              {/* Category, Status, & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Berita</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Kegiatan">Kegiatan Sekolah</option>
                    <option value="Prestasi">Prestasi &amp; Lomba</option>
                    <option value="Akademik">Akademik &amp; Kurikulum</option>
                    <option value="Pengumuman">Pengumuman Resmi</option>
                    <option value="Artikel Siswa">Artikel Siswa &amp; Literasi</option>
                    <option value="Budaya & Agama">Budaya &amp; Nilai Islami</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 font-semibold"
                  >
                    <option value="draft">Draf (Disimpan Lokal / Editor)</option>
                    <option value="pending_approval">Menunggu Persetujuan Redaksi</option>
                    {(userPermissions.includes('content.approve') || currentUserRole === 'super_admin' || currentUserRole === 'admin_sekolah') && (
                      <option value="approved">Disetujui untuk Terbit</option>
                    )}
                    {(userPermissions.includes('content.publish') || currentUserRole === 'super_admin' || currentUserRole === 'admin_sekolah') && (
                      <option value="published">Diterbitkan (Live di Website Publik)</option>
                    )}
                    <option value="scheduled">Terjadwal Otomatis</option>
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tag / Label Berita</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Ketik tag lalu tekan enter..."
                      className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tag Chips */}
              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 text-[11px] font-semibold border border-sky-100"
                    >
                      <TagIcon className="w-3 h-3 text-sky-600" />
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-rose-600 ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ringkasan / Kutipan Berita (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang akan tampil pada kartu berita dan snippet Google..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Rich Content Editor with Formatting Toolbar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Isi Konten Artikel Lengkap
                  </label>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3">
                    <span>{wordsCount} kata</span>
                    <span>{charsCount} karakter</span>
                    <span className="flex items-center gap-1 text-sky-700 font-semibold">
                      <Clock className="w-3 h-3" />
                      {readTimeMin} menit baca
                    </span>
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border border-slate-200 rounded-t-xl text-xs">
                  <button
                    type="button"
                    onClick={() => insertFormatting('## ', '\n', 'Subjudul Bagian')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold"
                    title="Heading 2 (## Subjudul)"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ', '\n', 'Sub-subjudul')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold"
                    title="Heading 3 (### Judul Kecil)"
                  >
                    <span className="text-[11px] font-black">H3</span>
                  </button>
                  <div className="w-px h-4 bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**', 'teks tebal')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 font-bold"
                    title="Tebal (**Teks**)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*', 'teks miring')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 italic"
                    title="Miring (*Teks*)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>', 'teks garis bawah')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 underline"
                    title="Garis Bawah"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => insertFormatting('> ', '\n', 'Kutipan penting atau pernyataan narasumber')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                    title="Kutipan (> Kutipan)"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ', '\n', 'Poin daftar')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                    title="Daftar Poin (- Poin)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('1. ', '\n', 'Poin nomor')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                    title="Daftar Nomor (1. Poin)"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n| Kolom 1 | Kolom 2 |\n|---------|---------|\n| Data A  | Data B  |\n')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                    title="Sisipkan Tabel"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n---\n')}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700"
                    title="Garis Pemisah (---)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-slate-300 mx-1" />

                  {/* Inline Image Upload Button */}
                  <input
                    ref={inlineFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleInlineImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingInline}
                    onClick={() => inlineFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold transition-colors cursor-pointer text-[11px]"
                    title="Unggah dan Sisipkan Gambar ke dalam Artikel"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-sky-700" />
                    <span>{isUploadingInline ? 'Mengunggah...' : 'Sisipkan Gambar'}</span>
                  </button>
                </div>

                {/* Editor Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={12}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan berita lengkap di sini. Gunakan tombol pemformatan di atas untuk subjudul, kutipan, tabel, atau sisipkan foto dokumentasi tambahan..."
                  className="w-full px-4 py-3 text-xs sm:text-sm border border-slate-200 rounded-b-xl focus:ring-2 focus:ring-sky-500 font-sans leading-relaxed resize-y"
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold">Status target:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'pending_approval'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {status === 'published' && 'Diterbitkan (Live)'}
                    {status === 'pending_approval' && 'Menunggu Persetujuan'}
                    {status === 'approved' && 'Disetujui'}
                    {status === 'draft' && 'Draf'}
                    {status === 'scheduled' && 'Terjadwal'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={(e) => handleSubmit(e, 'draft')}
                    className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 cursor-pointer"
                  >
                    Simpan Draf
                  </button>

                  {(userPermissions.includes('content.publish') || currentUserRole === 'super_admin' || currentUserRole === 'admin_sekolah') ? (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={(e) => handleSubmit(e, 'published')}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {isSaving ? 'Menyimpan...' : 'Terbitkan Sekarang'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={(e) => handleSubmit(e, 'pending_approval')}
                      className="px-5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                    >
                      {isSaving ? 'Mengajukan...' : 'Ajukan Persetujuan'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : (
            /* Live Preview Tab */
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Eye className="w-4 h-4 text-sky-700" />
                  Pratinjau Halaman Berita Publik (Tampilan Langsung Pengunjung)
                </span>
                <span className="font-mono text-[11px] text-sky-700 truncate max-w-xs">
                  {articleFullUrl}
                </span>
              </div>

              {/* Article Header Preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                    {category}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {readTimeMin} menit baca
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {title || 'Judul Artikel Belum Diisi'}
                </h1>

                {excerpt && (
                  <p className="text-sm font-medium text-slate-600 italic border-l-4 border-sky-600 pl-3 py-1">
                    {excerpt}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              {imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-sm">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Formatted Content Preview */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-800">
                {content || 'Isi artikel masih kosong. Silakan kembali ke tab Editor untuk menulis berita.'}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                    <TagIcon className="w-3.5 h-3.5" />
                    Tag:
                  </span>
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
