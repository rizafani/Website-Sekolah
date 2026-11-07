import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ExternalLink, 
  Globe, 
  Check, 
  Copy, 
  MapPin, 
  Phone, 
  Award, 
  UserCheck, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';
import { initialData } from '../data/initialData.ts';

interface GoogleSearchSitelinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SchoolSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const GoogleSearchSitelinksModal: React.FC<GoogleSearchSitelinksModalProps> = ({
  isOpen,
  onClose,
  settings: propSettings,
  onNavigate
}) => {
  const settings = propSettings || initialData.settings;
  const [searchQuery, setSearchQuery] = useState('SMA Negeri 1 Julok');
  const [activeTab, setActiveTab] = useState<'serp' | 'schema'>('serp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sitelinks = [
    {
      title: 'Profil & Visi Misi',
      view: 'profil',
      slug: 'profil',
      description: 'Identitas resmi sekolah, sejarah berdirinya SMAN 1 Julok, akreditasi A (Unggul), dan visi misi pendidikan berkarakter.',
      icon: Award
    },
    {
      title: 'Pendaftaran SPMB Online',
      view: 'spmb',
      slug: 'spmb',
      description: 'Informasi penerimaan murid baru, jalur zonasi, afirmasi, prestasi, jadwal seleksi, kuota, dan formulir pendaftaran PPDB.',
      icon: GraduationCap
    },
    {
      title: 'Berita & Artikel Sekolah',
      view: 'berita',
      slug: 'berita',
      description: 'Kabar terkini seputar prestasi siswa di OSN, inovasi guru, karya jurnalistik, dan dokumentasi kegiatan sekolah.',
      icon: FileText
    },
    {
      title: 'Dewan Guru & Tendik',
      view: 'guru',
      slug: 'guru',
      description: 'Direktori lengkap 38 guru mata pelajaran, kepala sekolah, staf tata usaha, dan profil tenaga kependidikan.',
      icon: UserCheck
    },
    {
      title: 'Kalender & Jadwal Pelajaran',
      view: 'agenda',
      slug: 'agenda',
      description: 'Jadwal kegiatan belajar mengajar, asesmen sumatif kurikulum merdeka, kalender akademik, dan agenda kegiatan tahunan.',
      icon: Calendar
    },
    {
      title: 'E-Rapor & Layanan Digital',
      view: 'layanan-digital',
      slug: 'layanan-digital',
      description: 'Portal mandiri pengecekan nilai rapor siswa, aplikasi CBT ujian digital sekolah, dan perpustakaan daring.',
      icon: BookOpen
    }
  ];

  const handleSitelinkClick = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const schemaJson = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://sman1julok.sch.id/#website",
          "url": "https://sman1julok.sch.id/",
          "name": settings.name || "SMA Negeri 1 Julok",
          "alternateName": settings.shortName || "SMAN 1 Julok",
          "description": "Website Resmi SMA Negeri 1 Julok, Buket Seuraja, Aceh Timur.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://sman1julok.sch.id/#/berita?cari={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "hasPart": sitelinks.map((s) => ({
            "@type": "WebPage",
            "@id": `https://sman1julok.sch.id/#/${s.slug}`,
            "name": s.title,
            "url": `https://sman1julok.sch.id/#/${s.slug}`,
            "description": s.description
          }))
        }
      ]
    },
    null,
    2
  );

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white shadow-xs">
              G
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Hasil Pencarian Google dengan Sitelinks
              </h3>
              <p className="text-xs text-slate-300">
                Pratinjau SERP Google &amp; Schema.org Sitelinks Searchbox SMA Negeri 1 Julok
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('serp')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  activeTab === 'serp'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Pratinjau Google SERP
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  activeTab === 'schema'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                JSON-LD Schema
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-white">
          {activeTab === 'serp' ? (
            <div className="space-y-5">
              {/* Google Search Bar Mockup */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex font-black text-xl tracking-tight select-none">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-full shadow-2xs focus:outline-none focus:border-sky-500 font-sans"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick keyword suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/80 text-[11px]">
                  <span className="text-slate-500 font-semibold">Coba kata kunci:</span>
                  {[
                    'SMA Negeri 1 Julok',
                    'SPMB SMAN 1 Julok 2026',
                    'Kepala Sekolah SMAN 1 Julok',
                    'Dewan Guru SMAN 1 Julok'
                  ].map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setSearchQuery(kw)}
                      className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        searchQuery === kw
                          ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* SERP Search Info */}
              <div className="text-[12px] text-slate-500 px-1 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Sekitar 48.200 hasil (0,32 detik)</span>
                <span className="text-sky-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Sitelinks Google Terverifikasi Aktif
                </span>
              </div>

              {/* SERP Result Card with Sitelinks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Search Result & Sitelinks Grid (2 Cols on desktop) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-1">
                    {/* URL Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-sky-800 text-white flex items-center justify-center font-bold text-[10px]">
                        J
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-medium text-slate-800 leading-tight">
                          SMA Negeri 1 Julok
                        </span>
                        <span className="text-[11px] text-slate-500 truncate leading-tight">
                          https://sman1julok.sch.id › profil
                        </span>
                      </div>
                    </div>

                    {/* Blue Title */}
                    <h4
                      onClick={() => handleSitelinkClick('profil')}
                      className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug pt-1"
                    >
                      {settings.name || 'SMA Negeri 1 Julok'} - Buket Seuraja, Aceh Timur (Website Resmi)
                    </h4>

                    {/* Meta Description Snippet */}
                    <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed pt-0.5">
                      Website Resmi SMA Negeri 1 Julok, Desa Buket Seuraja, Kec. Julok, Kab. Aceh Timur, Aceh. 
                      Portal akademik terakreditasi {settings.accreditation || 'A (Unggul)'}, pendaftaran murid baru (SPMB), 
                      informasi dewan guru, E-Rapor online, kalender akademik, dan layanan digital sekolah.
                    </p>
                  </div>

                  {/* ---------------------------------------------------- */}
                  {/* GOOGLE SITELINKS 2-COLUMN GRID (THE REQUESTED FEATURE) */}
                  {/* ---------------------------------------------------- */}
                  <div className="pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                      <span>Sitelinks Hasil Pencarian Terkait</span>
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-emerald-200">
                        Klik untuk Buka Halaman Langsung
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-3 border-l-2 border-sky-600/60">
                      {sitelinks.map((site) => {
                        const Icon = site.icon;
                        return (
                          <div
                            key={site.slug}
                            onClick={() => handleSitelinkClick(site.view)}
                            className="group p-3 rounded-xl border border-slate-200/90 hover:border-sky-400 hover:bg-sky-50/40 hover:shadow-xs transition-all cursor-pointer bg-white"
                          >
                            <div className="flex items-start gap-2">
                              <div className="p-1 rounded-md bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 text-[13px] font-semibold text-[#1a0dab] group-hover:underline">
                                  <span>{site.title}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                  {site.description}
                                </p>
                                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                                  sman1julok.sch.id/#/{site.slug}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Google Knowledge Panel Card on right */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200 border border-slate-200">
                    <img
                      src={settings.heroImageUrl || '/src/assets/images/hero_sman1julok_1793290495969.jpg'}
                      alt="Gedung SMAN 1 Julok"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-bold text-white drop-shadow-xs">
                        Gedung &amp; Kampus SMAN 1 Julok
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{settings.name}</h5>
                    <p className="text-xs text-slate-500">Sekolah Menengah Atas Negeri di Aceh Timur</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSitelinkClick('beranda')}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-800 text-white text-xs font-bold hover:bg-sky-700 cursor-pointer shadow-xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Situs Web
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSitelinkClick('kontak')}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      Rute &amp; Peta
                    </button>
                  </div>

                  {/* Details List */}
                  <div className="text-xs space-y-2.5 pt-2 border-t border-slate-200 text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{settings.address || 'Jl. Lintas Medan - Banda Aceh Km. 362, Desa Buket Seuraja, Julok'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{settings.phone || '+62 812-6900-1122'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>NPSN: <strong>{settings.npsn || '10102148'}</strong> (Akreditasi {settings.accreditation || 'A'})</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Kepala Sekolah:</span>
                        <span className="font-semibold text-slate-900">{settings.principalName || 'Drs. T. Muhammad Yusuf, M.Pd.'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Kode Schema.org JSON-LD (Google Sitelinks Searchbox)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Struktur data ini telah ditanamkan ke dalam &lt;head&gt; halaman website secara otomatis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-800 text-white text-xs font-semibold hover:bg-sky-700 cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin!' : 'Salin Kode JSON-LD'}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-400 text-xs font-mono rounded-xl overflow-x-auto border border-slate-800 max-h-96">
                {schemaJson}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            Terhubung langsung ke rute navigasi publik SMA Negeri 1 Julok
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
