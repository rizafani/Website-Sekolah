import React from 'react';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';

interface FooterProps {
  settings: SchoolSettings;
  onNavigate: (view: string) => void;
  onOpenDigitalServices: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenDigitalServices }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top Banner / Accreditation Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Terakreditasi {settings.accreditation} (Nilai: {settings.stats.accreditationScore})</p>
              <p className="text-xs text-slate-400">Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button 
              onClick={() => onNavigate('spmb')}
              className="text-white bg-sky-800 hover:bg-sky-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Info Pendaftaran Siswa Baru
            </button>
            <button 
              onClick={onOpenDigitalServices}
              className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>Layanan Digital Sekolah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: Identity & Motto */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-900 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <span className="text-white font-bold text-base block leading-tight">{settings.name}</span>
              <span className="text-xs text-slate-400">NPSN: {settings.npsn}</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            "{settings.tagline}"
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menyelenggarakan pendidikan menengah atas berkualitas, berkarakter Islami, menumbuhkan integritas serta daya saing iptek bagi generasi muda Aceh.
          </p>
          <div className="pt-1 text-xs text-slate-300">
            <p className="font-semibold text-white">Kepala Sekolah:</p>
            <p>{settings.principalName}</p>
            <p className="text-[11px] text-slate-400">NIP. {settings.principalNip}</p>
          </div>
        </div>

        {/* Col 2: Alamat & Kontak */}
        <div className="space-y-3">
          <p className="text-white font-semibold text-sm">Alamat & Kontak</p>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{settings.address}, {settings.district}, {settings.regency}, {settings.province} {settings.postalCode}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{settings.operatingHours}</span>
            </div>
          </div>
        </div>

        {/* Col 3: Navigasi Cepat */}
        <div className="space-y-3">
          <p className="text-white font-semibold text-sm">Navigasi Utama</p>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => onNavigate('profil')} className="hover:text-white transition-colors text-left">
                Profil & Sejarah Sekolah
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('visi-misi')} className="hover:text-white transition-colors text-left">
                Visi, Misi & Tujuan Institusi
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('guru')} className="hover:text-white transition-colors text-left">
                Dewan Guru & Tenaga Kependidikan
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('jadwal')} className="hover:text-white transition-colors text-left text-sky-400">
                Jadwal Pelajaran Rombel
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('materi-belajar')} className="hover:text-white transition-colors text-left">
                Bank Modul & Bahan Ajar
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('kelas')} className="hover:text-white transition-colors text-left">
                Daftar Kelas & Rombongan Belajar
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('kurikulum')} className="hover:text-white transition-colors text-left">
                Kurikulum Merdeka & Projek P5
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('prestasi')} className="hover:text-white transition-colors text-left">
                Prestasi Akademik & Non-Akademik
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('ekstrakurikuler')} className="hover:text-white transition-colors text-left">
                Kegiatan Ekstrakurikuler
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Layanan Publik & Tautan Resmi */}
        <div className="space-y-3">
          <p className="text-white font-semibold text-sm">Layanan & Publikasi</p>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button onClick={() => onNavigate('spmb')} className="hover:text-white transition-colors text-left font-medium text-sky-400">
                Penerimaan Murid Baru (SPMB Online)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('program-unggulan')} className="hover:text-white transition-colors text-left text-amber-300">
                Program Unggulan Sekolah
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('beasiswa')} className="hover:text-white transition-colors text-left">
                Beasiswa & Bantuan Siswa
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('berita')} className="hover:text-white transition-colors text-left">
                Warta & Berita Terkini
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('pengumuman')} className="hover:text-white transition-colors text-left">
                Pengumuman Resmi Sekolah
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('agenda')} className="hover:text-white transition-colors text-left">
                Kalender Kegiatan Sekolah
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('unduhan')} className="hover:text-white transition-colors text-left">
                Pusat Unduhan Formulir & SK
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors text-left">
                Tanya Jawab (FAQ)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privasi-ketentuan')} className="hover:text-white transition-colors text-left">
                Kebijakan Privasi & Ketentuan
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="text-slate-500 hover:text-slate-300 transition-colors text-left text-[11px] pt-1 block">
                Portal Admin Operator Sekolah
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings.name}. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onNavigate('privasi-ketentuan')} className="hover:text-white transition-colors">
              Kebijakan Privasi
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
              Bantuan
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={() => onNavigate('kontak')} className="hover:text-white transition-colors">
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
