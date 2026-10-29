export type StandardRole = 
  | 'super_admin' 
  | 'admin_sekolah' 
  | 'editor' 
  | 'guru' 
  | 'siswa' 
  | 'operator_tu';

export type UserRole = StandardRole | string;

export type PermissionKey =
  | 'content.view'
  | 'content.create'
  | 'content.edit'
  | 'content.delete'
  | 'content.approve'
  | 'content.publish'
  | 'document.manage'
  | 'spmb.verify'
  | 'grades.manage'
  | 'grades.view_own'
  | 'users.manage'
  | 'roles.manage'
  | 'audit.view'
  | 'settings.manage';

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  category: 'Konten & Publikasi' | 'Akademik & Siswa' | 'Administrasi Sistem' | 'Keamanan & Audit';
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: PermissionKey[];
  isSystemRole: boolean;
  userCount?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash?: string;
  salt?: string;
  avatarUrl?: string;
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lockUntil?: string;
  lastLogin?: string;
  createdAt: string;
  phone?: string;
  nip?: string;      // For teacher / staff
  nisn?: string;     // For student
  classId?: string;  // For student
  subject?: string;  // For teacher
}

export type EditorialStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected';

export interface EditorialArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Akademik' | 'Prestasi' | 'Kegiatan' | 'Pengumuman' | 'Artikel Siswa' | 'Budaya & Agama';
  authorId: string;
  authorName: string;
  imageUrl: string;
  status: EditorialStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags: string[];
  views: number;
}

export interface StudentGradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  className: string;
  semester: 'Ganjil' | 'Genap';
  academicYear: string;
  subjects: Array<{
    subjectName: string;
    teacherName: string;
    score: number;
    letterGrade: 'A' | 'B' | 'C' | 'D';
    competencyDesc: string;
  }>;
  attendance: {
    present: number;
    sick: number;
    permission: number;
    unexcused: number;
  };
  homeroomNotes: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
}

