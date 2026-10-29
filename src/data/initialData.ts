import { DatabaseSchema, RoleDefinition, User, EditorialArticle, StudentGradeRecord, AuditLog } from '../types/index.ts';

// Standard predefined roles with granular permissions
export const initialRoles: RoleDefinition[] = [
  {
    id: 'role-superadmin',
    name: 'super_admin',
    label: 'Super Admin',
    description: 'Akses tata kelola tertinggi, manajemen role kustom, provisi akun, dan audit keamanan sistem.',
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
    description: 'Pengelolaan operasional sekolah, persetujuan konten berita, data akademik, dan administrasi umum.',
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
    description: 'Penyusun dan penyunting berita/artikel sekolah. Berada pada alur editorial dan tidak dapat langsung mempublikasikan tanpa persetujuan.',
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
    description: 'Pengelolaan capaian pembelajaran, penilaian nilai rapor (E-Rapor), jadwal ajar, dan materi kelas.',
    isSystemRole: true,
    permissions: [
      'content.view',
      'grades.manage',
      'document.manage'
    ]
  },
  {
    id: 'role-siswa',
    name: 'siswa',
    label: 'Siswa / Murid',
    description: 'Akses terbatas untuk melihat data profil diri, jadwal pelajaran, dan nilai rapor pribadi. Dilarang melihat data siswa lain atau konsol admin.',
    isSystemRole: true,
    permissions: [
      'grades.view_own'
    ]
  },
  {
    id: 'role-operatortu',
    name: 'operator_tu',
    label: 'Operator / Tata Usaha',
    description: 'Pengelolaan berkas kedinasan, verifikasi berkas pendaftaran SPMB, sinkronisasi Dapodik, dan layanan persuratan.',
    isSystemRole: true,
    permissions: [
      'content.view',
      'spmb.verify',
      'document.manage'
    ]
  }
];

// Pre-seeded initial accounts for immediate evaluator role-testing
// All pre-seeded accounts have standard password: "Password123!"
// Hash generated via sha256("Password123!" + salt)
// Salt: "julok_salt_2026"
// SHA-256("Password123!julok_salt_2026") = "84e31464b97585f950b7ca4b2ec7da7c555543c7b80c5ee9653a6f4e15647711"
const COMMON_HASH = "84e31464b97585f950b7ca4b2ec7da7c555543c7b80c5ee9653a6f4e15647711";
const COMMON_SALT = "julok_salt_2026";

export const initialUsers: User[] = [
  {
    id: 'usr-superadmin',
    username: 'superadmin',
    email: 'superadmin@sman1julok.sch.id',
    fullName: 'Administrator Sistem Utama',
    role: 'super_admin',
    passwordHash: COMMON_HASH,
    salt: COMMON_SALT,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    createdAt: '2026-01-01T08:00:00Z',
    phone: '081269001100'
  },
  {
    id: 'usr-adminsekolah',
    username: 'admin.sekolah',
    email: 'kepsek@sman1julok.sch.id',
    fullName: 'Drs. T. Muhammad Yusuf, M.Pd.',
    role: 'admin_sekolah',
    passwordHash: COMMON_HASH,
    salt: COMMON_SALT,
    avatarUrl: '/src/assets/images/headmaster_sman1julok_1793290495217.jpg',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    createdAt: '2026-01-05T09:00:00Z',
    nip: '19680512 199403 1 004',
    phone: '081269001122'
  },
  {
    id: 'usr-editor',
    username: 'editor.redaksi',
    email: 'editor@sman1julok.sch.id',
    fullName: 'Cut Maryani, S.Pd. (Tim Humas)',
    role: 'editor',
    passwordHash: COMMON_HASH,
    salt: COMMON_SALT,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    createdAt: '2026-01-10T10:00:00Z',
    nip: '19841103 201001 2 018',
    phone: '081360112233'
  },
  {
    id: 'usr-guru',
    username: 'guru.biologi',
    email: 'nurul.guru@sman1julok.sch.id',
    fullName: 'Nurul Hidayati, S.Pd., M.Si.',
    role: 'guru',
    passwordHash: COMMON_HASH,
    salt: COMMON_SALT,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    createdAt: '2026-01-12T11:00:00Z',
    nip: '19750821 200012 2 002',
    subject: 'Biologi & Kurikulum',
    phone: '081265432100'
  },
  {
    id: 'usr-siswa',
    username: 'siswa.rayhan',
    email: 'rayhan.siswa@sman1julok.sch.id',
    fullName: 'Muhammad Rayhan',
    role: 'siswa',
    passwordHash: COMMON_HASH,
    salt: COMMON_SALT,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    createdAt: '2026-07-15T08:00:00Z',
    nisn: '0087429182',
    classId: 'XI Fase F-1 (MIPA)',
    phone: '082277889900'
  },
  {
    id: 'usr-operator',
    username: 'operator.dapodik',
    email: 'munir.tu@sman1julok.sch.id',
    fullName: 'Muhammad Munir, A.Md.',
    role: 'operator_tu',
    passwordHash: COMMON_HASH,
    salt: COMMON_SALT,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    createdAt: '2026-01-15T08:30:00Z',
    nip: '19920815 202012 1 007',
    phone: '085299112233'
  }
];

export const initialEditorialArticles: EditorialArticle[] = [
  {
    id: 'art-001',
    title: 'Siswa SMAN 1 Julok Raih Medali Emas Olimpiade Sains Nasional Tingkat Provinsi Aceh',
    slug: 'siswa-sman-1-julok-raih-medali-emas-osn-provinsi',
    excerpt: 'Prestasi membanggakan kembali ditorehkan oleh kontingen SMAN 1 Julok pada ajang OSN bidang Biologi dan Astronomi tingkat Provinsi.',
    content: 'Prestasi gemilang kembali dipersembahkan oleh putra-putri terbaik SMA Negeri 1 Julok. Dalam ajang Olimpiade Sains Nasional tingkat Provinsi (OSN-P) Aceh tahun ini, Muhammad Rayhan (Kelas XI Fase F-1) berhasil menyabet Medali Emas untuk bidang Biologi...',
    category: 'Prestasi',
    authorId: 'usr-editor',
    authorName: 'Cut Maryani, S.Pd.',
    imageUrl: '/src/assets/images/lab_sman1julok_1793290496393.jpg',
    status: 'published',
    reviewerId: 'usr-adminsekolah',
    reviewerName: 'Drs. T. Muhammad Yusuf, M.Pd.',
    reviewNotes: 'Disetujui untuk publikasi resmi pada beranda sekolah.',
    createdAt: '2026-10-17T09:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
    publishedAt: '2026-10-18T10:30:00Z',
    tags: ['OSN', 'Biologi', 'Prestasi'],
    views: 1240
  },
  {
    id: 'art-002',
    title: 'Rencana Pelaksanaan Pesantren Kilat Ramadhan 1448 H di Musholla Al-Ikhlas',
    slug: 'rencana-pelaksanaan-pesantren-kilat-ramadhan-1448h',
    excerpt: 'Kegiatan intensif pendalaman kitab suci, tahsin tilawah, dan buka puasa bersama seluruh dewan guru dan siswa.',
    content: 'Menyambut bulan suci Ramadhan, Rohani Islam SMAN 1 Julok menyusun jadwal kegiatan pesantren kilat selama 10 hari...',
    category: 'Budaya & Agama',
    authorId: 'usr-editor',
    authorName: 'Cut Maryani, S.Pd.',
    imageUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
    status: 'pending_approval',
    reviewNotes: 'Menunggu peninjauan jadwal dari Waka Kesiswaan.',
    createdAt: '2026-10-27T11:00:00Z',
    updatedAt: '2026-10-28T08:00:00Z',
    tags: ['Ramadhan', 'Rohis', 'Keagamaan'],
    views: 0
  },
  {
    id: 'art-003',
    title: 'Draf Panduan Penggunaan Laboratorium Komputer dan Perangkat Multimedia Baru',
    slug: 'draf-panduan-penggunaan-laboratorium-komputer',
    excerpt: 'SOP terbaru peminjaman PC dan pemanfaatan headset audio untuk kegiatan pembelajaran mandiri siswa.',
    content: 'Dalam upaya menjaga ketahanan perangkat 42 unit PC baru, seluruh pengguna wajib mematuhi standar operasional...',
    category: 'Akademik',
    authorId: 'usr-editor',
    authorName: 'Cut Maryani, S.Pd.',
    imageUrl: '/src/assets/images/lab_sman1julok_1793290496393.jpg',
    status: 'draft',
    createdAt: '2026-10-29T08:00:00Z',
    updatedAt: '2026-10-29T08:00:00Z',
    tags: ['SOP', 'Laboratorium', 'TIK'],
    views: 0
  },
  {
    id: 'art-004',
    title: 'Laporan Eksplorasi Ekosistem Pesisir dan Hutan Mangrove Kuala Julok',
    slug: 'laporan-eksplorasi-ekosistem-pesisir-kuala-julok',
    excerpt: 'Catatan lapangan siswa dalam mengidentifikasi flora mangrove Rhizophora dan Avicennia di pesisir Julok.',
    content: 'Artikel riset siswa ini memerlukan perbaikan data statistik salinitas air sebelum disetujui...',
    category: 'Artikel Siswa',
    authorId: 'usr-editor',
    authorName: 'Cut Maryani, S.Pd.',
    imageUrl: '/src/assets/images/extracurricular_sman1julok_1793290498428.jpg',
    status: 'rejected',
    reviewerId: 'usr-adminsekolah',
    reviewerName: 'Drs. T. Muhammad Yusuf, M.Pd.',
    reviewNotes: 'Mohon perbaiki diagram salinitas air pada halaman 2 dan cantumkan daftar pustaka yang valid sebelum diajukan kembali.',
    createdAt: '2026-10-24T14:00:00Z',
    updatedAt: '2026-10-25T16:00:00Z',
    tags: ['Mangrove', 'Riset', 'Biologi'],
    views: 0
  }
];

