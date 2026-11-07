/**
 * SMA NEGERI 1 JULOK - DATABASE SCHEMA SPECIFICATION & NORMALIZATION
 * Location: Desa Buket Seuraja, Kecamatan Julok, Kabupaten Aceh Timur, Aceh
 * 
 * Normalized Database Architecture (3NF Compliant):
 * - Separate entities for Users, Roles, Permissions, UserRoles, RolePermissions
 * - Separate entities for Posts, PostCategories, PostTags, PostRevisions
 * - Separate entities for Admissions & AdmissionDocuments (SPMB)
 * - Strict Foreign Keys, Indexes, Unique Constraints & Referential Actions
 * - Comprehensive Protection of Student PII (Strict Anonymized Demo Data)
 */

export interface DDLColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
    onDelete: 'CASCADE' | 'RESTRICT' | 'SET NULL';
  };
  checkConstraint?: string;
  description: string;
}

export interface DDLTable {
  name: string;
  description: string;
  columns: DDLColumn[];
  indexes: Array<{
    name: string;
    columns: string[];
    unique?: boolean;
  }>;
}

/**
 * 22 Relational DDL Table Specifications
 */
export const RELATIONAL_SCHEMA_DDL: DDLTable[] = [
  // 1. users
  {
    name: 'users',
    description: 'Tabel akun pengguna terdaftar dengan hashing kredensial dan status keamanan',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID unik pengguna (UUID/string)' },
      { name: 'username', type: 'VARCHAR(64)', nullable: false, isUnique: true, description: 'Nama pengguna unik untuk login' },
      { name: 'email', type: 'VARCHAR(128)', nullable: false, isUnique: true, description: 'Alamat surel unik' },
      { name: 'full_name', type: 'VARCHAR(128)', nullable: false, description: 'Nama lengkap resmi' },
      { name: 'password_hash', type: 'CHAR(64)', nullable: false, description: 'Hash SHA-256 password tersalt' },
      { name: 'salt', type: 'VARCHAR(32)', nullable: false, description: 'Garam kriptografis unik per akun' },
      { name: 'avatar_url', type: 'TEXT', nullable: true, description: 'Tautan avatar foto profil' },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true, description: 'Nomor telepon aktif' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultValue: 'TRUE', description: 'Status aktivasi akun' },
      { name: 'is_locked', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Kunci otomatis akibat proteksi brute force' },
      { name: 'failed_login_attempts', type: 'INT', nullable: false, defaultValue: '0', description: 'Jumlah percobaan gagal berturut-turut' },
      { name: 'lock_until', type: 'TIMESTAMP', nullable: true, description: 'Waktu batas akun terkunci' },
      { name: 'last_login', type: 'TIMESTAMP', nullable: true, description: 'Catatan waktu login terakhir' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pendaftaran' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pembaharuan' }
    ],
    indexes: [
      { name: 'idx_users_username', columns: ['username'], unique: true },
      { name: 'idx_users_email', columns: ['email'], unique: true },
      { name: 'idx_users_active', columns: ['is_active'] }
    ]
  },

  // 2. roles
  {
    name: 'roles',
    description: 'Tabel definisi role hak akses dalam sistem RBAC',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID unik role' },
      { name: 'name', type: 'VARCHAR(64)', nullable: false, isUnique: true, description: 'Identifier role (super_admin, admin_sekolah, editor, dll)' },
      { name: 'label', type: 'VARCHAR(128)', nullable: false, description: 'Nama tampilan peran' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi wewenang peran' },
      { name: 'is_system_role', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Penanda role bawaan sistem yang tidak boleh dihapus' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan role' }
    ],
    indexes: [
      { name: 'idx_roles_name', columns: ['name'], unique: true }
    ]
  },

  // 3. permissions
  {
    name: 'permissions',
    description: 'Tabel katalog izin granular aplikasi',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID unik izin' },
      { name: 'key', type: 'VARCHAR(64)', nullable: false, isUnique: true, description: 'Kunci wewenang teknis (e.g. content.approve)' },
      { name: 'label', type: 'VARCHAR(128)', nullable: false, description: 'Nama label wewenang' },
      { name: 'category', type: 'VARCHAR(64)', nullable: false, description: 'Kelompok modul wewenang' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi cakupan izin' }
    ],
    indexes: [
      { name: 'idx_permissions_key', columns: ['key'], unique: true },
      { name: 'idx_permissions_category', columns: ['category'] }
    ]
  },

  // 4. user_roles (Many-to-Many junction)
  {
    name: 'user_roles',
    description: 'Tabel relasi many-to-many pengguna dan peran (User - Role)',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID penugasan peran' },
      { name: 'user_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'users', column: 'id', onDelete: 'CASCADE' }, description: 'FK ke users' },
      { name: 'role_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'roles', column: 'id', onDelete: 'RESTRICT' }, description: 'FK ke roles' },
      { name: 'assigned_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu penugasan' },
      { name: 'assigned_by', type: 'VARCHAR(64)', nullable: true, description: 'ID admin yang memberikan peran' }
    ],
    indexes: [
      { name: 'idx_user_roles_unique', columns: ['user_id', 'role_id'], unique: true },
      { name: 'idx_user_roles_role_id', columns: ['role_id'] }
    ]
  },

  // 5. role_permissions (Many-to-Many junction)
  {
    name: 'role_permissions',
    description: 'Tabel relasi many-to-many peran dan izin granular (Role - Permission)',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID relasi' },
      { name: 'role_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'roles', column: 'id', onDelete: 'CASCADE' }, description: 'FK ke roles' },
      { name: 'permission_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'permissions', column: 'id', onDelete: 'CASCADE' }, description: 'FK ke permissions' }
    ],
    indexes: [
      { name: 'idx_role_permissions_unique', columns: ['role_id', 'permission_id'], unique: true },
      { name: 'idx_role_permissions_perm', columns: ['permission_id'] }
    ]
  },

  // 6. school_settings
  {
    name: 'school_settings',
    description: 'Tabel pengaturan institusi dan identitas SMAN 1 Julok',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID baris konfigurasi' },
      { name: 'name', type: 'VARCHAR(200)', nullable: false, description: 'Nama resmi sekolah' },
      { name: 'short_name', type: 'VARCHAR(64)', nullable: false, description: 'Nama singkat' },
      { name: 'npsn', type: 'VARCHAR(16)', nullable: false, isUnique: true, description: 'Nomor Pokok Sekolah Nasional' },
      { name: 'accreditation', type: 'VARCHAR(16)', nullable: false, description: 'Peringkat akreditasi (A)' },
      { name: 'curriculum', type: 'VARCHAR(64)', nullable: false, description: 'Kurikulum aktif (Kurikulum Merdeka)' },
      { name: 'principal_name', type: 'VARCHAR(128)', nullable: false, description: 'Nama Kepala Sekolah' },
      { name: 'principal_nip', type: 'VARCHAR(32)', nullable: false, description: 'NIP Kepala Sekolah' },
      { name: 'principal_photo', type: 'TEXT', nullable: true, description: 'Foto pimpinan' },
      { name: 'address', type: 'VARCHAR(255)', nullable: false, description: 'Alamat jalan/lokasi' },
      { name: 'village', type: 'VARCHAR(100)', nullable: false, description: 'Desa (Buket Seuraja)' },
      { name: 'district', type: 'VARCHAR(100)', nullable: false, description: 'Kecamatan (Julok)' },
      { name: 'regency', type: 'VARCHAR(100)', nullable: false, description: 'Kabupaten (Aceh Timur)' },
      { name: 'province', type: 'VARCHAR(100)', nullable: false, description: 'Provinsi (Aceh)' },
      { name: 'postal_code', type: 'VARCHAR(16)', nullable: false, description: 'Kode pos' },
      { name: 'phone', type: 'VARCHAR(32)', nullable: false, description: 'Telepon kantor' },
      { name: 'email', type: 'VARCHAR(128)', nullable: false, description: 'Email resmi sekolah' },
      { name: 'logo_url', type: 'TEXT', nullable: true, description: 'URL logo sekolah' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu perbaruan terakhir' }
    ],
    indexes: [
      { name: 'idx_school_settings_npsn', columns: ['npsn'], unique: true }
    ]
  },

  // 7. pages
  {
    name: 'pages',
    description: 'Tabel halaman statis dan dinamis website sekolah',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID halaman' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Judul halaman' },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, isUnique: true, description: 'Slug URL unik' },
      { name: 'excerpt', type: 'TEXT', nullable: true, description: 'Ringkasan isi' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Konten lengkap HTML/Markdown' },
      { name: 'status', type: 'VARCHAR(32)', nullable: false, checkConstraint: "status IN ('draft', 'published')", description: 'Status draf/publikasi' },
      { name: 'author_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'users', column: 'id', onDelete: 'RESTRICT' }, description: 'FK ke users' },
      { name: 'menu_placement', type: 'VARCHAR(32)', nullable: false, defaultValue: "'both'", description: 'Penempatan navbar/footer' },
      { name: 'view_count', type: 'INT', nullable: false, defaultValue: '0', description: 'Total penayangan' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu dibuat' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu diubah' }
    ],
    indexes: [
      { name: 'idx_pages_slug', columns: ['slug'], unique: true },
      { name: 'idx_pages_status', columns: ['status'] }
    ]
  },

  // 8. post_categories
  {
    name: 'post_categories',
    description: 'Tabel kategori taksonomi untuk berita dan artikel',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID kategori' },
      { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Nama kategori' },
      { name: 'slug', type: 'VARCHAR(100)', nullable: false, isUnique: true, description: 'Slug unik' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Keterangan kategori' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' }
    ],
    indexes: [
      { name: 'idx_post_categories_slug', columns: ['slug'], unique: true }
    ]
  },

  // 9. posts
  {
    name: 'posts',
    description: 'Tabel berita dan artikel dengan workflow publikasi bertingkat',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID artikel' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Judul berita' },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, isUnique: true, description: 'Slug unik' },
      { name: 'excerpt', type: 'TEXT', nullable: true, description: 'Ringkasan singkat' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Konten berita lengkap' },
      { name: 'category_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'post_categories', column: 'id', onDelete: 'RESTRICT' }, description: 'FK ke post_categories' },
      { name: 'author_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'users', column: 'id', onDelete: 'RESTRICT' }, description: 'FK ke users pembuat' },
      { name: 'status', type: 'VARCHAR(32)', nullable: false, checkConstraint: "status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'published', 'archived', 'rejected')", description: 'Status alur editorial' },
      { name: 'image_url', type: 'TEXT', nullable: true, description: 'Gambar utama' },
      { name: 'reviewer_id', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke users pereview' },
      { name: 'views', type: 'INT', nullable: false, defaultValue: '0', description: 'Jumlah dibaca' },
      { name: 'published_at', type: 'TIMESTAMP', nullable: true, description: 'Waktu publikasi resmi' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu dibuat' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu diubah' }
    ],
    indexes: [
      { name: 'idx_posts_slug', columns: ['slug'], unique: true },
      { name: 'idx_posts_status', columns: ['status'] },
      { name: 'idx_posts_category', columns: ['category_id'] },
      { name: 'idx_posts_author', columns: ['author_id'] },
      { name: 'idx_posts_published', columns: ['status', 'published_at'] }
    ]
  },

  // 10. post_tags
  {
    name: 'post_tags',
    description: 'Tabel relasi label/tag kata kunci artikel',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID tag' },
      { name: 'post_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'posts', column: 'id', onDelete: 'CASCADE' }, description: 'FK ke posts' },
      { name: 'tag', type: 'VARCHAR(64)', nullable: false, description: 'Nama label kata kunci' }
    ],
    indexes: [
      { name: 'idx_post_tags_post', columns: ['post_id'] },
      { name: 'idx_post_tags_tag', columns: ['tag'] }
    ]
  },

  // 11. post_revisions
  {
    name: 'post_revisions',
    description: 'Tabel riwayat revisi dan pemulihan versi konten artikel',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID revisi' },
      { name: 'post_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'posts', column: 'id', onDelete: 'CASCADE' }, description: 'FK ke posts' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Judul pada versi ini' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Snapshot konten versi ini' },
      { name: 'summary', type: 'TEXT', nullable: true, description: 'Catatan ringkasan revisi' },
      { name: 'author_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'users', column: 'id', onDelete: 'RESTRICT' }, description: 'FK ke users penyunting' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu versi disimpan' }
    ],
    indexes: [
      { name: 'idx_post_revisions_post', columns: ['post_id'] },
      { name: 'idx_post_revisions_created', columns: ['created_at'] }
    ]
  },

  // 12. announcements
  {
    name: 'announcements',
    description: 'Tabel siaran pengumuman resmi sekolah',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID pengumuman' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Judul pengumuman' },
      { name: 'content', type: 'TEXT', nullable: false, description: 'Isi lengkap pengumuman' },
      { name: 'target_audience', type: 'VARCHAR(64)', nullable: false, defaultValue: "'Semua'", description: 'Sasaran (Semua, Siswa, Guru, Ortu, SPMB)' },
      { name: 'is_urgent', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Penanda pengumuman penting/mendesak' },
      { name: 'download_url', type: 'TEXT', nullable: true, description: 'Tautan lampiran surat dinas' },
      { name: 'attachment_name', type: 'VARCHAR(255)', nullable: true, description: 'Nama berkas lampiran' },
      { name: 'author_id', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke users' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Tanggal pengumuman' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu dibuat' }
    ],
    indexes: [
      { name: 'idx_announcements_urgent', columns: ['is_urgent'] },
      { name: 'idx_announcements_date', columns: ['date'] }
    ]
  },

  // 13. events
  {
    name: 'events',
    description: 'Tabel agenda kegiatan sekolah dan kalender akademik',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID agenda' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Judul agenda' },
      { name: 'category', type: 'VARCHAR(64)', nullable: false, description: 'Kategori agenda (Akademik, Ujian, Libur, dll)' },
      { name: 'date', type: 'DATE', nullable: false, description: 'Tanggal mulai' },
      { name: 'end_date', type: 'DATE', nullable: true, description: 'Tanggal selesai' },
      { name: 'time', type: 'VARCHAR(64)', nullable: false, description: 'Waktu kegiatan' },
      { name: 'location', type: 'VARCHAR(255)', nullable: false, description: 'Tempat penyelenggaraan' },
      { name: 'organizer', type: 'VARCHAR(128)', nullable: false, description: 'Panitia/penyelenggara' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Uraian kegiatan' },
      { name: 'author_id', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke users' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu dicatat' }
    ],
    indexes: [
      { name: 'idx_events_date', columns: ['date'] },
      { name: 'idx_events_category', columns: ['category'] }
    ]
  },

  // 14. media
  {
    name: 'media',
    description: 'Tabel repositori berkas dan media terunggah dengan validasi MIME & kuota',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID berkas' },
      { name: 'filename', type: 'VARCHAR(255)', nullable: false, isUnique: true, description: 'Nama berkas fisik tersimpan' },
      { name: 'original_name', type: 'VARCHAR(255)', nullable: false, description: 'Nama berkas asli' },
      { name: 'mime_type', type: 'VARCHAR(100)', nullable: false, description: 'Tipe MIME yang tervalidasi' },
      { name: 'file_size', type: 'INT', nullable: false, description: 'Ukuran dalam byte (maks 5MB)' },
      { name: 'url', type: 'TEXT', nullable: false, description: 'Tautan akses berkas' },
      { name: 'uploaded_by', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke users pengunggah' },
      { name: 'uploaded_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu unggah' }
    ],
    indexes: [
      { name: 'idx_media_mime', columns: ['mime_type'] },
      { name: 'idx_media_uploaded_at', columns: ['uploaded_at'] }
    ]
  },

  // 15. teachers
  {
    name: 'teachers',
    description: 'Tabel direktori data pendidik dan tenaga kependidikan (Dapodik)',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID guru' },
      { name: 'user_id', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK opsional ke users jika memiliki login' },
      { name: 'nip', type: 'VARCHAR(32)', nullable: false, isUnique: true, description: 'NIP / NUPTK resmi' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, description: 'Nama guru dan gelar akademik' },
      { name: 'role', type: 'VARCHAR(128)', nullable: false, description: 'Jabatan / penugasan' },
      { name: 'subject', type: 'VARCHAR(128)', nullable: true, description: 'Mata pelajaran yang diampu' },
      { name: 'education', type: 'VARCHAR(128)', nullable: false, description: 'Kualifikasi pendidikan terakhir' },
      { name: 'photo_url', type: 'TEXT', nullable: true, description: 'Foto profil' },
      { name: 'category', type: 'VARCHAR(32)', nullable: false, checkConstraint: "category IN ('guru', 'tendik')", description: 'Kelompok guru atau tendik' },
      { name: 'is_leader', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Penanda jajaran pimpinan' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu ditambahkan' }
    ],
    indexes: [
      { name: 'idx_teachers_nip', columns: ['nip'], unique: true },
      { name: 'idx_teachers_category', columns: ['category'] }
    ]
  },

  // 16. students [ANONYMIZED DEMO DATA ONLY]
  {
    name: 'students',
    description: 'Tabel direktori siswa dengan proteksi privasi ketat [DATA DEMO DUMMY]',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID siswa' },
      { name: 'user_id', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK opsional ke users' },
      { name: 'nisn', type: 'VARCHAR(16)', nullable: false, isUnique: true, description: 'NISN unik (dummy/fiktif)' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, description: 'Nama siswa fiktif' },
      { name: 'class_name', type: 'VARCHAR(64)', nullable: false, description: 'Rombongan belajar aktif' },
      { name: 'major', type: 'VARCHAR(64)', nullable: false, description: 'Fase / Peminatan kurikulum' },
      { name: 'gender', type: 'VARCHAR(16)', nullable: false, checkConstraint: "gender IN ('Laki-laki', 'Perempuan')", description: 'Jenis kelamin' },
      { name: 'status', type: 'VARCHAR(32)', nullable: false, defaultValue: "'Aktif'", description: 'Status kesiswaan' },
      { name: 'parent_name', type: 'VARCHAR(128)', nullable: false, description: 'Nama wali/ortu (fiktif)' },
      { name: 'parent_phone', type: 'VARCHAR(32)', nullable: false, description: 'Kontak wali (fiktif)' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu registrasi' }
    ],
    indexes: [
      { name: 'idx_students_nisn', columns: ['nisn'], unique: true },
      { name: 'idx_students_class', columns: ['class_name'] }
    ]
  },

  // 17. documents
  {
    name: 'documents',
    description: 'Tabel pusat dokumen dan unduhan publik maupun internal berizin',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID dokumen' },
      { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Judul dokumen' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Kategori unduhan' },
      { name: 'file_size', type: 'VARCHAR(32)', nullable: false, description: 'Ukuran berkas terformat' },
      { name: 'file_type', type: 'VARCHAR(32)', nullable: false, description: 'Ekstensi berkas (PDF, DOCX, dll)' },
      { name: 'download_url', type: 'TEXT', nullable: false, description: 'Tautan unduh berkas' },
      { name: 'download_count', type: 'INT', nullable: false, defaultValue: '0', description: 'Statistik unduh' },
      { name: 'is_restricted', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Hanya dapat diunduh role tertentu' },
      { name: 'required_role', type: 'TEXT', nullable: true, description: 'Role yang diizinkan (JSON array)' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Keterangan isi dokumen' },
      { name: 'uploaded_by', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke users' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu publikasi' }
    ],
    indexes: [
      { name: 'idx_documents_category', columns: ['category'] },
      { name: 'idx_documents_restricted', columns: ['is_restricted'] }
    ]
  },

  // 18. contact_messages
  {
    name: 'contact_messages',
    description: 'Tabel pesan masuk formulir kontak publik portal sekolah',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID pesan' },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, description: 'Nama pengirim' },
      { name: 'email', type: 'VARCHAR(128)', nullable: false, description: 'Email pengirim' },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true, description: 'Telepon pengirim' },
      { name: 'subject', type: 'VARCHAR(255)', nullable: false, description: 'Subjek pesan' },
      { name: 'message', type: 'TEXT', nullable: false, description: 'Isi lengkap pesan' },
      { name: 'is_read', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Status dibaca oleh operator' },
      { name: 'reply', type: 'TEXT', nullable: true, description: 'Tanggapan resmi sekolah' },
      { name: 'replied_by', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke users penjawab' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu pengiriman' }
    ],
    indexes: [
      { name: 'idx_contact_messages_read', columns: ['is_read'] },
      { name: 'idx_contact_messages_created', columns: ['created_at'] }
    ]
  },

  // 19. admissions (SPMB)
  {
    name: 'admissions',
    description: 'Tabel pendaftaran calon siswa baru SPMB online',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID registrasi' },
      { name: 'registration_number', type: 'VARCHAR(64)', nullable: false, isUnique: true, description: 'Nomor pendaftaran resmi (SPMB-2026-XXXX)' },
      { name: 'full_name', type: 'VARCHAR(128)', nullable: false, description: 'Nama calon siswa' },
      { name: 'nisn', type: 'VARCHAR(16)', nullable: false, description: 'NISN dari SMP asal' },
      { name: 'nik', type: 'VARCHAR(20)', nullable: false, description: 'NIK calon siswa' },
      { name: 'birth_place', type: 'VARCHAR(100)', nullable: false, description: 'Tempat lahir' },
      { name: 'birth_date', type: 'DATE', nullable: false, description: 'Tanggal lahir' },
      { name: 'gender', type: 'VARCHAR(16)', nullable: false, checkConstraint: "gender IN ('Laki-laki', 'Perempuan')", description: 'Jenis kelamin' },
      { name: 'origin_school', type: 'VARCHAR(128)', nullable: false, description: 'Sekolah asal (SMP/MTs)' },
      { name: 'parent_name', type: 'VARCHAR(128)', nullable: false, description: 'Nama orang tua/wali' },
      { name: 'parent_phone', type: 'VARCHAR(32)', nullable: false, description: 'Nomor telepon/WA aktif' },
      { name: 'email', type: 'VARCHAR(128)', nullable: false, description: 'Surel calon siswa' },
      { name: 'chosen_pathway', type: 'VARCHAR(64)', nullable: false, checkConstraint: "chosen_pathway IN ('Zonasi', 'Prestasi Akademik', 'Afirmasi', 'Perpindahan Tugas Orang Tua')", description: 'Jalur pendaftaran' },
      { name: 'average_score', type: 'DECIMAL(5,2)', nullable: false, description: 'Rerata nilai rapor SMP' },
      { name: 'status', type: 'VARCHAR(64)', nullable: false, checkConstraint: "status IN ('Menunggu Verifikasi', 'Berkas Diterima', 'Lulus Seleksi', 'Cadangan', 'Tidak Lulus')", description: 'Status verifikasi' },
      { name: 'submission_date', type: 'DATE', nullable: false, description: 'Tanggal mendaftar' },
      { name: 'verified_by', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'SET NULL' }, description: 'FK ke operator TU' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Catatan verifikator panitia SPMB' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu registrasi' }
    ],
    indexes: [
      { name: 'idx_admissions_reg_num', columns: ['registration_number'], unique: true },
      { name: 'idx_admissions_status', columns: ['status'] },
      { name: 'idx_admissions_pathway', columns: ['chosen_pathway'] }
    ]
  },

  // 20. admission_documents
  {
    name: 'admission_documents',
    description: 'Tabel berkas persyaratan calon siswa baru SPMB',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID berkas' },
      { name: 'admission_id', type: 'VARCHAR(64)', nullable: false, references: { table: 'admissions', column: 'id', onDelete: 'CASCADE' }, description: 'FK ke admissions' },
      { name: 'document_type', type: 'VARCHAR(64)', nullable: false, description: 'Jenis dokumen (KK, Akta, Rapor, Piagam)' },
      { name: 'file_url', type: 'TEXT', nullable: false, description: 'Tautan penyimpanan berkas terverifikasi' },
      { name: 'file_size', type: 'INT', nullable: false, description: 'Ukuran berkas dalam byte' },
      { name: 'verification_status', type: 'VARCHAR(32)', nullable: false, defaultValue: "'pending'", checkConstraint: "verification_status IN ('pending', 'verified', 'rejected')", description: 'Status validitas berkas' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Catatan keabsahan dokumen' },
      { name: 'uploaded_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu unggah' }
    ],
    indexes: [
      { name: 'idx_admission_docs_admission_id', columns: ['admission_id'] },
      { name: 'idx_admission_docs_status', columns: ['verification_status'] }
    ]
  },

  // 21. notifications
  {
    name: 'notifications',
    description: 'Tabel notifikasi sistem dan siaran aktivitas pengguna',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID notifikasi' },
      { name: 'title', type: 'VARCHAR(200)', nullable: false, description: 'Judul notifikasi' },
      { name: 'message', type: 'TEXT', nullable: false, description: 'Pesan notifikasi' },
      { name: 'type', type: 'VARCHAR(64)', nullable: false, description: 'Jenis notifikasi' },
      { name: 'is_read', type: 'BOOLEAN', nullable: false, defaultValue: 'FALSE', description: 'Status telah dibaca' },
      { name: 'link', type: 'TEXT', nullable: true, description: 'Tautan tindakan cepat' },
      { name: 'target_role', type: 'VARCHAR(64)', nullable: true, description: 'Role target (opsional)' },
      { name: 'target_user_id', type: 'VARCHAR(64)', nullable: true, references: { table: 'users', column: 'id', onDelete: 'CASCADE' }, description: 'FK target user spesifik' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu dibuat' }
    ],
    indexes: [
      { name: 'idx_notifications_user', columns: ['target_user_id', 'is_read'] },
      { name: 'idx_notifications_role', columns: ['target_role', 'is_read'] }
    ]
  },

  // 22. audit_logs
  {
    name: 'audit_logs',
    description: 'Tabel audit trail tidak dapat diubah (append-only) untuk kepatuhan dan forensik keamanan',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, isPrimary: true, description: 'ID log audit' },
      { name: 'timestamp', type: 'TIMESTAMP', nullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Waktu kejadian presisi' },
      { name: 'user_id', type: 'VARCHAR(64)', nullable: false, description: 'ID pengguna atau SYSTEM' },
      { name: 'username', type: 'VARCHAR(64)', nullable: false, description: 'Username pelaku aksi' },
      { name: 'user_role', type: 'VARCHAR(64)', nullable: false, description: 'Peran saat aksi terjadi' },
      { name: 'action', type: 'VARCHAR(64)', nullable: false, description: 'Kata kerja aksi (LOGIN, CREATE, UPDATE, DELETE, PUBLISH)' },
      { name: 'resource', type: 'VARCHAR(64)', nullable: false, description: 'Entitas yang diakses' },
      { name: 'details', type: 'TEXT', nullable: false, description: 'Detail perubahan atau alasan blokir' },
      { name: 'ip_address', type: 'VARCHAR(64)', nullable: false, description: 'Alamat IP klien' },
      { name: 'status', type: 'VARCHAR(16)', nullable: false, checkConstraint: "status IN ('SUCCESS', 'FAILED', 'BLOCKED')", description: 'Status hasil operasi' }
    ],
    indexes: [
      { name: 'idx_audit_logs_timestamp', columns: ['timestamp'] },
      { name: 'idx_audit_logs_user', columns: ['user_id'] },
      { name: 'idx_audit_logs_status', columns: ['status'] }
    ]
  }
];

