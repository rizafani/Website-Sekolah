import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Bell, 
  Award, 
  BookOpen, 
  Users, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  GraduationCap, 
  FileText, 
  Globe, 
  Play,
  Clock
} from 'lucide-react';
import { DatabaseSchema, GalleryItem, NewsItem, SchoolPoll } from '../types/index.ts';
import { PollWidget } from '../components/PollWidget.tsx';

interface HomeViewProps {
  data: DatabaseSchema;
  onNavigate: (view: string, param?: string) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  onOpenDigitalServices: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  data,
  onNavigate,
  onOpenLightbox,
  onOpenDigitalServices
}) => {
  const { settings, news, announcements, events, achievements, galleries } = data;
  const latestNews = news.slice(0, 3);
  const urgentAnnouncements = announcements.filter(a => a.isUrgent).slice(0, 2);
  const upcomingEvents = events.slice(0, 3);
  const topAchievements = achievements.slice(0, 3);
  const featuredGalleries = galleries.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Measured Scrim */}
        <div className="absolute inset-0">
          <img
            src={settings.heroImageUrl || "/src/assets/images/hero_sman1julok_1793290495969.jpg"}
            alt="Kampus SMA Negeri 1 Julok di Buket Seuraja"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-in motion-safe:fade-in duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            
            {/* School Kicker - Clean unboxed metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <span>Selamat Datang di Website Resmi</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Desa Buket Seuraja, Julok, Aceh Timur</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-balance">
              {settings.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              "{settings.tagline}"
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              Mendidik generasi unggul, berakhlak mulia sesuai syariat Serambi Mekkah, menguasai ilmu pengetahuan dan teknologi, serta berdaya saing global melalui Kurikulum Merdeka.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('spmb')}
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-sky-950/50 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pendaftaran SPMB Online</span>
              </button>

              <button
                onClick={() => onNavigate('profil')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-colors border border-white/20 cursor-pointer"
              >
                Profil & Sejarah Sekolah
              </button>

              <button
                onClick={onOpenDigitalServices}
                className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-semibold text-sm transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Layanan Digital</span>
              </button>
            </div>

          </div>
        </div>

        {/* Hero Bottom Strip: Key Trust Numbers */}
        <div className="relative border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-400">Status Akreditasi</p>
              <p className="text-lg font-bold text-sky-400">{settings.accreditation}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-400">Total Peserta Didik</p>
              <p className="text-lg font-bold text-white tabular-nums">{settings.stats.studentsCount} Siswa</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-400">Dewan Guru & Tendik</p>
              <p className="text-lg font-bold text-white tabular-nums">{settings.stats.teachersCount + settings.stats.staffCount} Pendidik</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-400">Rombongan Belajar</p>
              <p className="text-lg font-bold text-amber-300 tabular-nums">{settings.stats.classesCount} Rombel</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. URGENT ANNOUNCEMENT TICKER (IF ANY) */}
      {urgentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
          <div className="bg-amber-500/10 border border-amber-300/40 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-900 font-bold">
                  <span>PENGUMUMAN PENTING</span>
                  <span aria-hidden="true">·</span>
                  <span>{urgentAnnouncements[0].date}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {urgentAnnouncements[0].title}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('pengumuman')}
              className="text-xs font-bold text-amber-900 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Detail Pengumuman</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. QUICK ACCESS CARD ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'SPMB Online', icon: Sparkles, color: 'text-amber-600 bg-amber-50', view: 'spmb' },
            { label: 'Kurikulum & P5', icon: BookOpen, color: 'text-sky-600 bg-sky-50', view: 'kurikulum' },
            { label: 'Dewan Guru', icon: Users, color: 'text-emerald-600 bg-emerald-50', view: 'guru' },
            { label: 'Sarana & Lab', icon: Building2, color: 'text-purple-600 bg-purple-50', view: 'fasilitas' },
            { label: 'Prestasi Sekolah', icon: Award, color: 'text-rose-600 bg-rose-50', view: 'prestasi' },
            { label: 'Pusat Unduhan', icon: FileText, color: 'text-indigo-600 bg-indigo-50', view: 'unduhan' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(item.view)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-sky-900 transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SAMBUTAN KEPALA SEKOLAH SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Principal Photo */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md">
                <img
                  src={settings.principalPhoto}
                  alt={settings.principalName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-4">{settings.principalName}</h2>
              <p className="text-xs text-sky-800 font-semibold">Kepala SMA Negeri 1 Julok</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {settings.principalNip}</p>
            </div>

            {/* Speech Prose */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 uppercase tracking-wider">
                <span>Sambutan Resmi Kepala Sekolah</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                Membangun Generasi Muda Beradab, Cerdas, dan Tangguh Menatap Era Digital
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic border-l-2 border-sky-600 pl-4 py-1">
                "{settings.principalSpeech.substring(0, 360)}..."
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('sambutan')}
                  className="text-xs font-semibold text-sky-900 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Baca Sambutan Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <button
                  onClick={() => onNavigate('visi-misi')}
                  className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Visi & Misi Sekolah
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BERITA & WARTA TERBARU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
              Kabar & Kegiatan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Warta Terkini SMA Negeri 1 Julok
            </h2>
          </div>
          <button
            onClick={() => onNavigate('berita')}
            className="text-xs font-semibold text-sky-900 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Berita</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item) => (
            <article
              key={item.id}
              onClick={() => onNavigate('berita-detail', item.id)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.views} baca</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-900 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-semibold text-sky-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. SPLIT SECTION: AGENDA & PENGUMUMAN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Agenda & Kalender Kegiatan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Agenda & Kalender Terdekat</h3>
              </div>
              <button
                onClick={() => onNavigate('agenda')}
                className="text-xs font-semibold text-sky-800 hover:text-sky-950"
              >
                Lihat Kalender
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4 hover:bg-sky-50/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 text-center flex flex-col items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-sky-800">
                      {new Date(ev.date).toLocaleString('id-ID', { month: 'short' })}
                    </span>
                    <span className="text-base font-extrabold text-slate-900 leading-none tabular-nums">
                      {new Date(ev.date).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{ev.time}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                      {ev.title}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {ev.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Pengumuman Resmi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pengumuman Resmi Sekolah</h3>
              </div>
              <button
                onClick={() => onNavigate('pengumuman')}
                className="text-xs font-semibold text-sky-800 hover:text-sky-950"
              >
                Semua Pengumuman
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 hover:bg-amber-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Untuk: {ann.target}</span>
                    <span>{ann.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {ann.title}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6.5 INTERAKTIVITAS: POLLING WARGA SEKOLAH & AKSES CEPAT AKADEMIK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Polling Widget */}
          <div className="lg:col-span-5">
            {data.polls && data.polls.length > 0 ? (
              <PollWidget poll={data.polls[0]} />
            ) : null}
          </div>

          {/* Quick Academic & Student Access Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">Akses Langsung</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Layanan Akademik & Kesiswaan</h3>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">Terhubung secara live</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Card 1: Jadwal Pelajaran */}
              <button
                onClick={() => onNavigate('jadwal')}
                className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                    <Clock className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-800 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-sky-900">Jadwal Pelajaran Rombel</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Lihat agenda harian mata pelajaran setiap kelas dan rombongan belajar aktif.
                </p>
              </button>

              {/* Card 2: Modul Belajar */}
              <button
                onClick={() => onNavigate('materi-belajar')}
                className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-emerald-900">Bank Modul & Bahan Ajar</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Unduh modul ajar Kurikulum Merdeka, modul P5, dan lembar kerja karya guru.
                </p>
              </button>

              {/* Card 3: Program Unggulan */}
              <button
                onClick={() => onNavigate('program-unggulan')}
                className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-amber-900">Program Unggulan Sekolah</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Tahfidz Al-Qur'an, Literasi Digital, Riset Siswa, dan Adiwiyata Berkelanjutan.
                </p>
              </button>

              {/* Card 4: Beasiswa */}
              <button
                onClick={() => onNavigate('beasiswa')}
                className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-800 transition-colors" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-indigo-900">Beasiswa & Bantuan Siswa</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Informasi Program Indonesia Pintar (PIP), beasiswa Pemprov Aceh, dan alumni.
                </p>
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 7. PRESTASI UNGGULAN SISWA & GURU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
              Prestasi & Keunggulan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Kebanggaan SMA Negeri 1 Julok
            </h2>
          </div>
          <button
            onClick={() => onNavigate('prestasi')}
            className="text-xs font-semibold text-sky-900 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Prestasi ({achievements.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-sky-800">Tingkat {ach.level}</span>
                  <span className="tabular-nums font-semibold">{ach.year}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {ach.title}
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-900">{ach.recipient}</p>
                  <p className="text-amber-700 font-medium mt-0.5">{ach.rank}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. GALERI FOTO & VIDEO DOKUMENTASI DENGAN LIGHTBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
              Dokumentasi & Galeri
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Potret Kehidupan Kampus Buket Seuraja
            </h2>
          </div>
          <button
            onClick={() => onNavigate('galeri')}
            className="text-xs font-semibold text-sky-900 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Galeri Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredGalleries.map((gal) => (
            <div
              key={gal.id}
              onClick={() => onOpenLightbox(gal)}
              className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer border border-slate-200"
            >
              {gal.type === 'video' ? (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-800">
                  <img
                    src="/src/assets/images/hero_sman1julok_1793290495969.jpg"
                    alt={gal.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="w-12 h-12 rounded-full bg-white/90 text-sky-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              ) : (
                <img
                  src={gal.url}
                  alt={gal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[11px] text-sky-300 font-semibold">{gal.category}</span>
                <p className="text-xs font-bold leading-tight mt-0.5 line-clamp-2">{gal.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. LOKASI SEKOLAH & HUBUNGI KAMI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-6 p-8 sm:p-10 space-y-6">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Lokasi & Kunjungan
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
              Kunjungi Kampus SMA Negeri 1 Julok
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kampus kami berlokasi strategis di kawasan hijau Desa Buket Seuraja, Kecamatan Julok, Kabupaten Aceh Timur, dengan akses jalan raya lintas timur Sumatera yang mudah dijangkau.
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.village}, {settings.district}, {settings.regency}, {settings.province}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('kontak')}
                className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Informasi Kontak & Form Pesan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 min-h-[300px] bg-slate-800 relative">
            {/* Embedded Google Maps representation for Buket Seuraja, Julok, Aceh Timur */}
            <iframe
              title="Peta Lokasi SMA Negeri 1 Julok"
              src="https://maps.google.com/maps?q=Buket%20Seuraja,%20Julok,%20Aceh%20Timur&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 absolute inset-0 filter saturate-125"
              loading="lazy"
            />
          </div>

        </div>
      </section>

    </div>
  );
};