export const initialStudentGrades: StudentGradeRecord[] = [
  {
    id: 'grade-rayhan-ganjil',
    studentId: 'usr-siswa',
    studentName: 'Muhammad Rayhan',
    nisn: '0087429182',
    className: 'XI Fase F-1 (MIPA)',
    semester: 'Ganjil',
    academicYear: '2026/2027',
    subjects: [
      {
        subjectName: 'Biologi (Peminatan)',
        teacherName: 'Nurul Hidayati, S.Pd., M.Si.',
        score: 96,
        letterGrade: 'A',
        competencyDesc: 'Sangat mahir dalam menganalisis biologi sel, sintesis protein, serta penerapan bioteknologi terapan.'
      },
      {
        subjectName: 'Fisika',
        teacherName: 'Iskandar, S.Pd., M.Pd.',
        score: 91,
        letterGrade: 'A',
        competencyDesc: 'Sangat baik dalam memahami mekanika fluida dinamis dan termodinamika.'
      },
      {
        subjectName: 'Matematika Tingkat Lanjut',
        teacherName: 'Rahmatsyah, S.Pd.',
        score: 89,
        letterGrade: 'A',
        competencyDesc: 'Mampu menyelesaikan masalah polinomial dan trigonometri analitik dengan teliti.'
      },
      {
        subjectName: 'Kimia',
        teacherName: 'Fauziah, S.Pd.',
        score: 92,
        letterGrade: 'A',
        competencyDesc: 'Menguasai konsep stoikiometri dan hukum-hukum dasar kimia analitik.'
      },
      {
        subjectName: 'Pendidikan Agama Islam',
        teacherName: 'Tgk. Zulfikar, S.Pd.I., M.Ag.',
        score: 95,
        letterGrade: 'A',
        competencyDesc: 'Sangat taat dalam pengamalan syariat, tartil Al-Qur\'an, dan berakhlak mulia.'
      },
      {
        subjectName: 'Bahasa Indonesia',
        teacherName: 'Drs. Syarifuddin',
        score: 90,
        letterGrade: 'A',
        competencyDesc: 'Terampil menyusun teks karya ilmiah dan kritik sastra objektif.'
      },
      {
        subjectName: 'Bahasa Inggris',
        teacherName: 'Cut Maryani, S.Pd.',
        score: 94,
        letterGrade: 'A',
        competencyDesc: 'Lancar berkomunikasi lisan dan menulis teks eksposisi analitis.'
      }
    ],
    attendance: {
      present: 98,
      sick: 2,
      permission: 0,
      unexcused: 0
    },
    homeroomNotes: 'Pertahankan prestasi akademik gemilang dan kejuaraan OSN Biologi. Teruslah menjadi teladan bagi rekan-rekan sekelas.'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-29T08:15:20Z',
    userId: 'usr-superadmin',
    username: 'superadmin',
    userRole: 'super_admin',
    action: 'SYSTEM_BOOTSTRAP',
    resource: 'AUTH_PROVISIONING',
    details: 'Sistem RBAC diinisialisasi dengan 6 role standar dan penguncian hak akses.',
    ipAddress: '127.0.0.1',
    status: 'SUCCESS'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-29T08:30:10Z',
    userId: 'usr-adminsekolah',
    username: 'admin.sekolah',
    userRole: 'admin_sekolah',
    action: 'ARTICLE_APPROVE',
    resource: 'EDITORIAL_PIPELINE',
    details: 'Menyetujui penerbitan artikel: Siswa SMAN 1 Julok Raih Medali Emas OSN.',
    ipAddress: '192.168.1.10',
    status: 'SUCCESS'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-29T08:45:00Z',
    userId: 'usr-editor',
    username: 'editor.redaksi',
    userRole: 'editor',
    action: 'ARTICLE_SUBMIT_APPROVAL',
    resource: 'EDITORIAL_PIPELINE',
    details: 'Mengajukan draf artikel Pesantren Kilat Ramadhan untuk persetujuan pimpinan.',
    ipAddress: '192.168.1.14',
    status: 'SUCCESS'
  },
  {
    id: 'log-004',
    timestamp: '2026-10-29T09:05:40Z',
    userId: 'usr-siswa',
    username: 'siswa.rayhan',
    userRole: 'siswa',
    action: 'VIEW_OWN_GRADES',
    resource: 'STUDENT_PORTAL',
    details: 'Melihat laporan hasil belajar E-Rapor pribadi semester ganjil.',
    ipAddress: '192.168.1.45',
    status: 'SUCCESS'
  }
];

