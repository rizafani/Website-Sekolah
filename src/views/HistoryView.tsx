import React from 'react';
import { Calendar, Award, Building, BookOpen, Clock, Users, ArrowLeft } from 'lucide-react';

interface HistoryViewProps {
  onNavigate: (view: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  const milestones = [
    {
      year: '1993',
      title: 'Prakarsa dan Peletakan Batu Pertama',
      desc: 'Merespons aspirasi para tokoh adat, pemuka agama, dan masyarakat Julok yang mendambakan SMA Negeri bermutu tanpa harus menempuh jarak jauh ke pusat kabupaten, pemerintah menetapkan pendirian unit sekolah baru di Desa Buket Seuraja.'
    },
    {
      year: '1995',
      title: 'Peresmian Kampus & Angkatan Pertama',
      desc: 'Secara resmi menerima angkatan perdana dengan 3 ruang kelas belajar, 12 orang guru pionir, serta sarana perpustakaan dan lapangan olahraga sederhana.'
    },
    {
      year: '2008',
      title: 'Pembangunan Laboratorium IPA & Komputer Perdana',
      desc: 'Ekspansi fasilitas besar-besaran dengan bantuan rehabilitasi pendidikan Aceh, mendirikan Lab Fisika, Biologi, Kimia, serta ruang komputer berteknologi jaringan lokal.'
    },
    {
      year: '2018',
      title: 'Perolehan Nilai Akreditasi A (Unggul)',
      desc: 'Melalui evaluasi komprehensif Badan Akreditasi Nasional, SMAN 1 Julok meraih peringkat Akreditasi A dengan nilai 94 berkat mutu pembelajaran dan tata kelola transparan.'
    },
    {
      year: '2023 - Sekarang',
      title: 'Era Transformasi Kurikulum Merdeka & Digitalisasi',
      desc: 'Ditetapkan sebagai sekolah pelaksana Kurikulum Merdeka Mandiri Berbagi di Aceh Timur, memelopori perpustakaan digital terpadu, ujian berbasis CBT internal, dan projek kewirausahaan siswa berbasis mangrove serta kearifan lokal.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Back button */}
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
          Napak Tilas & Dedikasi
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sejarah SMA Negeri 1 Julok
        </h1>
        <p className="text-sm text-slate-600">
          Lebih dari tiga dasawarsa mengabdi mencerdaskan putra-putri bangsa di pesisir timur Aceh.
        </p>
      </div>

      {/* Main Narrative - Editorial long-form */}
      <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-sky-900 first-letter:mr-2 first-letter:float-left">
          Kecamatan Julok di Kabupaten Aceh Timur sejak masa lampau dikenal sebagai wilayah pesisir yang sarat tradisi religius dan geliat niaga. Seiring bertumbuhnya jumlah lulusan SMP dan MTs pada dekade awal 1990-an, kebutuhan akan lembaga pendidikan menengah atas yang berkualitas dan dekat dengan pemukiman warga menjadi kebutuhan mendesak.
        </p>
        <p>
          Atas inisiatif para ulama, tokoh masyarakat mukim, serta dukungan penuh Dinas Pendidikan Kabupaten Aceh Timur, dihibahkanlah sebidang tanah seluas 2,4 hektare di Desa Buket Seuraja. Lokasi ini dipilih secara cermat karena berada di posisi strategis, berudara sejuk, asri, dan jauh dari kebisingan pusat industri, menjadikannya lingkungan ideal untuk kegiatan belajar mengajar.
        </p>
        <p>
          Dari angkatan perdana yang hanya berjumlah puluhan siswa, kini SMA Negeri 1 Julok telah meluluskan lebih dari 3.200 alumni yang kini berkiprah sebagai akademisi, dokter, insinyur, abdi negara (TNI/Polri/ASN), wirausahawan sukses, dan tokoh masyarakat di berbagai penjuru Nusantara hingga mancanegara.
        </p>
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-bold text-slate-900">Tonggak Perkembangan Lembaga</h2>
        <div className="space-y-6 border-l-2 border-sky-200 pl-6 ml-3">
          {milestones.map((ms, idx) => (
            <div key={idx} className="relative space-y-1">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-sky-600 border-4 border-white shadow-xs" />
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <span className="font-mono">{ms.year}</span>
                <span aria-hidden="true">·</span>
                <span>{ms.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ms.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
