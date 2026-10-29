import React, { useState, useMemo } from 'react';
import { Users, Search, GraduationCap, Briefcase, Mail, Phone } from 'lucide-react';
import { StaffItem } from '../types/index.ts';

interface TeachersViewProps {
  staffList: StaffItem[];
  onNavigate: (view: string) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({ staffList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'guru' | 'tendik'>('all');

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchFilter = selectedFilter === 'all' || s.category === selectedFilter;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q || 
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        (s.subject && s.subject.toLowerCase().includes(q)) ||
        s.education.toLowerCase().includes(q) ||
        s.nip.includes(q);
      return matchFilter && matchSearch;
    });
  }, [staffList, selectedFilter, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Pendidik & Tenaga Kependidikan
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Dewan Guru & Tenaga Kependidikan
        </h1>
        <p className="text-sm text-slate-600">
          Profil dewan pendidik profesional dan staf administrasi yang berdedikasi membimbing generasi masa depan SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Filter and Search Controls - Segmented button control per Section 1.A */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        
        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({staffList.length})
          </button>
          <button
            onClick={() => setSelectedFilter('guru')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'guru' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dewan Guru ({staffList.filter(s => s.category === 'guru').length})
          </button>
          <button
            onClick={() => setSelectedFilter('tendik')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'tendik' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tenaga Kependidikan ({staffList.filter(s => s.category === 'tendik').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama guru, mata pelajaran, NIP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
          />
        </div>

      </div>

      {/* Staff Cards Grid */}
      {filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          <p className="font-semibold text-slate-700">Tidak ada data staf yang cocok</p>
          <p className="mt-1 text-slate-400">Silakan ubah kata kunci pencarian atau filter kategori.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={staff.photoUrl}
                    alt={staff.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {staff.isLeader && (
                    <div className="absolute top-2 right-2 bg-sky-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      Pimpinan
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-900 transition-colors leading-snug">
                    {staff.name}
                  </h3>
                  <p className="text-xs font-semibold text-sky-800">
                    {staff.role}
                  </p>
                  {staff.subject && (
                    <p className="text-xs text-slate-600">
                      Mata Pelajaran: {staff.subject}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    {staff.education}
                  </p>
                </div>
              </div>

              {/* NIP Footer */}
              <div className="p-4 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                NIP. {staff.nip}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