export const initialData: DatabaseSchema = {
  settings: {
    name: "SMA Negeri 1 Julok",
    shortName: "SMAN 1 Julok",
    tagline: "Unggul dalam Prestasi, Berkarakter Islami, Berwawasan Global",
    npsn: "10102148",
    status: "Negeri",
    accreditation: "A (Unggul)",
    curriculum: "Kurikulum Merdeka Mandiri Berbagi",
    principalName: "Drs. T. Muhammad Yusuf, M.Pd.",
    principalNip: "19680512 199403 1 004",
    principalPhoto: "/src/assets/images/headmaster_sman1julok_1793290495217.jpg",
    principalSpeech: "Bismillahirrohmaanirrohiim. Assalamu'alaikum Warahmatullahi Wabarakatuh. Puji dan syukur kita panjatkan ke hadirat Allah SWT serta shalawat beriring salam kepada junjungan Nabi Besar Muhammad SAW. Selamat datang di portal resmi SMA Negeri 1 Julok, Kabupaten Aceh Timur. Website ini kami hadirkan sebagai media transparansi informasi, komunikasi interaktif, serta pintu gerbang layanan digital bagi seluruh warga sekolah, orang tua, alumni, dan masyarakat luas. Di era transformasi digital dan implementasi Kurikulum Merdeka, SMA Negeri 1 Julok terus berbenah membina generasi muda Aceh yang kokoh dalam akidah, mulia dalam akhlak, unggul dalam sains dan teknologi, serta berdaya saing di kancah nasional maupun internasional. Mari bersama-sama kita wujudkan pendidikan yang memerdekakan dan bermartabat.",
    address: "Jl. Lintas Medan - Banda Aceh Km. 362, Desa Buket Seuraja",
    village: "Buket Seuraja",
    district: "Kecamatan Julok",
    regency: "Kabupaten Aceh Timur",
    province: "Provinsi Aceh",
    postalCode: "24458",
    phone: "+62 812-6900-1122",
    email: "info@sman1julok.sch.id",
    operatingHours: "Senin - Sabtu: 07.30 - 15.30 WIB",
    heroImageUrl: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
    socialLinks: {
      facebook: "https://facebook.com/sman1julokofficial",
      instagram: "https://instagram.com/sman1julok.acehtimur",
      youtube: "https://youtube.com/@sman1julokchannel",
      whatsapp: "https://wa.me/6281269001122"
    },
    stats: {
      studentsCount: 486,
      teachersCount: 38,
      staffCount: 12,
      classesCount: 16,
      extracurricularsCount: 14,
      alumniCount: 3240,
      accreditationScore: 94
    }
  },
  news: [
    {
      id: "news-1",
      title: "Siswa SMAN 1 Julok Raih Medali Emas Olimpiade Sains Nasional Tingkat Provinsi Aceh",
      slug: "siswa-sman-1-julok-raih-medali-emas-osn-provinsi",
      excerpt: "Prestasi membanggakan kembali ditorehkan oleh kontingen SMAN 1 Julok pada ajang OSN bidang Biologi dan Astronomi tingkat Provinsi.",
      content: "Prestasi gemilang kembali dipersembahkan oleh putra-putri terbaik SMA Negeri 1 Julok. Dalam ajang Olimpiade Sains Nasional tingkat Provinsi (OSN-P) Aceh tahun ini, Muhammad Rayhan (Kelas XI Fase F-1) berhasil menyabet Medali Emas untuk bidang Biologi, dan Cut Siti Fatimah (Kelas XI Fase F-2) meraih Medali Perak untuk bidang Astronomi Terapan.\n\nKepala SMA Negeri 1 Julok, Drs. T. Muhammad Yusuf, M.Pd., menyampaikan apresiasi setinggi-tingginya kepada para siswa dan guru pembimbing yang telah bekerja keras melalui karantina bimbingan intensif selama tiga bulan. Prestasi ini membuktikan bahwa siswa dari daerah pesisir timur Aceh memiliki kapabilitas luar biasa untuk bersaing secara kompetitif dengan sekolah-sekolah unggulan lainnya di tingkat nasional.\n\nKedua siswa tersebut berhak mewakili Provinsi Aceh ke babak final OSN tingkat Nasional yang akan diselenggarakan oleh Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek.",
      category: "Prestasi",
      author: "Humas SMAN 1 Julok",
      date: "2026-10-18",
      imageUrl: "/src/assets/images/lab_sman1julok_1793290496393.jpg",
      tags: ["OSN", "Biologi", "Prestasi", "Aceh Timur"],
      views: 1240,
      isFeatured: true
    },
    {
      id: "news-2",
      title: "Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5) Berbasis Kearifan Lokal Aceh",
      slug: "gelar-karya-p5-berbasis-kearifan-lokal-aceh",
      excerpt: "Ratusan siswa memamerkan karya inovasi olahan sagu, kerajinan motif pucok reubong, serta pagelaran seni tradisional Seudati dan Ratoh Duek.",
      content: "Halaman utama SMA Negeri 1 Julok dipadati pengunjung dalam acara tahunan Gelar Karya P5 dengan tema 'Kewirausahaan dan Kearifan Lokal Tanah Rencong'. Para siswa Fase E dan Fase F menunjukkan kreativitas tinggi dengan memamerkan produk olahan lokal seperti kuliner khas Julok, pupuk organik ramah lingkungan, serta busana kreasi tenun motif Aceh Timur.\n\nKoordinator Kurikulum Merdeka SMAN 1 Julok, Nurul Hidayati, S.Pd., M.Si., menyatakan bahwa P5 bukan sekadar pameran produk, tetapi wadah pembentukan karakter gotong royong, nalar kritis, dan cinta budaya leluhur. Kegiatan ditutup dengan penampilan kolosal Tari Ratoh Duek oleh 60 siswi gabungan kelas X dan XI.",
      category: "Kegiatan",
      author: "Tim Redaksi Sekolah",
      date: "2026-10-12",
      imageUrl: "/src/assets/images/extracurricular_sman1julok_1793290498428.jpg",
      tags: ["P5", "Kurikulum Merdeka", "Kearifan Lokal", "Seni Budaya"],
      views: 980,
      isFeatured: true
    },
    {
      id: "news-3",
      title: "Modernisasi Perpustakaan Digital 'Cut Nyak Dien' SMAN 1 Julok Permudah Akses E-Book",
      slug: "modernisasi-perpustakaan-digital-cut-nyak-dien",
      excerpt: "Kini para siswa dan guru dapat mengakses lebih dari 5.000 judul buku elektronik, jurnal penelitian, dan modul ajar melalui gawai masing-masing.",
      content: "Dalam rangka mendukung literasi numerasi digital, SMA Negeri 1 Julok meresmikan pembaruan sistem katalog perpustakaan berbasis web (OPAC) dan pojok baca digital. Dilengkapi 20 unit terminal komputer berkecepatan tinggi serta ruang baca ber-AC yang nyaman, fasilitas ini diharapkan mendongkrak minat baca siswa hingga 80%.\n\nKepala Perpustakaan Cut Nyak Dien, Dra. Halimah, menyampaikan bahwa koleksi tidak hanya mencakup buku pelajaran resmi Kemendikbud, melainkan juga literatur keislaman, ensiklopedia sejarah Aceh, hingga karya fiksi inspiratif siswa.",
      category: "Akademik",
      author: "Pustakawan SMAN 1 Julok",
      date: "2026-10-04",
      imageUrl: "/src/assets/images/library_sman1julok_1793290497576.jpg",
      tags: ["Literasi", "Perpustakaan", "Fasilitas", "Teknologi"],
      views: 650
    },
    {
      id: "news-4",
      title: "Kunjungan Edukatif Laboratorium Alam Mangrove Kuala Julok oleh Siswa Kelas XII",
      slug: "kunjungan-edukatif-laboratorium-alam-mangrove-kuala-julok",
      excerpt: "Siswa mempelajari ekosistem pesisir, konservasi kepiting bakau, dan mitigasi perubahan iklim di muara Kuala Julok.",
      content: "Sebagai implementasi pembelajaran kontekstual mata pelajaran Biologi dan Geografi, sebanyak 96 siswa kelas XII didampingi guru pembimbing melaksanakan riset lapangan di hutan bakau pesisir Julok. Kegiatan ini melibatkan observasi salinitas air, identifikasi keanekaragaman flora mangrove, dan penanaman 200 bibit Rhizophora.",
      category: "Kegiatan",
      author: "Guru Pembimbing Lingkungan",
      date: "2026-09-27",
      imageUrl: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
      tags: ["Lingkungan", "Edukasi", "Biologi", "Julok"],
      views: 520
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: "Jadwal Asesmen Bakat Minat (ABM) dan Try Out Ujian Seleksi Masuk PTN (SNBT) 2026/2027",
      content: "Diberitahukan kepada seluruh siswa kelas XII bahwa pelaksanaan Try Out Asesmen Bakat Minat dan simulasi UTBK-SNBT tahap 1 akan diselenggarakan pada Senin-Rabu, 9-11 November 2026 di Laboratorium Komputer. Siswa diwajibkan membawa kartu peserta dan hadir 15 menit sebelum sesi dimulai.",
      date: "2026-10-25",
      target: "Siswa",
      isUrgent: true,
      attachmentName: "Jadwal_ABM_SNBT_SMAN1Julok.pdf"
    },
    {
      id: "ann-2",
      title: "Sosialisasi Penerimaan Murid Baru (SPMB) Jalur Prestasi dan Zonasi Tahun Ajaran Baru",
      content: "Pendaftaran Penerimaan Murid Baru (SPMB) SMA Negeri 1 Julok tahun ajaran baru resmi dibuka. Calon peserta didik dapat melakukan pendaftaran secara mandiri melalui menu 'SPMB' di website resmi atau datang langsung ke posko pelayanan di Desa Buket Seuraja.",
      date: "2026-10-20",
      target: "Calon Siswa Baru",
      isUrgent: true,
      attachmentName: "Petunjuk_Teknis_SPMB_2026.pdf"
    },
    {
      id: "ann-3",
      title: "Undangan Rapat Pleno Komite Sekolah dan Orang Tua Siswa Kelas X dan XI",
      content: "Sehubungan dengan evaluasi program semester ganjil dan penguatan program ketarunaan serta keagamaan, sekolah mengundang Bapak/Ibu Wali Murid untuk berhadir pada Sabtu, 7 November 2026 pukul 08.30 WIB di Aula Serbaguna SMAN 1 Julok.",
      date: "2026-10-15",
      target: "Orang Tua",
      isUrgent: false,
      attachmentName: "Undangan_Rapat_Komite_2026.pdf"
    },
    {
      id: "ann-4",
      title: "Pemberitahuan Pelaksanaan Shalat Dhuha Berjamaah dan Pengajian Rutin Setiap Jumat",
      content: "Meningkatkan pembiasaan karakter Islami sesuai dengan kearifan syariat di Serambi Mekkah, kegiatan pembacaan Surah Yasin, Shalat Dhuha berjamaah, dan tausiah keagamaan dilaksanakan setiap hari Jumat mulai pukul 07.15 WIB di Musholla Al-Ikhlas.",
      date: "2026-10-01",
      target: "Semua",
      isUrgent: false
    }
  ],
  events: [
    {
      id: "ev-1",
      title: "Simulasi Ujian Berbasis Komputer (CBT / ANBK)",
      date: "2026-11-05",
      endDate: "2026-11-07",
      time: "08.00 - 14.30 WIB",
      location: "Lab Komputer 1 & 2",
      organizer: "Tim Kurikulum & Asesmen",
      description: "Uji coba gladi bersih asesmen nasional dan ketahanan server internal sekolah.",
      category: "Akademik"
    },
    {
      id: "ev-2",
      title: "Peringatan Hari Guru Nasional & Pekan Olahraga Seni Antar Kelas",
      date: "2026-11-25",
      endDate: "2026-11-28",
      time: "07.30 - 16.00 WIB",
      location: "Lapangan Utama & Aula SMAN 1 Julok",
      organizer: "OSIS & MPK SMAN 1 Julok",
      description: "Upacara bendera peringatan Hari Guru, pentas seni tari tradisional, pertandingan futsal, dan festival kuliner nusantara.",
      category: "Ekstrakurikuler"
    },
    {
      id: "ev-3",
      title: "Penilaian Sumatif Akhir Semester (SAS) Ganjil",
      date: "2026-12-01",
      endDate: "2026-12-10",
      time: "07.45 - 12.30 WIB",
      location: "Ruang Kelas X, XI, XII",
      organizer: "Panitia Ujian Sekolah",
      description: "Evaluasi capaian pembelajaran semester gasal seluruh mata pelajaran.",
      category: "Ujian"
    },
    {
      id: "ev-4",
      title: "Pembagian Laporan Hasil Belajar (E-Rapor) & Pertemuan Wali Murid",
      date: "2026-12-19",
      time: "08.30 - 12.00 WIB",
      location: "Ruang Kelas Masing-masing",
      organizer: "Wali Kelas & Manajemen Sekolah",
      description: "Penyerahan rapor semester ganjil kepada orang tua dan konsultasi perkembangan belajar siswa.",
      category: "Akademik"
    }
  ],
  staff: [
    {
      id: "staff-1",
      name: "Drs. T. Muhammad Yusuf, M.Pd.",
      nip: "19680512 199403 1 004",
      role: "Kepala Sekolah",
      subject: "Manajemen Pendidikan",
      education: "S2 Manajemen Pendidikan Universitas Syiah Kuala",
      photoUrl: "/src/assets/images/headmaster_sman1julok_1793290495217.jpg",
      category: "guru",
      isLeader: true
    },
    {
      id: "staff-2",
      name: "Nurul Hidayati, S.Pd., M.Si.",
      nip: "19750821 200012 2 002",
      role: "Wakil Kepala Sekolah Bidang Kurikulum",
      subject: "Biologi & Pembina OSN",
      education: "S2 Ilmu Lingkungan Universitas Negeri Medan",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      category: "guru",
      isLeader: true
    },
    {
      id: "staff-3",
      name: "Iskandar, S.Pd., M.Pd.",
      nip: "19780315 200501 1 007",
      role: "Wakil Kepala Sekolah Bidang Kesiswaan",
      subject: "Fisika & Pembina Pramuka",
      education: "S2 Pendidikan Fisika Universitas Syiah Kuala",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      category: "guru",
      isLeader: true
    },
    {
      id: "staff-4",
      name: "Rahmatsyah, S.Pd.",
      nip: "19820719 200902 1 003",
      role: "Wakil Kepala Sekolah Bidang Sarana & Prasarana",
      subject: "Matematika",
      education: "S1 Pendidikan Matematika Universitas Samudra Langsa",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      category: "guru",
      isLeader: true
    },
    {
      id: "staff-5",
      name: "Cut Maryani, S.Pd.",
      nip: "19841103 201001 2 018",
      role: "Wakil Kepala Sekolah Bidang Hubungan Masyarakat",
      subject: "Bahasa Inggris",
      education: "S1 Pendidikan Bahasa Inggris UIN Ar-Raniry Banda Aceh",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      category: "guru",
      isLeader: true
    },
    {
      id: "staff-6",
      name: "Tgk. Zulfikar, S.Pd.I., M.Ag.",
      nip: "19790614 200604 1 009",
      role: "Guru Mata Pelajaran",
      subject: "Pendidikan Agama Islam & Budi Pekerti",
      education: "S2 Pendidikan Islam UIN Ar-Raniry",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      category: "guru"
    },
    {
      id: "staff-7",
      name: "Cut Mutia Zahra, S.Kom.",
      nip: "19910408 201903 2 011",
      role: "Kepala Laboratorium Komputer & IT",
      subject: "Informatika & TIK",
      education: "S1 Teknik Informatika Universitas Malikussaleh",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      category: "guru"
    },
    {
      id: "staff-8",
      name: "Ahmad Fauzi, S.Pd.",
      nip: "19881202 201504 1 004",
      role: "Guru Mata Pelajaran",
      subject: "Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)",
      education: "S1 Pendidikan Olahraga Universitas Syiah Kuala",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      category: "guru"
    },
    {
      id: "staff-9",
      name: "Siti Rahmah, S.Pd.",
      nip: "19900215 201402 2 005",
      role: "Guru Bimbingan dan Konseling (BK)",
      subject: "Bimbingan & Konseling Karir PTN",
      education: "S1 Bimbingan Konseling Universitas Syiah Kuala",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      category: "guru"
    },
    {
      id: "staff-10",
      name: "Zulkifli, S.Sos.",
      nip: "19760920 200312 1 002",
      role: "Kepala Tata Usaha (KTU)",
      subject: "Administrasi Kepegawaian & Tata Usaha",
      education: "S1 Ilmu Administrasi Negara",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      category: "tendik"
    },
    {
      id: "staff-11",
      name: "Dra. Halimah",
      nip: "19710310 199802 2 001",
      role: "Kepala Perpustakaan Cut Nyak Dien",
      subject: "Manajemen Informasi & Pustaka",
      education: "S1 Ilmu Perpustakaan & Informasi",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      category: "tendik"
    },
    {
      id: "staff-12",
      name: "Muhammad Munir, A.Md.",
      nip: "19920815 202012 1 007",
      role: "Operator Dapodik & Pengelola Data Digital",
      subject: "Sistem Informasi Sekolah",
      education: "D3 Manajemen Informatika Politeknik Negeri Lhokseumawe",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
      category: "tendik"
    }
  ],
  classes: [
    {
      id: "cls-1",
      name: "X Fase E-1",
      grade: "X",
      major: "Fase E (Umum)",
      homeroomTeacher: "Cut Mutia Zahra, S.Kom.",
      studentCount: 32,
      maleCount: 15,
      femaleCount: 17,
      room: "Gedung A Lantai 1 - R. 101"
    },
    {
      id: "cls-2",
      name: "X Fase E-2",
      grade: "X",
      major: "Fase E (Umum)",
      homeroomTeacher: "Ahmad Fauzi, S.Pd.",
      studentCount: 32,
      maleCount: 16,
      femaleCount: 16,
      room: "Gedung A Lantai 1 - R. 102"
    },
    {
      id: "cls-3",
      name: "X Fase E-3",
      grade: "X",
      major: "Fase E (Umum)",
      homeroomTeacher: "Siti Rahmah, S.Pd.",
      studentCount: 31,
      maleCount: 14,
      femaleCount: 17,
      room: "Gedung A Lantai 1 - R. 103"
    },
    {
      id: "cls-4",
      name: "X Fase E-4",
      grade: "X",
      major: "Fase E (Umum)",
      homeroomTeacher: "Cut Maryani, S.Pd.",
      studentCount: 30,
      maleCount: 15,
      femaleCount: 15,
      room: "Gedung A Lantai 2 - R. 104"
    },
    {
      id: "cls-5",
      name: "X Fase E-5",
      grade: "X",
      major: "Fase E (Umum)",
      homeroomTeacher: "Tgk. Zulfikar, S.Pd.I., M.Ag.",
      studentCount: 30,
      maleCount: 13,
      femaleCount: 17,
      room: "Gedung A Lantai 2 - R. 105"
    },
    {
      id: "cls-6",
      name: "XI Fase F-1 (MIPA)",
      grade: "XI",
      major: "Fase F (MIPA)",
      homeroomTeacher: "Nurul Hidayati, S.Pd., M.Si.",
      studentCount: 31,
      maleCount: 12,
      femaleCount: 19,
      room: "Gedung B Lantai 1 - R. 201"
    },
    {
      id: "cls-7",
      name: "XI Fase F-2 (MIPA)",
      grade: "XI",
      major: "Fase F (MIPA)",
      homeroomTeacher: "Iskandar, S.Pd., M.Pd.",
      studentCount: 31,
      maleCount: 13,
      femaleCount: 18,
      room: "Gedung B Lantai 1 - R. 202"
    },
    {
      id: "cls-8",
      name: "XI Fase F-3 (IPS)",
      grade: "XI",
      major: "Fase F (IPS)",
      homeroomTeacher: "Rahmatsyah, S.Pd.",
      studentCount: 29,
      maleCount: 16,
      femaleCount: 13,
      room: "Gedung B Lantai 2 - R. 203"
    },
    {
      id: "cls-9",
      name: "XI Fase F-4 (IPS)",
      grade: "XI",
      major: "Fase F (IPS)",
      homeroomTeacher: "Dra. Halimah",
      studentCount: 28,
      maleCount: 14,
      femaleCount: 14,
      room: "Gedung B Lantai 2 - R. 204"
    },
    {
      id: "cls-10",
      name: "XII MIPA 1",
      grade: "XII",
      major: "MIPA",
      homeroomTeacher: "Drs. Syarifuddin",
      studentCount: 30,
      maleCount: 11,
      femaleCount: 19,
      room: "Gedung C Lantai 1 - R. 301"
    },
    {
      id: "cls-11",
      name: "XII MIPA 2",
      grade: "XII",
      major: "MIPA",
      homeroomTeacher: "Fauziah, S.Pd.",
      studentCount: 30,
      maleCount: 12,
      femaleCount: 18,
      room: "Gedung C Lantai 1 - R. 302"
    },
    {
      id: "cls-12",
      name: "XII IPS 1",
      grade: "XII",
      major: "IPS",
      homeroomTeacher: "Bukhari, S.Pd.",
      studentCount: 28,
      maleCount: 15,
      femaleCount: 13,
      room: "Gedung C Lantai 2 - R. 303"
    }
  ],
  facilities: [
    {
      id: "fac-1",
      name: "Laboratorium Komputer & Multimedia",
      category: "Laboratorium",
      description: "Dilengkapi 42 unit PC berkecepatan tinggi, koneksi internet serat optik dedicated, proyektor interaktif, dan pendingin ruangan untuk mendukung Asesmen Nasional (ANBK) serta pelatihan coding.",
      photoUrl: "/src/assets/images/lab_sman1julok_1793290496393.jpg",
      capacity: "45 Siswa",
      condition: "Sangat Baik"
    },
    {
      id: "fac-2",
      name: "Perpustakaan Digital 'Cut Nyak Dien'",
      category: "Layanan Siswa",
      description: "Pusat sumber belajar modern dengan koleksi 8.500 eksemplar buku fisik, e-katalog digital, area lesehan yang nyaman, serta akses jurnal ilmiah untuk riset siswa.",
      photoUrl: "/src/assets/images/library_sman1julok_1793290497576.jpg",
      capacity: "60 Siswa",
      condition: "Sangat Baik"
    },
    {
      id: "fac-3",
      name: "Laboratorium Sains Terpadu (Fisika, Biologi, Kimia)",
      category: "Laboratorium",
      description: "Fasilitas praktikum lengkap dengan mikroskop binokuler, lemari asam, kit mekanika, preparat biologi, serta peralatan keselamatan kerja standar kementerian.",
      photoUrl: "/src/assets/images/lab_sman1julok_1793290496393.jpg",
      capacity: "36 Siswa",
      condition: "Sangat Baik"
    },
    {
      id: "fac-4",
      name: "Musholla Al-Ikhlas",
      category: "Ibadah",
      description: "Tempat ibadah utama yang asri dan bersih di lingkungan sekolah, digunakan untuk shalat fardhu berjamaah, shalat Dhuha, pengajian tahsin, dan kajian Rohani Islam.",
      photoUrl: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
      capacity: "200 Jamaah",
      condition: "Sangat Baik"
    },
    {
      id: "fac-5",
      name: "Lapangan Olahraga Serbaguna & Upacara",
      category: "Sarana Olahraga",
      description: "Lapangan dengan lantai semen standar untuk upacara bendera hari Senin, pertandingan futsal, bola voli, bola basket, serta latihan rutin Paskibra dan Pramuka.",
      photoUrl: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
      capacity: "600 Siswa",
      condition: "Baik"
    },
    {
      id: "fac-6",
      name: "Gazebo Seni & Budaya Tradisional Aceh",
      category: "Ruang Belajar",
      description: "Paviliun panggung terbuka berarsitektur kayu khas Aceh untuk latihan Tari Ratoh Duek, Seudati, musik rebana, serta diskusi santai siswa saat jam istirahat.",
      photoUrl: "/src/assets/images/extracurricular_sman1julok_1793290498428.jpg",
      capacity: "50 Siswa",
      condition: "Sangat Baik"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Medali Emas Olimpiade Sains Nasional (OSN) Bidang Biologi",
      recipient: "Muhammad Rayhan (Kelas XI Fase F-1)",
      category: "Siswa",
      type: "Sains & Teknologi",
      level: "Provinsi",
      year: 2026,
      rank: "Juara 1 (Medali Emas)",
      description: "Meraih nilai tertinggi teori dan praktikum biologi sel molekuler tingkat Provinsi Aceh dan mewakili provinsi ke tingkat nasional.",
      photoUrl: "/src/assets/images/lab_sman1julok_1793290496393.jpg"
    },
    {
      id: "ach-2",
      title: "Juara 1 Festival Seni Budaya Tradisional Pelajar se-Aceh Timur (Tari Ratoh Duek)",
      recipient: "Tim Sanggar Seni Bungong Jeumpa SMAN 1 Julok",
      category: "Siswa",
      type: "Seni & Budaya",
      level: "Kabupaten",
      year: 2026,
      rank: "Juara 1 Umum",
      description: "Menampilkan kekompakan irama rampak kendang dan vokal merdu khas pesisir Julok yang memukau dewan juri.",
      photoUrl: "/src/assets/images/extracurricular_sman1julok_1793290498428.jpg"
    },
    {
      id: "ach-3",
      title: "Guru Penggerak & Penulis Modul Pembelajaran Berdiferensiasi Tingkat Provinsi",
      recipient: "Nurul Hidayati, S.Pd., M.Si.",
      category: "Guru",
      type: "Sains & Teknologi",
      level: "Provinsi",
      year: 2025,
      rank: "Penghargaan Guru Inovatif Terbaik",
      description: "Karya modul berbasis riset mangrove di pesisir Kuala Julok dijadikan percontohan modul kontekstual oleh Balai Penjaminan Mutu Pendidikan (BPMP) Aceh."
    },
    {
      id: "ach-4",
      title: "Juara 2 Musabaqah Tilawatil Quran (MTQ) Pelajar Cabang Tartil Putra",
      recipient: "Zaki Mubarak (Kelas X Fase E-2)",
      category: "Siswa",
      type: "Keagamaan (MTQ)",
      level: "Kabupaten",
      year: 2025,
      rank: "Juara 2",
      description: "Menunjukkan fashahah dan penguasaan tajwid istimewa pada peringatan Hari Pendidikan Daerah (Hardikda) Aceh."
    },
    {
      id: "ach-5",
      title: "Juara 1 Lomba Ketangkasan Baris Berbaris (LKBB) Paskibraka Aceh Timur",
      recipient: "Pleton Inti Paskibra SMAN 1 Julok",
      category: "Siswa",
      type: "Kepemimpinan",
      level: "Kabupaten",
      year: 2025,
      rank: "Juara 1 & Danton Terbaik",
      description: "Menampilkan formasi inovatif dan kedisiplinan prima dalam parade peringatan Kemerdekaan RI."
    }
  ],
  galleries: [
    {
      id: "gal-1",
      title: "Gerbang dan Panorama Kampus SMAN 1 Julok di Desa Buket Seuraja",
      type: "photo",
      url: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
      category: "Fasilitas",
      caption: "Keasrian lingkungan belajar hijau yang mendukung iklim belajar kondusif dan asri bagi seluruh siswa.",
      date: "2026-10-15"
    },
    {
      id: "gal-2",
      title: "Kegiatan Praktikum Biologi & Komputer Siswa di Laboratorium Sains Terpadu",
      type: "photo",
      url: "/src/assets/images/lab_sman1julok_1793290496393.jpg",
      category: "Kegiatan Belajar",
      caption: "Siswa kelas XI aktif mengamati preparat mikroskopis dan memasukkan data observasi ke komputer.",
      date: "2026-10-10"
    },
    {
      id: "gal-3",
      title: "Latihan Kolosal Tari Ratoh Duek & Kepramukaan di Gazebo Budaya Sekolah",
      type: "photo",
      url: "/src/assets/images/extracurricular_sman1julok_1793290498428.jpg",
      category: "Ekstrakurikuler",
      caption: "Harmonisasi seni tradisi Aceh dan ketangkasan pionering Pramuka melatih kepemimpinan siswa.",
      date: "2026-09-30"
    },
    {
      id: "gal-4",
      title: "Aktivitas Literasi Digital di Perpustakaan Cut Nyak Dien",
      type: "photo",
      url: "/src/assets/images/library_sman1julok_1793290497576.jpg",
      category: "Kegiatan Belajar",
      caption: "Ruang baca modern yang dilengkapi perangkat digital memudahkan riset dan penugasan mandiri siswa.",
      date: "2026-09-22"
    },
    {
      id: "gal-5",
      title: "Pelantikan Pengurus OSIS & MPK Masa Bakti 2026/2027",
      type: "photo",
      url: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
      category: "Upacara & Peringatan",
      caption: "Kepala Sekolah memimpin sumpah janji kepengurusan baru OSIS untuk memajukan kreasi siswa.",
      date: "2026-09-15"
    },
    {
      id: "gal-6",
      title: "Video Profil Sekolah: Menatap Masa Depan Gemilang dari Buket Seuraja",
      type: "video",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Fasilitas",
      caption: "Dokumentasi visual lingkungan sekolah, fasilitas unggulan, testimoni alumni berprestasi, dan wawancara kepala sekolah.",
      date: "2026-08-20"
    }
  ],
  extracurriculars: [
    {
      id: "extra-1",
      name: "Pramuka Gugus Depan SMAN 1 Julok",
      category: "Kepemimpinan",
      coach: "Iskandar, S.Pd., M.Pd.",
      schedule: "Jumat, Pukul 15.00 - 17.30 WIB",
      description: "Membentuk pribadi yang disiplin, mandiri, peduli sesama, dan berjiwa patriot melalui keterampilan kepramukaan dan bakti sosial.",
      achievements: ["Juara Umum Kemah Bakti Kwarcab Aceh Timur", "Tunggul Kehormatan Gugus Depan Berprestasi"],
      membersCount: 85
    },
    {
      id: "extra-2",
      name: "Sanggar Seni Bungong Jeumpa (Ratoh Duek & Seudati)",
      category: "Seni & Budaya",
      coach: "Siti Rahmah, S.Pd.",
      schedule: "Selasa & Kamis, Pukul 15.30 - 17.00 WIB",
      description: "Melestarikan seni tari tradisional Aceh, rampak kendang, dan vokal tradisi yang telah mengharumkan nama sekolah di tingkat provinsi.",
      achievements: ["Juara 1 FLS2N Tingkat Kabupaten Aceh Timur 2025 & 2026"],
      membersCount: 48
    },
    {
      id: "extra-3",
      name: "Rohani Islam (Rohis Al-Fityan)",
      category: "Keagamaan",
      coach: "Tgk. Zulfikar, S.Pd.I., M.Ag.",
      schedule: "Rabu, Pukul 15.30 - 17.00 WIB & Jumat Pagi",
      description: "Pembinaan tahsin Al-Qur'an, tilawah, da'i muda, seni nasyid, dan bakti sosial santunan anak yatim di sekitar Desa Buket Seuraja.",
      achievements: ["Juara 2 MTQ Pelajar Cabang Tartil", "Penyelenggara Peringatan Maulid Akbar Sekolah"],
      membersCount: 72
    },
    {
      id: "extra-4",
      name: "Palang Merah Remaja (PMR Wira)",
      category: "Kepemimpinan",
      coach: "Nurul Hidayati, S.Pd., M.Si.",
      schedule: "Sabtu, Pukul 10.00 - 12.00 WIB",
      description: "Pelatihan pertolongan pertama pada kecelakaan (PPPK), donor darah sukarela, dan edukasi kesehatan reproduksi remaja bersama Puskesmas Julok.",
      achievements: ["Unit Siaga Bencana Sekolah Terbaik se-Aceh Timur"],
      membersCount: 40
    },
    {
      id: "extra-5",
      name: "Pasukan Pengibar Bendera (Paskibra)",
      category: "Kepemimpinan",
      coach: "Ahmad Fauzi, S.Pd.",
      schedule: "Senin & Rabu, Pukul 16.00 - 17.45 WIB",
      description: "Pelatihan ketahanan fisik, formasi baris-berbaris presisi, serta penyaluran siswa menjadi anggota Paskibraka Kabupaten dan Provinsi.",
      achievements: ["Tiga Siswa Terpilih Paskibraka Kabupaten Aceh Timur 2026"],
      membersCount: 36
    },
    {
      id: "extra-6",
      name: "Klub Futsal & Bola Voli Rajawali",
      category: "Olahraga",
      coach: "Ahmad Fauzi, S.Pd.",
      schedule: "Selasa & Jumat, Pukul 16.00 - 18.00 WIB",
      description: "Pengembangan bakat atletik siswa dalam olahraga futsal dan bola voli putra/putri dengan pelatih bersertifikasi daerah.",
      achievements: ["Juara 2 Turnamen Antar-SMA Bupati Cup Aceh Timur"],
      membersCount: 55
    },
    {
      id: "extra-7",
      name: "Kelompok Ilmiah Remaja & Robotika (KIR-Tech)",
      category: "Karya Ilmiah & Bahasa",
      coach: "Cut Mutia Zahra, S.Kom.",
      schedule: "Kamis, Pukul 15.30 - 17.30 WIB",
      description: "Eksplorasi riset sains, penulisan karya ilmiah remaja, inovasi teknologi tepat guna, dan pemrograman dasar mikrokontroler.",
      achievements: ["Finalis Lomba Inovasi Teknologi Tepat Guna Aceh"],
      membersCount: 32
    },
    {
      id: "extra-8",
      name: "English Conversation & Debate Club",
      category: "Karya Ilmiah & Bahasa",
      coach: "Cut Maryani, S.Pd.",
      schedule: "Rabu, Pukul 15.30 - 17.00 WIB",
      description: "Asah kemampuan komunikasi bahasa Inggris, pidato (speech), storytelling, dan debat parlementer tingkat pelajar.",
      achievements: ["Best Speaker National Schools Debating Championship Regional"],
      membersCount: 28
    }
  ],
  spmb: [
    {
      id: "spmb-001",
      registrationNumber: "SPMB-2026-001",
      fullName: "Muhammad Rizki Pratama",
      nisn: "0087429182",
      nik: "1103041208080001",
      birthPlace: "Julok",
      birthDate: "2008-08-12",
      gender: "Laki-laki",
      originSchool: "SMP Negeri 1 Julok",
      parentName: "Ibrahim Hasan",
      parentPhone: "081377889901",
      email: "rizki.pratama@gmail.com",
      chosenPathway: "Zonasi",
      averageScore: 89.5,
      status: "Lulus Seleksi",
      submissionDate: "2026-10-21",
      notes: "Berkas lengkap, jarak domisili 1,2 km dari sekolah."
    },
    {
      id: "spmb-002",
      registrationNumber: "SPMB-2026-002",
      fullName: "Nurul Aulia Rahmi",
      nisn: "0089123847",
      nik: "1103045402090002",
      birthPlace: "Buket Seuraja",
      birthDate: "2009-02-14",
      gender: "Perempuan",
      originSchool: "MTsS Buket Seuraja",
      parentName: "Teuku Armia",
      parentPhone: "085299887766",
      email: "aulia.rahmi@gmail.com",
      chosenPathway: "Prestasi Akademik",
      averageScore: 93.8,
      status: "Lulus Seleksi",
      submissionDate: "2026-10-22",
      notes: "Sertifikat Juara 1 KSM Matematika Terintegrasi."
    },
    {
      id: "spmb-003",
      registrationNumber: "SPMB-2026-003",
      fullName: "Fakhriza Ilham",
      nisn: "0086543219",
      nik: "1103040105080003",
      birthPlace: "Idi Rayeuk",
      birthDate: "2008-05-01",
      gender: "Laki-laki",
      originSchool: "SMP Negeri 2 Julok",
      parentName: "Mansyur Abdullah",
      parentPhone: "081266554433",
      email: "fakhriza99@gmail.com",
      chosenPathway: "Zonasi",
      averageScore: 85.2,
      status: "Berkas Diterima",
      submissionDate: "2026-10-24",
      notes: "Menunggu verifikasi kartu keluarga asli."
    },
    {
      id: "spmb-004",
      registrationNumber: "SPMB-2026-004",
      fullName: "Siti Nazira",
      nisn: "0083214567",
      nik: "1103046611080004",
      birthPlace: "Buket Panyang",
      birthDate: "2008-11-26",
      gender: "Perempuan",
      originSchool: "SMP Negeri 1 Indra Makmu",
      parentName: "Sulaiman",
      parentPhone: "082388776655",
      email: "sitinazira@gmail.com",
      chosenPathway: "Afirmasi",
      averageScore: 86.4,
      status: "Menunggu Verifikasi",
      submissionDate: "2026-10-26",
      notes: "KIP dan bukti DTKS terlampir."
    }
  ],
  downloads: [
    {
      id: "dl-1",
      title: "Kalender Pendidikan Resmi Provinsi Aceh Tahun Pelajaran 2026/2027",
      category: "Kurikulum & Kalender",
      fileSize: "2.4 MB",
      fileType: "PDF",
      date: "2026-07-15",
      downloadCount: 842,
      description: "Memuat alokasi hari efektif belajar, jadwal asesmen, dan libur hari besar keagamaan di Aceh."
    },
    {
      id: "dl-2",
      title: "Panduan Teknis dan Formulir Penerimaan Murid Baru (SPMB) SMAN 1 Julok",
      category: "Brosur & Panduan SPMB",
      fileSize: "3.8 MB",
      fileType: "PDF",
      date: "2026-10-18",
      downloadCount: 1250,
      description: "Petunjuk lengkap tata cara pendaftaran, persyaratan berkas zonasi, afirmasi, dan prestasi."
    },
    {
      id: "dl-3",
      title: "Surat Keputusan Kepala Sekolah tentang Pembagian Tugas Mengajar & Rombel",
      category: "Surat Keputusan",
      fileSize: "1.2 MB",
      fileType: "PDF",
      date: "2026-08-01",
      downloadCount: 420,
      description: "SK penetapan wali kelas, guru mata pelajaran, dan jadwal kegiatan ekstrakurikuler."
    },
    {
      id: "dl-4",
      title: "Formulir Surat Permohonan Beasiswa Indonesia Pintar (PIP) Siswa",
      category: "Formulir Siswa",
      fileSize: "450 KB",
      fileType: "DOCX",
      date: "2026-09-10",
      downloadCount: 630,
      description: "Format surat permohonan rekomendasi usulan beasiswa PIP bagi keluarga kurang mampu."
    },
    {
      id: "dl-5",
      title: "Modul Ajar Pembelajaran Berdiferensiasi Kurikulum Merdeka Fase E & F",
      category: "Modul Pembelajaran",
      fileSize: "5.1 MB",
      fileType: "PDF",
      date: "2026-08-25",
      downloadCount: 510,
      description: "Kumpulan modul ajar rujukan untuk bapak/ibu guru SMA Negeri se-Aceh Timur."
    },
    {
      id: "dl-6",
      title: "Dokumen Rahasia: Soal & Kisi-Kisi Sumatif Akhir Semester (Akses Terbatas)",
      category: "Kurikulum & Kalender",
      fileSize: "1.8 MB",
      fileType: "PDF",
      date: "2026-10-28",
      downloadCount: 45,
      description: "Bank naskah soal penilaian akhir jenjang. Hanya dapat diunduh oleh Dewan Guru dan Kepala Sekolah.",
      isRestricted: true,
      requiredRole: ['super_admin', 'admin_sekolah', 'guru']
    }
  ],
  messages: [
    {
      id: "msg-1",
      name: "Drs. H. Munawar",
      email: "munawar.wali@yahoo.com",
      phone: "08126912345",
      subject: "Apresiasi Kegiatan Pengajian Jumat dan Fasilitas Lab Komputer",
      message: "Terima kasih kepada Kepala Sekolah dan jajaran dewan guru SMAN 1 Julok. Program pembiasaan shalat Dhuha dan peningkatan fasilitas lab komputer sangat dirasakan manfaatnya oleh anak kami.",
      date: "2026-10-23",
      isRead: true,
      reply: "Terima kasih atas apresiasi dan dukungan Bapak. Sekolah berkomitmen terus meningkatkan kualitas layanan pendidikan."
    },
    {
      id: "msg-2",
      name: "Rahmat Hidayat (Alumni 2021)",
      email: "rahmat.alumni@gmail.com",
      phone: "085277889911",
      subject: "Legalitas Ijazah dan Reuni Akbar Alumni SMAN 1 Julok",
      message: "Assalamu'alaikum, saya ingin menanyakan jadwal legalisir ijazah untuk keperluan seleksi CPNS serta menyampaikan rencana pembentukan Ikatan Alumni SMAN 1 Julok lintas angkatan.",
      date: "2026-10-26",
      isRead: false
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Kapan jadwal Penerimaan Murid Baru (SPMB) dibuka di SMAN 1 Julok?",
      answer: "Pendaftaran SPMB biasanya diselenggarakan dalam dua gelombang pada rentang bulan Mei hingga Juli untuk tahun ajaran baru. Calon peserta didik dapat mendaftar daring melalui menu SPMB di website ini atau datang ke Sekretariat Panitia di Desa Buket Seuraja.",
      category: "SPMB"
    },
    {
      id: "faq-2",
      question: "Apa saja jalur penerimaan yang tersedia untuk calon peserta didik baru?",
      answer: "SMAN 1 Julok menerima siswa melalui 4 jalur: 1) Jalur Zonasi (bagi siswa yang berdomisili terdekat dengan sekolah), 2) Jalur Afirmasi (bagi siswa dari keluarga pemegang KIP/PKH), 3) Jalur Prestasi Akademik & Non-Akademik (MTQ, sains, seni, olahraga), serta 4) Jalur Perpindahan Tugas Orang Tua.",
      category: "SPMB"
    },
    {
      id: "faq-3",
      question: "Kurikulum apa yang diterapkan di SMA Negeri 1 Julok?",
      answer: "Sekolah menerapkan Kurikulum Merdeka secara menyeluruh, di mana siswa kelas X masuk ke Fase E (Fondasi Umum) dan kelas XI-XII masuk ke Fase F dengan pemilihan konsentrasi mata pelajaran peminatan (MIPA/Sains, IPS/Sosial Humaniora, dan Bahasa).",
      category: "Akademik"
    },
    {
      id: "faq-4",
      question: "Bagaimana cara mengakses E-Rapor dan sistem ujian CBT sekolah?",
      answer: "Siswa dan orang tua dapat mengakses tautan E-Rapor serta portal Ujian CBT melalui menu 'Layanan Digital' di website ini menggunakan akun resmi yang dibagikan oleh sekolah.",
      category: "Layanan Digital"
    },
    {
      id: "faq-5",
      question: "Apakah terdapat biaya SPP bulanan di SMA Negeri 1 Julok?",
      answer: "Sebagai sekolah negeri di bawah naungan Dinas Pendidikan Provinsi Aceh, operasional pendidikan dibiayai sepenuhnya melalui Bantuan Operasional Sekolah (BOS) Nasional dan BOS Aceh (BOSA), sehingga tidak dipungut SPP bulanan.",
      category: "Tata Tertib"
    },
    {
      id: "faq-6",
      question: "Apa saja kegiatan ekstrakurikuler unggulan yang dapat diikuti siswa?",
      answer: "Sekolah memiliki 14 jenis ekstrakurikuler aktif, antara lain Pramuka, Sanggar Seni Ratoh Duek / Seudati, Rohani Islam (Rohis), PMR Wira, Paskibra, Futsal & Bola Voli, Kelompok Ilmiah Remaja (KIR), dan English Debate Club.",
      category: "Fasilitas"
    }
  ],
  adminPasscode: "admin123",
  users: initialUsers,
  roles: initialRoles,
  articles: initialEditorialArticles,
  grades: initialStudentGrades,
  auditLogs: initialAuditLogs,
  resetRequests: [],
  isSuperAdminProvisioned: true,

  // A. Dynamic CMS Pages
  pages: [
    {
      id: "page-1",
      title: "Program Unggulan SMAN 1 Julok: Tahfidz, Sains & Budaya",
      slug: "program-unggulan",
      excerpt: "Empat pilar program unggulan sekolah untuk mencetak generasi cerdas, berkarakter Islami, dan berwawasan global di Aceh Timur.",
      content: `### 1. Program Tahfidz Al-Qur'an & Pembiasaan Karakter Islami
Sebagai bagian integral dari syariat Islam di Provinsi Aceh, SMA Negeri 1 Julok menyelenggarakan bimbingan tahsin dan tahfidz Al-Qur'an 30 Juz bagi seluruh peserta didik. Program ini dibina oleh ustadz dan ustadzah berkompetensi tinggi, dengan target minimal hafalan Juz 30 dan Juz 1 bagi setiap lulusan.

### 2. Kelas Intensif Riset & Olimpiade Sains Nasional (OSN)
Sekolah menyediakan pembinaan berkala bagi siswa berbakat di bidang Matematika, Fisika, Biologi, Kimia, Astronomi, dan Kebumian. Dilengkapi laboratorium sains modern dan akses jurnal ilmiah, siswa dilatih berfikir kritis dan menyelesaikan pemecahan masalah tingkat tinggi (HOTS).

### 3. Gerakan Literasi & Digitalisasi Pembelajaran
SMAN 1 Julok memfasilitasi setiap ruang kelas dengan sarana multimedia, perpustakaan digital terintegrasi (OPAC), serta asesmen berbasis komputer mandiri (CBT) untuk membiasakan siswa adaptif terhadap revolusi industri 4.0.

### 4. Pelestarian Seni Budaya Tradisional Aceh
Sanggar Seni SMAN 1 Julok secara konsisten membina generasi muda dalam kesenian khas Aceh seperti Tari Ratoh Duek, Seudati, Saman, serta seni kaligrafi Arab kontemporer.`,
      status: "published",
      author: "Drs. T. Muhammad Yusuf, M.Pd.",
      authorId: "usr-admin-sekolah",
      createdAt: "2026-08-15",
      updatedAt: "2026-10-20",
      publishedAt: "2026-08-20",
      menuPlacement: "both",
      viewCount: 1420,
      revisions: [
        {
          id: "rev-p1-1",
          contentId: "page-1",
          contentType: "page",
          timestamp: "2026-08-15 09:30 WIB",
          authorName: "Drs. T. Muhammad Yusuf, M.Pd.",
          authorId: "usr-admin-sekolah",
          title: "Program Unggulan SMAN 1 Julok",
          content: "Draf awal program unggulan.",
          summary: "Pembuatan draf awal dokumen program prioritas sekolah."
        }
      ]
    },
    {
      id: "page-2",
      title: "Informasi Beasiswa & Bantuan Pendidikan Siswa",
      slug: "beasiswa-dan-bantuan",
      excerpt: "Panduan pengajuan Program Indonesia Pintar (PIP), Beasiswa Prestasi Pemerintah Aceh, dan Bantuan Khusus Siswa Kurang Mampu.",
      content: `### Panduan Beasiswa SMA Negeri 1 Julok

Pemerintah melalui Kementerian Pendidikan Dasar dan Menengah serta Dinas Pendidikan Aceh menyediakan ragam bantuan finansial bagi peserta didik:

1. **Program Indonesia Pintar (PIP) Kemendikbudristek**
   - Diperuntukkan bagi siswa pemegang Kartu Indonesia Pintar (KIP) atau terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS).
   - Besaran bantuan: Rp 1.800.000,- / tahun ajaran.
   - Penyaluran langsung ke rekening SimPel Bank BSI (Bank Syariah Indonesia).

2. **Beasiswa Prestasi Anak Aceh (BPAA)**
   - Diberikan bagi siswa berprestasi Juara 1, 2, dan 3 di tingkat Kabupaten/Provinsi pada ajang OSN, O2SN, FLS2N, dan MTQ.
   - Fasilitas bebas biaya seragam dan dana pembinaan akademik.

3. **Bantuan Khusus Yatim & Dhuafa SMAN 1 Julok**
   - Didukung oleh Unit Pengumpul Zakat (UPZ) dan alumni SMAN 1 Julok untuk menjamin kelangsungan pendidikan siswa hingga tamat.`,
      status: "published",
      author: "Munirwan, S.Kom.",
      authorId: "usr-tu",
      createdAt: "2026-09-01",
      updatedAt: "2026-10-10",
      publishedAt: "2026-09-05",
      menuPlacement: "footer",
      viewCount: 890
    }
  ],

  // CMS Categories & Tags
  contentCategories: [
    { id: "cat-1", name: "Akademik", slug: "akademik", description: "Informasi pembelajaran, kurikulum, dan asesmen", postCount: 8 },
    { id: "cat-2", name: "Prestasi", slug: "prestasi", description: "Pencapaian kejuaraan siswa, guru, dan sekolah", postCount: 12 },
    { id: "cat-3", name: "Kegiatan", slug: "kegiatan", description: "Dokumentasi agenda, upacara, dan aktivitas siswa", postCount: 15 },
    { id: "cat-4", name: "Pengumuman", slug: "pengumuman", description: "Pemberitahuan resmi kedinasan dan kalender sekolah", postCount: 10 },
    { id: "cat-5", name: "Artikel Siswa", slug: "artikel-siswa", description: "Karya tulis, opini, dan esai karya warga sekolah", postCount: 6 },
    { id: "cat-6", name: "Budaya & Agama", slug: "budaya-agama", description: "Kajian keislaman dan pelestarian adat Aceh", postCount: 7 }
  ],

  contentTags: [
    { id: "tag-1", name: "Kurikulum Merdeka", slug: "kurikulum-merdeka" },
    { id: "tag-2", name: "OSN", slug: "osn" },
    { id: "tag-3", name: "P5", slug: "p5" },
    { id: "tag-4", name: "Aceh Timur", slug: "aceh-timur" },
    { id: "tag-5", name: "Buket Seuraja", slug: "buket-seuraja" },
    { id: "tag-6", name: "Pramuka", slug: "pramuka" },
    { id: "tag-7", name: "Beasiswa", slug: "beasiswa" },
    { id: "tag-8", name: "CBT Online", slug: "cbt-online" }
  ],

  revisions: [
    {
      id: "rev-1",
      contentId: "art-1",
      contentType: "article",
      timestamp: "2026-10-28 14:20 WIB",
      authorName: "Ahmad Fauzi, S.Pd.",
      authorId: "usr-editor",
      title: "Peringatan Hari Pahlawan 2026 di Lapangan SMAN 1 Julok",
      content: "Naskah awal liputan hari pahlawan di Buket Seuraja.",
      summary: "Pembaruan teks lead dan penambahan dokumentasi foto paduan suara."
    }
  ],

  media: [
    {
      id: "med-1",
      title: "Foto Kampus Depan SMAN 1 Julok",
      url: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
      fileType: "image",
      fileSize: "1.2 MB",
      uploadedAt: "2026-10-01",
      uploadedBy: "Super Admin",
      dimensions: "1920x1080"
    },
    {
      id: "med-2",
      title: "Gedung Laboratorium Komputer & Sains",
      url: "/src/assets/images/lab_sman1julok_1793290496393.jpg",
      fileType: "image",
      fileSize: "1.8 MB",
      uploadedAt: "2026-10-02",
      uploadedBy: "Operator TU",
      dimensions: "1920x1080"
    },
    {
      id: "med-3",
      title: "Logo Resmi SMAN 1 Julok Aceh Timur",
      url: "/src/assets/images/logo_sman1julok_1793290497184.png",
      fileType: "image",
      fileSize: "340 KB",
      uploadedAt: "2026-09-15",
      uploadedBy: "Super Admin",
      dimensions: "512x512"
    }
  ],

  // B. Academic Lesson Schedules (Senin - Jumat)
  schedules: [
    { id: "sch-1", className: "X-1", grade: "X", day: "Senin", period: 1, time: "07.45 - 09.05", subjectName: "Pendidikan Agama Islam & Budi Pekerti", teacherName: "Drs. Teuku Mukhtar", room: "Ruang X-1" },
    { id: "sch-2", className: "X-1", grade: "X", day: "Senin", period: 2, time: "09.20 - 10.40", subjectName: "Bahasa Indonesia", teacherName: "Cut Rahmah, S.Pd.", room: "Ruang X-1" },
    { id: "sch-3", className: "X-1", grade: "X", day: "Senin", period: 3, time: "10.40 - 12.00", subjectName: "Matematika Umum", teacherName: "Zulkifli, S.Pd., M.Si.", room: "Ruang X-1" },
    { id: "sch-4", className: "X-1", grade: "X", day: "Selasa", period: 1, time: "07.45 - 09.05", subjectName: "Biologi (IPA Terpadu)", teacherName: "Nurul Hidayati, S.Pd., M.Si.", room: "Lab Biologi" },
    { id: "sch-5", className: "X-1", grade: "X", day: "Selasa", period: 2, time: "09.20 - 10.40", subjectName: "Fisika (IPA Terpadu)", teacherName: "M. Nasir, S.Pd.", room: "Lab Fisika" },
    { id: "sch-6", className: "X-1", grade: "X", day: "Rabu", period: 1, time: "07.45 - 09.05", subjectName: "Bahasa Inggris", teacherName: "Siti Sarah, S.Pd.", room: "Ruang X-1" },
    { id: "sch-7", className: "X-1", grade: "X", day: "Rabu", period: 2, time: "09.20 - 10.40", subjectName: "Sejarah Indonesia & Kebudayaan Aceh", teacherName: "Iskandar Muda, S.Pd.", room: "Ruang X-1" },
    { id: "sch-8", className: "X-1", grade: "X", day: "Kamis", period: 1, time: "07.45 - 09.45", subjectName: "Informatika & Literasi Digital", teacherName: "Munirwan, S.Kom.", room: "Lab Komputer 1" },
    { id: "sch-9", className: "X-1", grade: "X", day: "Jumat", period: 1, time: "07.30 - 08.45", subjectName: "Yasinan & Muhadharah Bersama", teacherName: "Dewan Guru", room: "Masjid Sekolah" },
    { id: "sch-10", className: "X-1", grade: "X", day: "Jumat", period: 2, time: "09.00 - 10.15", subjectName: "Projek Penguatan Profil Pelajar Pancasila (P5)", teacherName: "Tim Fasilitator P5", room: "Aula Kampus" },

    { id: "sch-11", className: "XI MIPA 1", grade: "XI", day: "Senin", period: 1, time: "07.45 - 09.45", subjectName: "Biologi Tingkat Lanjut", teacherName: "Nurul Hidayati, S.Pd., M.Si.", room: "Lab Biologi" },
    { id: "sch-12", className: "XI MIPA 1", grade: "XI", day: "Senin", period: 2, time: "10.00 - 12.00", subjectName: "Matematika Tingkat Lanjut", teacherName: "Zulkifli, S.Pd., M.Si.", room: "Ruang XI-M1" },
    { id: "sch-13", className: "XI MIPA 1", grade: "XI", day: "Selasa", period: 1, time: "07.45 - 09.45", subjectName: "Kimia", teacherName: "Dewi Suryani, S.Pd.", room: "Lab Kimia" }
  ],

  learningMaterials: [
    {
      id: "mat-1",
      title: "Modul Ajar Biologi: Struktur Sel & Metabolisme Enzim (Fase F)",
      subject: "Biologi",
      gradeLevel: "XI",
      topic: "Fisiologi Seluler & Biokimia",
      authorTeacher: "Nurul Hidayati, S.Pd., M.Si.",
      fileType: "PDF",
      fileSize: "3.4 MB",
      downloadUrl: "#",
      uploadedDate: "2026-10-05",
      isRestricted: false
    },
    {
      id: "mat-2",
      title: "Bahan Ajar Matematika: Fungsi Trigonometri & Limit Aljabar (Fase E)",
      subject: "Matematika",
      gradeLevel: "X",
      topic: "Trigonometri Dasar",
      authorTeacher: "Zulkifli, S.Pd., M.Si.",
      fileType: "PDF",
      fileSize: "2.8 MB",
      downloadUrl: "#",
      uploadedDate: "2026-09-28",
      isRestricted: false
    },
    {
      id: "mat-3",
      title: "Panduan Riset Karya Tulis Ilmiah Remaja (KIR) SMAN 1 Julok",
      subject: "Informatika & Riset",
      gradeLevel: "XI",
      topic: "Metodologi Penelitian Sains",
      authorTeacher: "Munirwan, S.Kom.",
      fileType: "PDF",
      fileSize: "4.1 MB",
      downloadUrl: "#",
      uploadedDate: "2026-10-12",
      isRestricted: false
    },
    {
      id: "mat-4",
      title: "Naskah Soal Uji Coba Asesmen Sumatif Akhir Semester (Khusus Guru)",
      subject: "Fisika",
      gradeLevel: "XII",
      topic: "Gelombang Elektromagnetik",
      authorTeacher: "M. Nasir, S.Pd.",
      fileType: "PDF",
      fileSize: "1.9 MB",
      downloadUrl: "#",
      uploadedDate: "2026-10-22",
      isRestricted: true
    }
  ],

  externalApps: [
    {
      id: "app-cbt",
      name: "Portal Ujian CBT SMAN 1 Julok",
      category: "CBT / Ujian",
      url: "https://cbt.sman1julok.sch.id",
      description: "Aplikasi Computer Based Test resmi untuk Penilaian Sumatif, Gladi ANBK, dan Ujian Sekolah mandiri.",
      status: "Online",
      icon: "Monitor",
      isProtected: true
    },
    {
      id: "app-lms",
      name: "Google Classroom Madrasah & Sekolah",
      category: "LMS & E-Learning",
      url: "https://classroom.google.com",
      description: "Pengumpulan tugas daring, diskusi kelas interaktif, dan integrasi modul digital para guru.",
      status: "Online",
      icon: "BookOpen",
      isProtected: false
    },
    {
      id: "app-erapor",
      name: "E-Rapor Kurikulum Merdeka Kemendikbud",
      category: "E-Rapor Kurikulum Merdeka",
      url: "https://erapor.kemdikbud.go.id",
      description: "Pusat penginputan capaian kompetensi dan pencetakan buku rapor digital siswa ber-NPSN 10101890.",
      status: "Online",
      icon: "Award",
      isProtected: true
    },
    {
      id: "app-dapodik",
      name: "Dapodikdasmen Manajemen Sekolah",
      category: "Dapodik Kemendikbud",
      url: "https://dapo.kemdikbud.go.id",
      description: "Sinkronisasi data pokok pendidik, tenaga kependidikan, sarpras, dan rombongan belajar.",
      status: "Terkonfigurasi",
      icon: "Database",
      isProtected: true
    },
    {
      id: "app-opac",
      name: "Perpustakaan Digital 'Cut Nyak Dien'",
      category: "Perpustakaan Digital",
      url: "https://perpustakaan.sman1julok.sch.id",
      description: "Katalog online (OPAC), peminjaman buku elektronik, dan jurnal referensi siswa.",
      status: "Online",
      icon: "Library",
      isProtected: false
    }
  ],

  // D. SPMB Settings & Quotas
  spmbSettings: {
    isOpen: true,
    academicYear: "2026/2027",
    startDate: "2026-05-01",
    endDate: "2026-07-05",
    announcementDate: "2026-07-10",
    reRegistrationDate: "2026-07-12 s.d 2026-07-16",
    quotas: {
      zonasi: 120,
      prestasi: 36,
      afirmasi: 30,
      perpindahan: 10,
      total: 196
    },
    contactPerson: "Drs. Teuku Mukhtar (Ketua Panitia SPMB)",
    hotlinePhone: "+6281269001122",
    procedurePdfUrl: "#"
  },

  // E. School Poll
  polls: [
    {
      id: "poll-1",
      title: "Survei Pilihan Tema Gelar Karya P5 Semester Genap 2026",
      description: "Partisipasi seluruh warga sekolah untuk memilih tema utama pameran karya Projek Penguatan Profil Pelajar Pancasila di SMAN 1 Julok.",
      question: "Manakah tema P5 yang paling ingin Anda eksplorasi pada pameran semester genap tahun ini?",
      options: [
        { id: "opt-1", text: "Rekayasa & Teknologi Tepat Guna Pesisir Aceh", votes: 142 },
        { id: "opt-2", text: "Kewirausahaan Olahan Pangan Lokal & Herbal Aceh Timur", votes: 189 },
        { id: "opt-3", text: "Suara Demokrasi & Kepemimpinan Pelajar Pancasila", votes: 94 },
        { id: "opt-4", text: "Gaya Hidup Berkelanjutan: Bank Sampah & Energi Hijau", votes: 121 }
      ],
      totalVotes: 546,
      expiresAt: "2026-11-30",
      isActive: true,
      userVotedIds: []
    }
  ],

  // G. In-App Notifications
  notifications: [
    {
      id: "notif-1",
      title: "Draf Artikel Baru Memerlukan Persetujuan",
      message: "Editor telah mengajukan artikel 'Kunjungan Edukasi Geologi dan Sejarah Aceh' untuk ditinjau oleh Kepala Sekolah.",
      type: "approval_required",
      date: "2026-10-28 15:30",
      isRead: false,
      link: "dashboard",
      targetRole: "admin_sekolah"
    },
    {
      id: "notif-2",
      title: "Pendaftaran SPMB Baru Diterima",
      message: "Calon siswa atas nama 'Muhammad Farhan' (NISN: 0081293819) telah mengirimkan berkas pendaftaran online.",
      type: "spmb_new",
      date: "2026-10-28 11:15",
      isRead: false,
      link: "dashboard",
      targetRole: "operator_tu"
    },
    {
      id: "notif-3",
      title: "Jadwal Asesmen Bakat Minat (ABM) 2026",
      message: "Pengumuman jadwal resmi pelaksanaan simulasi ABM kelas XII telah diterbitkan di portal pengumuman.",
      type: "urgent_announcement",
      date: "2026-10-27 08:00",
      isRead: true,
      link: "pengumuman",
      targetRole: "all"
    }
  ],

  // H. System & SEO Settings
  seoSettings: {
    metaTitle: "SMA Negeri 1 Julok - Buket Seuraja, Aceh Timur",
    metaDescription: "Website Resmi SMA Negeri 1 Julok, Desa Buket Seuraja, Kec. Julok, Kab. Aceh Timur, Aceh. Portal akademik, SPMB, profil sekolah, dan layanan digital.",
    keywords: "SMA Negeri 1 Julok, SMAN 1 Julok, Buket Seuraja, Sekolah Aceh Timur, SPMB SMAN 1 Julok, Kurikulum Merdeka Julok, Sekolah Unggulan Aceh",
    ogImageUrl: "/src/assets/images/hero_sman1julok_1793290495969.jpg",
    sitemapUrl: "https://sman1julok.sch.id/sitemap.xml",
    googleAnalyticsId: "G-JULOK2026SCH",
    searchConsoleCode: "google-site-verification=julok-secure-2026-aceh"
  },

  integrationSettings: {
    dapodikUrl: "https://dapo.kemdikbud.go.id",
    dapodikStatus: "Tersinkronisasi",
    cbtExamUrl: "https://cbt.sman1julok.sch.id",
    googleClassroomUrl: "https://classroom.google.com",
    eraporUrl: "https://erapor.kemdikbud.go.id",
    smtpConfigured: false,
    smtpHost: "smtp.mailgun.org",
    smtpPort: 587,
    smtpUser: "postmaster@sman1julok.sch.id"
  }
};
