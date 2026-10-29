import React from 'react';
import { SchoolSettings } from '../types/index.ts';
import { ArrowLeft, Quote, Award, Mail, Phone } from 'lucide-react';

interface PrincipalSpeechViewProps {
  settings: SchoolSettings;
  onNavigate: (view: string) => void;
}

export const PrincipalSpeechView: React.FC<PrincipalSpeechViewProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      <div>
        <button
          onClick={() => onNavigate('profil')}
          className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Profil Sekolah</span>
        </button>
      </div>

      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Pesan Kepemimpinan
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sambutan Kepala Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Amanat dan arah pengembangan pendidikan oleh Kepala SMA Negeri 1 Julok.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Principal Lockup */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 shadow-xs">
            <img
              src={settings.principalPhoto}
              alt={settings.principalName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{settings.principalName}</h2>
            <p className="text-xs font-semibold text-sky-800">Kepala SMA Negeri 1 Julok</p>
            <p className="text-xs text-slate-500 font-mono">NIP. {settings.principalNip}</p>
            <p className="text-xs text-slate-400 pt-1">
              Desa Buket Seuraja, Kec. Julok, Kab. Aceh Timur
            </p>
          </div>
        </div>

        {/* Speech Content */}
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-5">
          <p className="font-semibold text-slate-900 text-base">
            Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera bagi Kita Semua.
          </p>

          <p>
            Alhamdulillahi Rabbil 'Alamin, puji dan syukur senantiasa kita haturkan ke hadirat Allah SWT, Tuhan Yang Maha Esa, yang telah melimpahkan rahmat, taufik, serta hidayah-Nya kepada kita semua. Shalawat beriring salam semoga senantiasa tercurahkan kepada baginda Rasulullah Muhammad SAW, teladan sejati pembawa risalah peradaban ilmu dan budi pekerti luhur.
          </p>

          <p>
            Selamat datang di website resmi SMA Negeri 1 Julok. Kami menyambut dengan tangan terbuka kehadiran para peserta didik, bapak/ibu orang tua/wali murid, alumni, serta seluruh pemangku kepentingan pendidikan yang mengakses laman ini. Website ini kami bangun sebagai wujud komitmen terhadap keterbukaan informasi publik, akuntabilitas tata kelola sekolah, dan sarana interaksi digital yang mudah diakses kapan saja dan di mana saja.
          </p>

          <p>
            SMA Negeri 1 Julok yang berlokasi di Desa Buket Seuraja, Kecamatan Julok, Kabupaten Aceh Timur terus bergerak maju bertransformasi. Di era Kurikulum Merdeka saat ini, pendidikan tidak lagi sekadar transfer materi hafalan di ruang kelas sempit. Lebih dari itu, kami memfasilitasi anak-anak kita untuk menumbuhkan nalar kritis, kemampuan kolaboratif, kreativitas saintifik, serta kepedulian tulus terhadap lingkungan hidup dan masyarakat sekitarnya.
          </p>

          <p>
            Bagi anak-anakku para siswa SMA Negeri 1 Julok, ketahuilah bahwa masa depan bangsa ada di pundak kalian. Teruslah rajin belajar, tekun beribadah, hormati orang tua dan dewan guru, serta manfaatkan fasilitas laboratorium, perpustakaan digital, dan wadah ekstrakurikuler sekolah dengan penuh antusiasme. Raihlah prestasi setinggi mungkin, namun tetaplah rendah hati dan berakhlakul karimah.
          </p>

          <p>
            Kepada para dewan guru dan tenaga kependidikan yang saya banggakan, terima kasih atas ketulusan, keikhlasan, dan inovasi tiada henti dalam mendidik generasi penerus bangsa. Mari kita terus bersinergi dengan Komite Sekolah dan masyarakat Julok demi menghadirkan layanan pendidikan terbaik.
          </p>

          <p className="pt-2 font-semibold text-slate-900">
            Wassalamu'alaikum Warahmatullahi Wabarakatuh.
          </p>
        </div>

        {/* Sign-off */}
        <div className="pt-6 border-t border-slate-100 flex flex-col items-end text-right">
          <p className="text-xs text-slate-500">Buket Seuraja, Julok, Aceh Timur</p>
          <p className="text-xs text-slate-500">Kepala SMA Negeri 1 Julok</p>
          <div className="h-12 flex items-center">
            <span className="font-serif italic text-lg text-slate-800 font-semibold">[Ttd. Digital]</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{settings.principalName}</p>
          <p className="text-xs text-slate-500 font-mono">NIP. {settings.principalNip}</p>
        </div>

      </div>

    </div>
  );
};
