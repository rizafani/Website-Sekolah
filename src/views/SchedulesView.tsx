import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  User as UserIcon, 
  Building2, 
  Search, 
  Filter, 
  Printer, 
  Info,
  ChevronDown
} from 'lucide-react';
import { LessonSchedule } from '../types/index.ts';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface SchedulesViewProps {
  schedules: LessonSchedule[];
  onNavigate: (view: string) => void;
}

const DAYS: Array<LessonSchedule['day']> = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export const SchedulesView: React.FC<SchedulesViewProps> = ({ schedules, onNavigate }) => {
  const [selectedDay, setSelectedDay] = useState<LessonSchedule['day']>('Senin');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const classNames = Array.from(new Set(schedules.map(s => s.className)));

  const filtered = schedules.filter(s => {
    const matchesDay = s.day === selectedDay;
    const matchesClass = selectedClass === 'all' || s.className === selectedClass;
    const matchesSearch = 
      s.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesClass && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs
        items={[
          { label: 'Akademik', view: 'kurikulum' },
          { label: 'Jadwal Pelajaran Resmi' }
        ]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-1">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>INFORMASI AKADEMIK & PEMBELAJARAN</span>
                <span className="text-slate-400">·</span>
                <span>T.A. 2025/2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jadwal Pelajaran Rombongan Belajar
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Jadwal tatap muka resmi Kurikulum Merdeka SMA Negeri 1 Julok. Jam kegiatan belajar mengajar dimulai pukul 07.45 WIB setelah pembacaan Asmaul Husna dan apel pagi.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Jadwal</span>
            </button>
          </div>

          {/* Policy Callout (Requirement B) */}
          <div className="mt-6 p-4 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-sky-950 flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-800 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Kebijakan Publikasi Jadwal:</strong> Jadwal yang dipublikasikan pada portal ini disesuaikan dengan Surat Keputusan Pembagian Beban Mengajar Dewan Guru Semester Berjalan. Perubahan jadwal harian akan diumumkan oleh Wakil Kepala Sekolah Bidang Kurikulum.
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Days Tab */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedDay === day 
                    ? 'bg-sky-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Class & Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Semua Kelas / Rombel</option>
              {classNames.map((cls) => (
                <option key={cls} value={cls}>Kelas {cls}</option>
              ))}
            </select>

            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari mapel / guru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Jadwal Hari {selectedDay} {selectedClass !== 'all' ? `· Kelas ${selectedClass}` : ''}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filtered.length} sesi pembelajaran
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tidak ada jadwal ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba pilih hari lain atau sesuaikan pencarian Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/60 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-14 text-center">Jam Ke</th>
                    <th className="py-3 px-4 w-32">Waktu (WIB)</th>
                    <th className="py-3 px-4 w-24">Kelas</th>
                    <th className="py-3 px-6">Mata Pelajaran</th>
                    <th className="py-3 px-6">Guru Pengampu</th>
                    <th className="py-3 px-4">Ruang Belajar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center font-bold font-mono text-sky-900">
                        {item.period}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {item.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-100">
                          {item.className}
                        </span>
                      </td>
                      <td className="py-3 px-6 font-bold text-slate-900 text-sm">
                        {item.subjectName}
                      </td>
                      <td className="py-3 px-6 text-slate-700 font-medium">
                        {item.teacherName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.room}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
