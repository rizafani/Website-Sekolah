import React, { useState } from 'react';
import { 
  Award, 
  GraduationCap, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  HelpCircle, 
  Search,
  Share2,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface BeasiswaViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const BeasiswaView: React.FC<BeasiswaViewProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pemerintah' | 'sekolah' | 'sosial'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const scholarships = [
    {
      id: 'pip',
      title: 'Program Indonesia Pintar (PIP) Kemendikbudristek',
      category: 'pemerintah',
      categoryLabel: 'Bantuan Pemerintah Pusat',
      amount: 'Rp 1.800.000 / Tahun',
      target: 'Siswa Pemegang KIP / Terdaftar DTKS Kemensos',
      deadline: 'Penyaluran Tiap Semester Ganjil & Genap',
      badge: 'Bantuan Tunai Pendidikan',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Bantuan uang tunai dari pemerintah pusat bagi peserta didik jenjang SMA dari keluarga prasejahtera untuk mencegah putus sekolah dan menjamin kelancaran belajar di SMA Negeri 1 Julok.',
      requirements: [
        'Terdaftar aktif di Dapodik SMAN 1 Julok',
        'Memiliki Kartu Indonesia Pintar (KIP) atau Surat Keterangan Tidak Mampu (SKTM) dari Keuchik Desa',
        'Fotokopi Kartu Keluarga (KK) & KTP Orang Tua / Wali',
        'Buku Tabungan SimPel BRI/BNI teraktivasi'
      ],
      quota: '180+ Kuota Penerima Aktif'
    },
    {
      id: 'aceh-carong',
      title: 'Beasiswa Aceh Carong (Pemerintah Aceh)',
      category: 'pemerintah',
      categoryLabel: 'Pemerintah Provinsi Aceh',
      amount: 'Bantuan Pendidikan & Uang Saku',
      target: 'Siswa Kurang Mampu Berprestasi se-Aceh',
      deadline: 'Sesuai Edaran BPSDM Aceh',
      badge: 'Program Prioritas Aceh',
      badgeColor: 'bg-sky-100 text-sky-800',
      description: 'Program unggulan Pemerintah Aceh untuk melahirkan generasi emas Aceh yang cerdas (Carong) dan berakhlak mulia melalui fasilitasi bantuan pendidikan berkelanjutan hingga jenjang perguruan tinggi.',
      requirements: [
        'Warga Negara Indonesia berdomisili di Aceh (KTP/KK Aceh)',
        'Rapor dengan nilai rata-rata minimal 80 untuk mata pelajaran sains/sosial',
        'Surat rekomendasi resmi dari Kepala SMAN 1 Julok',
        'Bebas narkoba dan berkelakuan baik'
      ],
      quota: 'Seleksi Provinsi Terpadu'
    },
    {
      id: 'tahfiz-sekolah',
      title: 'Beasiswa Prestasi Tahfiz & OSN SMAN 1 Julok',
      category: 'sekolah',
      categoryLabel: 'Program Internal Sekolah',
      amount: 'Pembebasan Biaya & Penghargaan Pembinaan',
      target: 'Penghafal Al-Qur\'an Minimal 1 Juz & Juara Lomba',
      deadline: 'Dibuka Setiap Tahun Ajaran Baru',
      badge: 'Penghargaan Institusi',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Bentuk apresiasi komite dan dewan guru SMA Negeri 1 Julok bagi siswa yang memiliki hafalan Al-Qur\'an serta peraih medali dalam Olimpiade Sains Nasional (OSN) dan Festival Lomba Seni Siswa (FLS2N).',
      requirements: [
        'Lulus uji syahadah / munaqasyah hafalan Al-Qur\'an oleh tim keagamaan sekolah',
        'Piagam / sertifikat kejuaraan minimal tingkat Kabupaten Aceh Timur',
        'Menjadi teladan kedisiplinan dan akhlak di lingkungan sekolah'
      ],
      quota: '40 Penerima / Tahun'
    },
    {
      id: 'baznas-atim',
      title: 'Bantuan Biaya Pendidikan BAZNAS Kabupaten Aceh Timur',
      category: 'sosial',
      categoryLabel: 'Baitul Mal & BAZNAS',
      amount: 'Bantuan Seragam, Buku & Transportasi',
      target: 'Siswa Asnaf Fakir, Miskin & Yatim Piatu',
      deadline: 'Semester Ganjil',
      badge: 'Dana Zakat Infaq Sedekah',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Penyaluran zakat produktif dan beasiswa pendidikan dari Baitul Mal / BAZNAS Kabupaten Aceh Timur untuk membantu santri/siswa yatim dan prasejahtera di Kecamatan Julok.',
      requirements: [
        'Surat keterangan yatim/piatu atau dhuafa dari Keuchik Gampong Buket Seuraja / desa asal',
        'Rekomendasi dari Bimbingan Konseling (BK) SMAN 1 Julok',
        'Fotokopi Kartu Tanda Siswa (KTS) & KK'
      ],
      quota: '50 Siswa Terfasilitasi'
    }
  ];

  const filtered = scholarships.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <Breadcrumbs
        items={[
          { label: 'Beranda', view: 'beranda' },
          { label: 'Pusat Informasi', view: 'berita' },
          { label: 'Beasiswa & Bantuan Siswa' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-sky-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Akses Pendidikan Berkeadilan & Merata</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Informasi Beasiswa & Bantuan Siswa
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              SMA Negeri 1 Julok berkomitmen memastikan tidak ada peserta didik yang terkendala menuntut ilmu karena faktor ekonomi. Temukan peluang beasiswa pemerintah, institusi, dan yayasan mitra di sini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
            </button>
            <button
              onClick={() => onNavigate('unduhan')}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Formulir Pengajuan Beasiswa</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        {/* Search & Tabs Filter Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua Beasiswa' },
              { id: 'pemerintah', label: 'Pemerintah (Pusat & Aceh)' },
              { id: 'sekolah', label: 'Prestasi & Tahfiz SMAN 1' },
              { id: 'sosial', label: 'Baitul Mal & BAZNAS' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-sky-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari beasiswa atau bantuan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {item.amount}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Target & Deadline Info */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Sasaran:</span>
                    <strong className="text-slate-800 font-semibold">{item.target}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Jadwal:</span>
                    <strong className="text-slate-800 font-semibold">{item.deadline}</strong>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800">Persyaratan Utama:</h4>
                  <ul className="space-y-1.5">
                    {item.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.quota}</span>
                <button
                  onClick={() => onNavigate('kontak')}
                  className="text-sky-800 hover:text-sky-950 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Konsultasi Syarat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Procedural Steps Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900">Alur Pengajuan & Verifikasi Beasiswa di Sekolah</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ikuti 4 langkah mudah untuk mengajukan permohonan rekomendasi dan aktivasi rekening beasiswa di SMA Negeri 1 Julok.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Pengumpulan Berkas',
                desc: 'Lengkapi formulir pengajuan, fotokopi KIP/SKTM, Kartu Keluarga, dan rapor ke ruang Bimbingan Konseling (BK).'
              },
              {
                step: '02',
                title: 'Verifikasi Dapodik',
                desc: 'Operator Dapodik memvalidasi data siswa pada sistem kementerian dan memastikan kelayakan usulan (DTKS).'
              },
              {
                step: '03',
                title: 'Penerbitan SK Sekolah',
                desc: 'Kepala Sekolah menerbitkan Surat Keputusan (SK) dan rekomendasi resmi usulan calon penerima beasiswa.'
              },
              {
                step: '04',
                title: 'Penyaluran & Pencairan',
                desc: 'Dana beasiswa disalurkan langsung ke rekening SimPel siswa di bank mitra (BRI/BNI/BSI) tanpa potongan apapun.'
              }
            ].map((stepItem) => (
              <div key={stepItem.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-2xl font-black text-sky-800 block">{stepItem.step}</span>
                <h4 className="font-bold text-xs text-slate-900">{stepItem.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