/**
 * Generates pure standard SQL DDL statements for any RDBMS (PostgreSQL/MySQL/Cloud SQL)
 */
export function generateSQLDDLScript(): string {
  let sql = `-- ====================================================================\n`;
  sql += `-- SMA NEGERI 1 JULOK (DESA BUKET SEURAJA, KEC. JULOK, ACEH TIMUR)\n`;
  sql += `-- RELATIONAL DATABASE DDL SCRIPT (NORMALIZED 3NF SCHEMA)\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n`;
  sql += `-- ====================================================================\n\n`;

  for (const table of RELATIONAL_SCHEMA_DDL) {
    sql += `-- Table: ${table.name} (${table.description})\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
    const colDefs = table.columns.map(c => {
      let def = `  ${c.name} ${c.type}`;
      if (!c.nullable) def += ` NOT NULL`;
      if (c.defaultValue) def += ` DEFAULT ${c.defaultValue}`;
      if (c.isPrimary) def += ` PRIMARY KEY`;
      if (c.isUnique) def += ` UNIQUE`;
      if (c.checkConstraint) def += ` CHECK (${c.checkConstraint})`;
      if (c.references) {
        def += ` REFERENCES ${c.references.table}(${c.references.column}) ON DELETE ${c.references.onDelete}`;
      }
      return def;
    });
    sql += colDefs.join(',\n') + '\n);\n\n';

    // Indexes
    for (const idx of table.indexes) {
      if (!idx.unique) {
        sql += `CREATE INDEX IF NOT EXISTS ${idx.name} ON ${table.name} (${idx.columns.join(', ')});\n`;
      }
    }
    sql += '\n';
  }

  return sql;
}