export interface PasswordResetRequest {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export interface SchoolSettings {
  name: string;
  shortName: string;
  tagline: string;
  npsn: string;
  status: string;
  accreditation: string;
  curriculum: string;
  principalName: string;
  principalNip: string;
  principalPhoto: string;
  principalSpeech: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  operatingHours: string;
  logoUrl?: string;
  heroImageUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  stats: {
    studentsCount: number;
    teachersCount: number;
    staffCount: number;
    classesCount: number;
    extracurricularsCount: number;
    alumniCount: number;
    accreditationScore: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Akademik' | 'Prestasi' | 'Kegiatan' | 'Pengumuman' | 'Artikel Siswa' | 'Budaya & Agama';
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  views: number;
  isFeatured?: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  date: string;
  target: 'Semua' | 'Siswa' | 'Guru & Staf' | 'Orang Tua' | 'Calon Siswa Baru';
  isUrgent?: boolean;
  downloadUrl?: string;
  attachmentName?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  category: 'Akademik' | 'Ujian' | 'Libur' | 'Ekstrakurikuler' | 'Keagamaan' | 'Rapat';
}

export interface StaffItem {
  id: string;
  name: string;
  nip: string;
  role: string;
  subject?: string;
  education: string;
  photoUrl: string;
  category: 'guru' | 'tendik';
  isLeader?: boolean;
}

export interface ClassItem {
  id: string;
  name: string;
  grade: 'X' | 'XI' | 'XII';
  major: 'Fase E (Umum)' | 'Fase F (MIPA)' | 'Fase F (IPS)' | 'MIPA' | 'IPS';
  homeroomTeacher: string;
  studentCount: number;
  maleCount: number;
  femaleCount: number;
  room: string;
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'Laboratorium' | 'Ruang Belajar' | 'Sarana Olahraga' | 'Ibadah' | 'Layanan Siswa';
  description: string;
  photoUrl: string;
  capacity?: string;
  condition: 'Sangat Baik' | 'Baik' | 'Pemeliharaan Rutin';
}

export interface AchievementItem {
  id: string;
  title: string;
  recipient: string;
  category: 'Siswa' | 'Guru' | 'Sekolah';
  type: 'Sains & Teknologi' | 'Seni & Budaya' | 'Olahraga' | 'Keagamaan (MTQ)' | 'Bahasa & Sastra' | 'Kepemimpinan';
  level: 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  year: number;
  rank: string;
  description: string;
  photoUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  url: string;
  category: 'Kegiatan Belajar' | 'Upacara & Peringatan' | 'Ekstrakurikuler' | 'Fasilitas' | 'Prestasi';
  caption: string;
  date: string;
}

export interface ExtracurricularItem {
  id: string;
  name: string;
  category: 'Kepemimpinan' | 'Keagamaan' | 'Seni & Budaya' | 'Olahraga' | 'Karya Ilmiah & Bahasa';
  coach: string;
  schedule: string;
  description: string;
  achievements?: string[];
  membersCount: number;
}

export interface SpmbRegistration {
  id: string;
  registrationNumber: string;
  fullName: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  originSchool: string;
  parentName: string;
  parentPhone: string;
  email: string;
  chosenPathway: 'Zonasi' | 'Prestasi Akademik' | 'Afirmasi' | 'Perpindahan Tugas Orang Tua';
  averageScore: number;
  status: 'Menunggu Verifikasi' | 'Berkas Diterima' | 'Lulus Seleksi' | 'Cadangan' | 'Tidak Lulus';
  submissionDate: string;
  notes?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  category: 'Kurikulum & Kalender' | 'Brosur & Panduan SPMB' | 'Surat Keputusan' | 'Formulir Siswa' | 'Modul Pembelajaran';
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  date: string;
  downloadCount: number;
  description: string;
  isRestricted?: boolean;
  requiredRole?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
  reply?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'SPMB' | 'Akademik' | 'Fasilitas' | 'Tata Tertib' | 'Layanan Digital';
}

// ==========================================
// A. CMS MODULE TYPES
// ==========================================
export interface ContentRevision {
  id: string;
  contentId: string;
  contentType: 'page' | 'news' | 'article';
  timestamp: string;
  authorName: string;
  authorId: string;
  title: string;
  content: string;
  summary: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;
  menuPlacement?: 'header' | 'footer' | 'both' | 'none';
  viewCount: number;
  revisions?: ContentRevision[];
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  fileType: 'image' | 'document' | 'video';
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: string;
}

// ==========================================
// B. ACADEMIC INFO TYPES
// ==========================================
export interface LessonSchedule {
  id: string;
  className: string;
  grade: 'X' | 'XI' | 'XII';
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  period: number;
  time: string;
  subjectName: string;
  teacherName: string;
  room: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  gradeLevel: 'X' | 'XI' | 'XII';
  topic: string;
  authorTeacher: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
  uploadedDate: string;
  isRestricted?: boolean;
}

export interface ExternalAppIntegration {
  id: string;
  name: string;
  category: 'CBT / Ujian' | 'LMS & E-Learning' | 'Dapodik Kemendikbud' | 'Perpustakaan Digital' | 'E-Rapor Kurikulum Merdeka';
  url: string;
  description: string;
  status: 'Online' | 'Maintenance' | 'Terkonfigurasi';
  icon: string;
  isProtected?: boolean;
}

// ==========================================
// D. SPMB SETTINGS & QUOTAS
// ==========================================
export interface SpmbSettings {
  isOpen: boolean;
  academicYear: string;
  startDate: string;
  endDate: string;
  announcementDate: string;
  reRegistrationDate: string;
  quotas: {
    zonasi: number;
    prestasi: number;
    afirmasi: number;
    perpindahan: number;
    total: number;
  };
  contactPerson: string;
  hotlinePhone: string;
  procedurePdfUrl: string;
}

// ==========================================
// E. INTERACTIVITY & NOTIFICATIONS
// ==========================================
export interface SchoolPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface SchoolPoll {
  id: string;
  title: string;
  description: string;
  question: string;
  options: SchoolPollOption[];
  totalVotes: number;
  expiresAt: string;
  isActive: boolean;
  userVotedIds: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval_required' | 'article_approved' | 'article_rejected' | 'spmb_new' | 'system_alert' | 'urgent_announcement';
  date: string;
  isRead: boolean;
  link?: string;
  targetRole?: StandardRole | 'all';
}

// ==========================================
// H. SYSTEM & INTEGRATION SETTINGS
// ==========================================
export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl: string;
  sitemapUrl: string;
  googleAnalyticsId: string;
  searchConsoleCode: string;
}

export interface IntegrationSettings {
  dapodikUrl: string;
  dapodikStatus: 'Online' | 'Tersinkronisasi' | 'Offline';
  cbtExamUrl: string;
  googleClassroomUrl: string;
  eraporUrl: string;
  smtpConfigured: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
}

export interface DatabaseSchema {
  settings: SchoolSettings;
  news: NewsItem[];
  announcements: AnnouncementItem[];
  events: EventItem[];
  staff: StaffItem[];
  classes: ClassItem[];
  facilities: FacilityItem[];
  achievements: AchievementItem[];
  galleries: GalleryItem[];
  extracurriculars: ExtracurricularItem[];
  spmb: SpmbRegistration[];
  downloads: DownloadItem[];
  messages: ContactMessage[];
  faqs: FaqItem[];
  adminPasscode: string;
  // RBAC extensions
  users: User[];
  roles: RoleDefinition[];
  articles: EditorialArticle[];
  grades: StudentGradeRecord[];
  auditLogs: AuditLog[];
  resetRequests: PasswordResetRequest[];
  isSuperAdminProvisioned: boolean;
  // New comprehensive modules
  pages: CustomPage[];
  contentCategories: ContentCategory[];
  contentTags: ContentTag[];
  revisions: ContentRevision[];
  media: MediaItem[];
  schedules: LessonSchedule[];
  learningMaterials: LearningMaterial[];
  externalApps: ExternalAppIntegration[];
  spmbSettings: SpmbSettings;
  polls: SchoolPoll[];
  notifications: NotificationItem[];
  seoSettings: SeoSettings;
  integrationSettings: IntegrationSettings;
}
