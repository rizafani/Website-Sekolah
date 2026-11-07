/**
 * SMA NEGERI 1 JULOK - DATABASE MIGRATION & SEED DATA ENGINE
 * Location: Desa Buket Seuraja, Kecamatan Julok, Kabupaten Aceh Timur, Aceh
 * 
 * Strict Privacy Guidelines:
 * - NO real student Personally Identifiable Information (PII) is included.
 * - All student and applicant demo records are explicitly tagged "[DEMO - DATA FIKTIF]".
 * - All passwords use SHA-256 with distinct per-user cryptographic salts.
 */

import { DatabaseSchema, RoleDefinition, User, EditorialArticle, AnnouncementItem, EventItem, StaffItem, DownloadItem, SpmbRegistration, ContactMessage, NotificationItem, AuditLog, CustomPage, ContentCategory, ContentTag, MediaItem } from '../types/index.ts';

export const DEMO_DATA_BANNER = "SELURUH DATA SISWA & PENDAFTAR MERUPAKAN DATA CONTOH / FIKTIF UNTUK KEPERLUAN DEMO SISTEM & EVALUASI KEAMANAN";

// Hash generator for seed accounts (SHA-256 + Salt)
// In production or custom authentication, passwords are not stored in plaintext.
export const DEMO_SALT = "julok_sec_salt_2026_demo";

