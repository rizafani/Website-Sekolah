import React, { useState } from 'react';
import { Users, GraduationCap, Building2, BookOpen, Layers } from 'lucide-react';
import { ClassItem } from '../types/index.ts';

interface ClassesViewProps {
  classes: ClassItem[];
  onNavigate: (view: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({ classes }) => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'X' | 'XI' | 'XII'>('all');

  const filteredClasses = classes.filter(c => selectedGrade === 'all' || c.grade === selectedGrade);

  const totalStudents = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
  const totalMale = classes.reduce((acc, curr) => acc + curr.maleCount, 0);
  const totalFemale = classes.reduce((acc, curr) => acc + curr.femaleCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Data Akademik
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Data Kelas & Rombongan Belajar
        </h1>
        <p className="text-sm text-slate-600">
          Struktur rombongan belajar (rombel) Fase E (Kelas X), Fase F (Kelas XI), dan Kelas XII SMA Negeri 1 Julok tahun ajaran aktif.
        </p>
      </div>

      {/* Aggregate Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Total Rombel</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{classes.length} Kelas</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Total Peserta Didik</p>
          <p className="text-2xl font-bold text-sky-800 tabular-nums">{totalStudents} Siswa</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Siswa Laki-laki</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalMale} Orang</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Siswi Perempuan</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalFemale} Orang</p>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        <button
          onClick={() => setSelectedGrade('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            selectedGrade === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua Tingkat ({classes.length})
        </button>
        <button
          onClick={() => setSelectedGrade('X')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            selectedGrade === 'X' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kelas X (Fase E)
        </button>
        <button
          onClick={() => setSelectedGrade('XI')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            selectedGrade === 'XI' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kelas XI (Fase F)
        </button>
        <button
          onClick={() => setSelectedGrade('XII')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            selectedGrade === 'XII' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kelas XII
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Rombel</th>
                <th className="py-3 px-4">Fase / Peminatan</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4 text-center">L</th>
                <th className="py-3 px-4 text-center">P</th>
                <th className="py-3 px-4 text-center">Total</th>
                <th className="py-3 px-4">Ruang Belajar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{cls.name}</td>
                  <td className="py-3 px-4">{cls.major}</td>
                  <td className="py-3 px-4 font-medium text-sky-900">{cls.homeroomTeacher}</td>
                  <td className="py-3 px-4 text-center tabular-nums">{cls.maleCount}</td>
                  <td className="py-3 px-4 text-center tabular-nums">{cls.femaleCount}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 tabular-nums">{cls.studentCount}</td>
                  <td className="py-3 px-4 text-slate-500">{cls.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-sky-50 rounded-xl text-xs text-sky-900 leading-relaxed border border-sky-100">
        <p className="font-semibold">Catatan Keterbukaan Data Rombongan Belajar:</p>
        <p>Data di atas dipublikasikan sesuai standar Dapodikdasmen Kemendikbudristek untuk kebutuhan akuntabilitas dan pelayanan publik sekolah tanpa mencantumkan identitas pribadi siswa.</p>
      </div>

    </div>
  );
};