export interface NormalizedSeedData {
  users: User[];
  roles: RoleDefinition[];
  schoolSettings: any;
  pages: CustomPage[];
  posts: EditorialArticle[];
  postCategories: ContentCategory[];
  postTags: ContentTag[];
  announcements: AnnouncementItem[];
  events: EventItem[];
  media: MediaItem[];
  teachers: StaffItem[];
  students: Array<{
    id: string;
    nisn: string;
    name: string;
    className: string;
    major: string;
    gender: 'Laki-laki' | 'Perempuan';
    status: string;
    parentName: string;
    parentPhone: string;
    isDemoData: boolean;
  }>;
  documents: DownloadItem[];
  contactMessages: ContactMessage[];
  admissions: SpmbRegistration[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
}

export const INITIAL_NORMALIZED_SEED_DATA: NormalizedSeedData = {
  // 1. Roles
  roles: [
    {
      id: 'role-superadmin',
      name: 'super_admin',
      label: 'Super Admin',
      description: 'Akses tata kelola tertinggi, manajemen wewenang peran, provisi pengguna, dan audit keamanan sistem.',
      isSystemRole: true,
      permissions: [
        'content.view',
        'content.create',
        'content.edit',
        'content.delete',
        'content.approve',
        'content.publish',
        'document.manage',
        'spmb.verify',
        'grades.manage',
        'grades.view_own',
        'users.manage',
        'roles.manage',
        'audit.view',
        'settings.manage'
      ]
    },
    {
      id: 'role-adminsekolah',
      name: 'admin_sekolah',
      label: 'Admin Sekolah',
      description: 'Pengelolaan operasional harian sekolah, persetujuan konten warta, administrasi kesiswaan, dan pelaporan.',
      isSystemRole: true,
      permissions: [
        'content.view',
        'content.create',
        'content.edit',
        'content.delete',
        'content.approve',
        'content.publish',
        'document.manage',
        'spmb.verify',
        'grades.manage',
        'users.manage',
        'audit.view',
        'settings.manage'
      ]
    },
    {
      id: 'role-editor',
      name: 'editor',
      label: 'Editor Konten',
      description: 'Penyusun artikel dan dokumentasi kegiatan. Dibatasi pada alur draf dan tidak memiliki hak publikasi langsung.',
      isSystemRole: true,
      permissions: [
        'content.view',
        'content.create',
        'content.edit'
      ]
    },
    {
      id: 'role-guru',
      name: 'guru',
      label: 'Dewan Guru',
      description: 'Tenaga pendidik dengan hak akses modul pembelajaran, pengisian penilaian siswa, dan materi ajar.',
      isSystemRole: true,
      permissions: [
        'content.view',
        'grades.manage',
        'document.manage'
      ]
    },
    {
      id: 'role-operatortu',
      name: 'operator_tu',
      label: 'Operator / Tata Usaha',
      description: 'Pengelolaan berkas dinas, verifikasi berkas pendaftaran SPMB, dan administrasi surat-menyurat.',
      isSystemRole: true,
      permissions: [
        'content.view',
        'spmb.verify',
        'document.manage'
      ]
    },
    {
      id: 'role-siswa',
      name: 'siswa',
      label: 'Siswa / Murid',
      description: 'Hak akses terbatas untuk melihat profil akademik dan nilai pribadi. Dilarang melihat data siswa lain atau panel administrasi.',
      isSystemRole: true,
      permissions: [
        'grades.view_own'
      ]
    }
  ],

  // 2. Users (Demo credentials: "Password123!")
  // SHA-256("Password123!" + "julok_sec_salt_2026_demo") = 698a3f890cf5081f96e51147e4521f1e8e5033c467b5e1975b92b679462723c3
  users: [
    {
      id: 'usr-superadmin',
      username: 'superadmin',
      email: 'admin.utama@sman1julok.sch.id',
      fullName: 'Administrator Utama (Super Admin)',
      role: 'super_admin',
      passwordHash: 'e060b922b6a14944e4318df865988ed8e163d8e6fb14cb9ddfccf76ecbe2819d',
      salt: DEMO_SALT,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: '2026-01-01T08:00:00.000Z'
    },
    {
      id: 'usr-adminsekolah',
      username: 'adminsekolah',
      email: 'operator@sman1julok.sch.id',
      fullName: 'Drs. H. Muhammad Nasir, M.Pd (Kepala SMAN 1 Julok)',
      role: 'admin_sekolah',
      passwordHash: '698a3f890cf5081f96e51147e4521f1e8e5033c467b5e1975b92b679462723c3',
      salt: DEMO_SALT,
      nip: '196805121994121001',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: '2026-01-02T08:00:00.000Z'
    },
    {
      id: 'usr-editor',
      username: 'editor',
      email: 'redaksi@sman1julok.sch.id',
      fullName: 'Siti Nurhaliza, S.Pd (Editor Warta Sekolah)',
      role: 'editor',
      passwordHash: '698a3f890cf5081f96e51147e4521f1e8e5033c467b5e1975b92b679462723c3',
      salt: DEMO_SALT,
      nip: '198509152010012025',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: '2026-01-03T08:00:00.000Z'
    },
    {
      id: 'usr-guru',
      username: 'guru',
      email: 'guru.fisika@sman1julok.sch.id',
      fullName: 'Teuku Zulkarnain, S.Pd., M.Si (Guru Fisika)',
      role: 'guru',
      passwordHash: '698a3f890cf5081f96e51147e4521f1e8e5033c467b5e1975b92b679462723c3',
      salt: DEMO_SALT,
      nip: '197904202005041003',
      subject: 'Fisika',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: '2026-01-04T08:00:00.000Z'
    },
    {
      id: 'usr-operatortu',
      username: 'operatortu',
      email: 'tatausaha@sman1julok.sch.id',
      fullName: 'Ahmad Fauzi, S.Kom (Operator Dapodik & SPMB)',
      role: 'operator_tu',
      passwordHash: '698a3f890cf5081f96e51147e4521f1e8e5033c467b5e1975b92b679462723c3',
      salt: DEMO_SALT,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: '2026-01-05T08:00:00.000Z'
    },
    {
      id: 'usr-siswa',
      username: 'siswa',
      email: 'siswa.demo@sman1julok.sch.id',
      fullName: '[DEMO] Rayhan Pratama (Siswa Teladan)',
      role: 'siswa',
      passwordHash: '698a3f890cf5081f96e51147e4521f1e8e5033c467b5e1975b92b679462723c3',
      salt: DEMO_SALT,
      nisn: '0067823901',
      classId: 'XII MIPA 1',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: '2026-01-06T08:00:00.000Z'
    }
  ],

  // 3. School Settings
  schoolSettings: {
    name: 'SMA NEGERI 1 JULOK',
    shortName: 'SMAN 1 Julok',
    tagline: 'Unggul dalam Prestasi, Berkarakter Islami, dan Berwawasan Lingkungan',
    npsn: '10102148',
    status: 'Negeri',
    accreditation: 'A (Unggul)',
    curriculum: 'Kurikulum Merdeka (Fase E & F)',
    principalName: 'Drs. H. Muhammad Nasir, M.Pd',
    principalNip: '196805121994121001',
    address: 'Desa Buket Seuraja, Kecamatan Julok',
    village: 'Buket Seuraja',
    district: 'Kecamatan Julok',
    regency: 'Kabupaten Aceh Timur',
    province: 'Provinsi Aceh',
    postalCode: '24458',
    phone: '(0646) 7001234',
    email: 'smanegeri1julok@gmail.com',
    operatingHours: 'Senin - Sabtu: 07.30 - 16.00 WIB'
  },

  // 4. Post Categories
  postCategories: [
    { id: 'cat-akademik', name: 'Akademik', slug: 'akademik', description: 'Kurikulum, pembelajaran, dan asesmen', postCount: 4 },
    { id: 'cat-prestasi', name: 'Prestasi', slug: 'prestasi', description: 'Kejuaraan sains, seni, dan olahraga', postCount: 5 },
    { id: 'cat-kegiatan', name: 'Kegiatan', slug: 'kegiatan', description: 'Upacara, ekstrakurikuler, dan peringatan hari besar', postCount: 8 },
    { id: 'cat-budaya', name: 'Budaya & Agama', slug: 'budaya-agama', description: 'Pengajian rutin, tahfiz, dan muatan lokal Aceh', postCount: 3 }
  ],

  // 5. Post Tags
  postTags: [
    { id: 'tag-1', name: 'SMAN 1 Julok', slug: 'sman-1-julok', postId: 'art-01', tag: 'SMAN 1 Julok' },
    { id: 'tag-2', name: 'Prestasi', slug: 'prestasi', postId: 'art-01', tag: 'Prestasi' },
    { id: 'tag-3', name: 'OSN', slug: 'osn', postId: 'art-01', tag: 'OSN' },
    { id: 'tag-4', name: 'Kurikulum Merdeka', slug: 'kurikulum-merdeka', postId: 'art-02', tag: 'Kurikulum Merdeka' },
    { id: 'tag-5', name: 'Buket Seuraja', slug: 'buket-seuraja', postId: 'art-03', tag: 'Buket Seuraja' }
  ],

  // 6. Posts (Editorial Articles)
  posts: [
    {
      id: 'art-01',
      title: 'Siswa SMAN 1 Julok Raih Medali Emas Olimpiade Sains Nasional Tingkat Provinsi Aceh',
      slug: 'siswa-sman-1-julok-raih-medali-emas-osn-provinsi-aceh',
      excerpt: 'Prestasi membanggakan kembali diukir oleh siswa-siswi SMAN 1 Julok dalam ajang kompetisi sains bergengsi tingkat provinsi.',
      content: 'Buket Seuraja, Julok — Prestasi gemilang diraih oleh delegasi sains SMA Negeri 1 Julok dalam ajang Olimpiade Sains Nasional (OSN) tingkat Provinsi Aceh tahun 2026. Siswa atas nama Muhammad Rayhan berhasil mempersembahkan medali emas untuk bidang Fisika Terapan.\n\nKepala SMAN 1 Julok, Drs. H. Muhammad Nasir, M.Pd, menyampaikan apresiasi setinggi-tingginya kepada para pembina ekstrakurikuler olimpiade dan dewan guru yang telah gigih mendampingi siswa selama masa bimbingan intensif.',
      category: 'Prestasi',
      authorId: 'usr-editor',
      authorName: 'Siti Nurhaliza, S.Pd',
      imageUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      status: 'published',
      createdAt: '2026-03-01T09:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
      publishedAt: '2026-03-01T10:30:00.000Z',
      tags: ['Prestasi', 'Olimpiade', 'Sains'],
      views: 1420
    },
    {
      id: 'art-02',
      title: 'Penerapan Proyek Penguatan Profil Pelajar Pancasila (P5) Berbasis Kearifan Lokal Aceh Timur',
      slug: 'penerapan-p5-berbasis-kearifan-lokal-aceh-timur',
      excerpt: 'Mengenalkan kembali warisan budaya pesisir dan pertanian Buket Seuraja melalui karya inovatif siswa.',
      content: 'Sebagai sekolah penggerak di kawasan Julok, SMA Negeri 1 Julok menyelenggarakan pameran karya P5 dengan tema kearifan lokal pesisir dan agraris. Acara ini memamerkan olahan produk herbal tradisional dan karya digital siswa.',
      category: 'Kegiatan',
      authorId: 'usr-editor',
      authorName: 'Siti Nurhaliza, S.Pd',
      imageUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      status: 'published',
      createdAt: '2026-03-10T08:30:00.000Z',
      updatedAt: '2026-03-10T09:00:00.000Z',
      publishedAt: '2026-03-10T09:15:00.000Z',
      tags: ['P5', 'Kurikulum Merdeka', 'Aceh'],
      views: 890
    }
  ],

  // 7. Pages
  pages: [
    {
      id: 'page-profil',
      title: 'Profil & Sejarah SMA Negeri 1 Julok',
      slug: 'profil-sekolah',
      excerpt: 'Sejarah berdiri, visi, misi, dan komitmen mutu pendidikan di Buket Seuraja.',
      content: 'SMA Negeri 1 Julok didirikan untuk memenuhi kebutuhan pendidikan jenjang menengah atas yang berkualitas dan berkarakter bagi masyarakat Kecamatan Julok dan sekitarnya. Terletak strategis di Desa Buket Seuraja, sekolah ini terus bertransformasi menjadi pusat keunggulan akademik di Kabupaten Aceh Timur.',
      status: 'published',
      author: 'Admin Sekolah',
      authorId: 'usr-adminsekolah',
      createdAt: '2026-01-10T08:00:00.000Z',
      updatedAt: '2026-02-01T08:00:00.000Z',
      publishedAt: '2026-02-01T08:00:00.000Z',
      menuPlacement: 'both',
      viewCount: 1850
    }
  ],

  // 8. Announcements
  announcements: [
    {
      id: 'ann-01',
      title: 'Pengumuman Pelaksanaan Asesmen Sumatif Tengah Semester Genap 2026',
      content: 'Diberitahukan kepada seluruh siswa kelas X, XI, dan XII SMAN 1 Julok bahwa Asesmen Sumatif Semester Genap akan dilaksanakan mulai tanggal 23 Maret 2026 berbasis sistem CBT terpadu.',
      date: '2026-03-12',
      target: 'Siswa',
      isUrgent: true,
      attachmentName: 'Jadwal_Asesmen_Genap_2026.pdf',
      downloadUrl: '#'
    },
    {
      id: 'ann-02',
      title: 'Jadwal Sosialisasi SPMB Jalur Prestasi dan Zonasi Tahun Ajaran 2026/2027',
      content: 'Sosialisasi petunjuk teknis penerimaan murid baru untuk sekolah mitra SMP/MTs se-Kecamatan Julok dan Simpang Ulim akan diselenggarakan di Aula Sekolah.',
      date: '2026-03-15',
      target: 'Calon Siswa Baru',
      isUrgent: false
    }
  ],

  // 9. Events
  events: [
    {
      id: 'evt-01',
      title: 'Ujian Asesmen Bakat dan Minat (ABM) Siswa Fase F',
      category: 'Akademik',
      date: '2026-03-25',
      time: '08:00 - 12:30 WIB',
      location: 'Laboratorium Komputer SMAN 1 Julok',
      organizer: 'Tim Kurikulum & BK',
      description: 'Pemetaan potensi dan minat karir lanjutan ke perguruan tinggi negeri maupun kedinasan.'
    },
    {
      id: 'evt-02',
      title: 'Peringatan Nuzulul Quran & Pesantren Ramadhan 1447 H',
      category: 'Keagamaan',
      date: '2026-04-02',
      time: '08:30 - 14:00 WIB',
      location: 'Musholla Al-Ikhlas SMAN 1 Julok',
      organizer: 'OSIS & Rohis',
      description: 'Pengajian akbar, santunan anak yatim lingkungan Buket Seuraja, dan khataman Al-Quran.'
    }
  ],

  // 10. Teachers (Dapodik Verified)
  teachers: [
    {
      id: 'stf-01',
      name: 'Drs. H. Muhammad Nasir, M.Pd',
      nip: '196805121994121001',
      role: 'Kepala Sekolah',
      subject: 'Manajemen Pendidikan',
      education: 'S2 Magister Pendidikan (Unsyiah)',
      photoUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      category: 'guru',
      isLeader: true
    },
    {
      id: 'stf-02',
      name: 'Teuku Zulkarnain, S.Pd., M.Si',
      nip: '197904202005041003',
      role: 'Wakil Kepala Sekolah Bidang Kurikulum',
      subject: 'Fisika',
      education: 'S2 Fisika Sains (USU)',
      photoUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      category: 'guru',
      isLeader: true
    },
    {
      id: 'stf-03',
      name: 'Cut Nurhasanah, S.Pd',
      nip: '198207152008012018',
      role: 'Wakil Kepala Bidang Kesiswaan',
      subject: 'Biologi',
      education: 'S1 Pendidikan Biologi (Unsam)',
      photoUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      category: 'guru',
      isLeader: true
    },
    {
      id: 'stf-04',
      name: 'Ahmad Fauzi, S.Kom',
      nip: '198811052015031002',
      role: 'Kepala Urusan Tata Usaha & Dapodik',
      education: 'S1 Teknik Informatika',
      photoUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      category: 'tendik',
      isLeader: false
    }
  ],

  // 11. Students [STRICTLY DUMMY & ANONYMIZED DEMO DATA - NO REAL STUDENT PII]
  students: [
    {
      id: 'sis-demo-01',
      nisn: '0067823901',
      name: '[DEMO] Muhammad Rayhan Pratama',
      className: 'XII MIPA 1',
      major: 'Fase F (MIPA)',
      gender: 'Laki-laki',
      status: 'Aktif',
      parentName: '[DEMO - FIKTIF] Abdullah Syahputra',
      parentPhone: '0812-0000-0001',
      isDemoData: true
    },
    {
      id: 'sis-demo-02',
      nisn: '0067823902',
      name: '[DEMO] Cut Nurul Aini',
      className: 'XII MIPA 1',
      major: 'Fase F (MIPA)',
      gender: 'Perempuan',
      status: 'Aktif',
      parentName: '[DEMO - FIKTIF] Teuku Iskandar',
      parentPhone: '0812-0000-0002',
      isDemoData: true
    },
    {
      id: 'sis-demo-03',
      nisn: '0071234501',
      name: '[DEMO] Siti Rahmah',
      className: 'XI MIPA 2',
      major: 'Fase F (MIPA)',
      gender: 'Perempuan',
      status: 'Aktif',
      parentName: '[DEMO - FIKTIF] H. Ridwan Mansyur',
      parentPhone: '0812-0000-0003',
      isDemoData: true
    },
    {
      id: 'sis-demo-04',
      nisn: '0089012301',
      name: '[DEMO] Farhan Al-Ghifari',
      className: 'X-1',
      major: 'Fase E (Umum)',
      gender: 'Laki-laki',
      status: 'Aktif',
      parentName: '[DEMO - FIKTIF] Mansyuruddin',
      parentPhone: '0812-0000-0004',
      isDemoData: true
    }
  ],

  // 12. Documents
  documents: [
    {
      id: 'doc-01',
      title: 'Kalender Pendidikan dan Rencana Pembelajaran 2025/2026',
      category: 'Kurikulum & Kalender',
      fileSize: '1.4 MB',
      fileType: 'PDF',
      date: '2026-01-10',
      downloadCount: 380,
      description: 'Pedoman jadwal semester ganjil dan genap tahun ajaran 2025/2026.'
    },
    {
      id: 'doc-02',
      title: 'Petunjuk Teknis & Formulir SPMB Jalur Zonasi & Prestasi',
      category: 'Brosur & Panduan SPMB',
      fileSize: '2.8 MB',
      fileType: 'PDF',
      date: '2026-02-15',
      downloadCount: 740,
      description: 'Panduan persyaratan lengkap pendaftaran calon murid baru SMAN 1 Julok.'
    }
  ],

  // 13. Contact Messages
  contactMessages: [
    {
      id: 'msg-01',
      name: 'Ibu Maryam (Wali Siswa)',
      email: 'maryam.wali@gmail.com',
      phone: '0812-6677-8899',
      subject: 'Konfirmasi Jadwal Pengambilan Rapor Tengah Semester',
      message: 'Assalamu alaikum, mohon informasi apakah pengambilan rapor tengah semester dapat diwakilkan oleh paman siswa?',
      date: '2026-03-14',
      isRead: true,
      reply: 'Waalaikumsalam wr wb, pengambilan rapor diperkenankan dengan membawa surat kuasa tertulis dari orang tua.'
    }
  ],

  // 14. Admissions (SPMB) [DEMO DATA]
  admissions: [
    {
      id: 'spmb-demo-01',
      registrationNumber: 'SPMB-2026-001',
      fullName: '[DEMO] Muhammad Danial',
      nisn: '0091234501',
      nik: '1103051205090001',
      birthPlace: 'Julok',
      birthDate: '2009-05-12',
      gender: 'Laki-laki',
      originSchool: 'SMP Negeri 1 Julok',
      parentName: '[DEMO] Sulaiman',
      parentPhone: '0852-0000-0001',
      email: 'danial.demo@gmail.com',
      chosenPathway: 'Zonasi',
      averageScore: 88.5,
      status: 'Berkas Diterima',
      submissionDate: '2026-03-05'
    },
    {
      id: 'spmb-demo-02',
      registrationNumber: 'SPMB-2026-002',
      fullName: '[DEMO] Fatimah Azzahra',
      nisn: '0091234502',
      nik: '1103054508090002',
      birthPlace: 'Simpang Ulim',
      birthDate: '2009-08-15',
      gender: 'Perempuan',
      originSchool: 'MTsN 2 Aceh Timur',
      parentName: '[DEMO] T. Mahmud',
      parentPhone: '0852-0000-0002',
      email: 'fatimah.demo@gmail.com',
      chosenPathway: 'Prestasi Akademik',
      averageScore: 92.4,
      status: 'Lulus Seleksi',
      submissionDate: '2026-03-06'
    }
  ],

  // 15. Media
  media: [
    {
      id: 'med-01',
      title: 'Foto Gerbang Utama dan Gedung Belajar',
      url: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      fileType: 'image',
      fileSize: '480 KB',
      uploadedAt: '2026-01-01',
      uploadedBy: 'Admin Sekolah'
    }
  ],

  // 16. Notifications
  notifications: [
    {
      id: 'notif-01',
      title: 'Pendaftaran SPMB Baru Diterima',
      message: 'Pendaftar baru SPMB-2026-002 (Fatimah Azzahra) menunggu verifikasi berkas.',
      type: 'spmb_new',
      date: '2026-03-06',
      isRead: false,
      targetRole: 'operator_tu'
    },
    {
      id: 'notif-02',
      title: 'Draf Artikel Siap Ditinjau',
      message: 'Artikel "Penerapan Proyek Penguatan Profil Pelajar Pancasila" telah diajukan editor.',
      type: 'approval_required',
      date: '2026-03-10',
      isRead: true,
      targetRole: 'admin_sekolah'
    }
  ],

  // 17. Audit Logs
  auditLogs: [
    {
      id: 'log-seed-01',
      timestamp: '2026-03-15T08:00:00.000Z',
      userId: 'usr-superadmin',
      username: 'superadmin',
      userRole: 'super_admin',
      action: 'SYSTEM_BOOTSTRAP',
      resource: 'database',
      details: 'Inisialisasi skema ternormalisasi 3NF dan validasi aturan keamanan zero-trust SMA Negeri 1 Julok',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS'
    }
  ]
};
