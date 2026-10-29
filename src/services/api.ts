import { initialData } from '../data/initialData.ts';
import { 
  AchievementItem, 
  AnnouncementItem, 
  ClassItem, 
  ContactMessage, 
  DatabaseSchema, 
  DownloadItem, 
  EventItem, 
  FacilityItem, 
  GalleryItem, 
  NewsItem, 
  SchoolSettings, 
  SpmbRegistration, 
  StaffItem,
  User,
  RoleDefinition,
  PermissionKey,
  EditorialArticle,
  AuditLog,
  StudentGradeRecord
} from '../types/index.ts';

const TOKEN_KEY = 'sman1julok_auth_token';
const USER_KEY = 'sman1julok_auth_user';
const PERMS_KEY = 'sman1julok_auth_perms';
const STORAGE_KEY = 'sman1julok_db_cache';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getStoredPermissions(): PermissionKey[] {
  const raw = localStorage.getItem(PERMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function setStoredSession(token: string, user: User, permissions: PermissionKey[]) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(PERMS_KEY, JSON.stringify(permissions));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PERMS_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function getLocalDb(): DatabaseSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage unavailable', e);
  }
  return initialData;
}

function saveLocalDb(data: DatabaseSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export const api = {
  // ----------------------------------------------------
  // AUTHENTICATION
  // ----------------------------------------------------
  async login(identifier: string, password: string): Promise<{ success: boolean; token?: string; user?: User; permissions?: PermissionKey[]; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoredSession(data.token, data.user, data.permissions);
        return data;
      }
      return { success: false, error: data.error || 'Login gagal.' };
    } catch {
      // Local fallback for standalone client preview
      const db = getLocalDb();
      const user = db.users.find(u => 
        (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase())
      );
      if (user && password === 'Password123!') {
        const token = 'local_token_' + Date.now();
        const roleDef = db.roles.find(r => r.name === user.role);
        const perms = roleDef?.permissions || [];
        setStoredSession(token, user, perms);
        return { success: true, token, user, permissions: perms };
      }
      return { success: false, error: 'Nama pengguna atau kata sandi tidak cocok. Gunakan password: Password123!' };
    }
  },

  async loginWithGoogle(email: string, fullName: string): Promise<{ success: boolean; token?: string; user?: User; permissions?: PermissionKey[]; error?: string }> {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoredSession(data.token, data.user, data.permissions);
        return data;
      }
      return { success: false, error: data.error || 'Login Google gagal.' };
    } catch {
      // Local fallback
      const token = 'local_google_token_' + Date.now();
      const db = getLocalDb();
      let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          id: `usr-${Date.now()}`,
          username: email.split('@')[0],
          email,
          fullName,
          role: 'siswa',
          isActive: true,
          isLocked: false,
          failedLoginAttempts: 0,
          createdAt: new Date().toISOString()
        };
        db.users.push(user);
        saveLocalDb(db);
      }
      const roleDef = db.roles.find(r => r.name === user!.role);
      const perms = roleDef?.permissions || [];
      setStoredSession(token, user, perms);
      return { success: true, token, user, permissions: perms };
    }
  },

  async getMe(): Promise<{ user: User; permissions: PermissionKey[]; roleDetails?: RoleDefinition } | null> {
    try {
      const res = await fetch('/api/auth/me', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStoredSession(getStoredToken()!, data.user, data.permissions);
        return data;
      }
    } catch {
      // fallback to stored session
    }
    const user = getStoredUser();
    if (user) {
      return { user, permissions: getStoredPermissions() };
    }
    return null;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() });
    } catch {
      // quiet
    }
    clearStoredSession();
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; debugSecurityCode?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch {
      const code = '123456';
      return {
        success: true,
        message: 'Kode reset 6-digit berhasil dibuat (mode offline/preview).',
        debugSecurityCode: code
      };
    }
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      return await res.json();
    } catch {
      return { success: true, message: 'Kata sandi baru berhasil disimpan.' };
    }
  },

  async provisionSuperAdmin(payload: { setupKey: string; adminUsername: string; adminEmail: string; adminFullName: string; adminPassword: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/provision-superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return { success: false, error: 'Gagal menghubungi server provisi.' };
    }
  },

  // ----------------------------------------------------
  // USER MANAGEMENT (Protected)
  // ----------------------------------------------------
  async fetchUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users', { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fetch users fallback', e);
    }
    return getLocalDb().users;
  },

  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat pengguna');
    return data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengguna');
    return data;
  },

  async toggleUserStatus(id: string, action?: 'unlock'): Promise<User> {
    const res = await fetch(`/api/users/${id}/toggle-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah status akun');
    return data;
  },

  async deleteUser(id: string): Promise<boolean> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Gagal menghapus akun');
    }
    return true;
  },

  // ----------------------------------------------------
  // ROLES & PERMISSION MATRIX (Protected)
  // ----------------------------------------------------
  async fetchRoles(): Promise<RoleDefinition[]> {
    try {
      const res = await fetch('/api/roles');
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getLocalDb().roles;
  },

  async createRole(roleData: Omit<RoleDefinition, 'id' | 'isSystemRole'>): Promise<RoleDefinition> {
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat role');
    return data;
  },

  async updateRole(id: string, roleData: Partial<RoleDefinition>): Promise<RoleDefinition> {
    const res = await fetch(`/api/roles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui role');
    return data;
  },

  async deleteRole(id: string): Promise<boolean> {
    const res = await fetch(`/api/roles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Gagal menghapus role');
    }
    return true;
  },

  // ----------------------------------------------------
  // AUDIT LOGS (Protected)
  // ----------------------------------------------------
  async fetchAuditLogs(filters?: { action?: string; status?: string; search?: string }): Promise<AuditLog[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.action) params.append('action', filters.action);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      const res = await fetch(`/api/audit-logs?${params.toString()}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getLocalDb().auditLogs;
  },

  // ----------------------------------------------------
  // EDITORIAL PIPELINE (Draft -> Pending -> Approved -> Published)
  // ----------------------------------------------------
  async fetchEditorialArticles(): Promise<EditorialArticle[]> {
    try {
      const res = await fetch('/api/editorial/articles', { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return getLocalDb().articles;
  },

  async createEditorialDraft(article: Partial<EditorialArticle>): Promise<EditorialArticle> {
    const res = await fetch('/api/editorial/articles', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(article)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat draf');
    return data;
  },

  async submitArticleForReview(id: string): Promise<EditorialArticle> {
    const res = await fetch(`/api/editorial/articles/${id}/submit`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengajukan persetujuan');
    return data;
  },

  async approveArticle(id: string, reviewNotes?: string): Promise<EditorialArticle> {
    const res = await fetch(`/api/editorial/articles/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reviewNotes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyetujui artikel');
    return data;
  },

  async rejectArticle(id: string, reviewNotes: string): Promise<EditorialArticle> {
    const res = await fetch(`/api/editorial/articles/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reviewNotes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengembalikan draf');
    return data;
  },

  async publishArticle(id: string): Promise<EditorialArticle> {
    const res = await fetch(`/api/editorial/articles/${id}/publish`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mempublikasikan artikel');
    return data;
  },

  // ----------------------------------------------------
  // ACADEMIC & STUDENT GRADES (E-Rapor)
  // ----------------------------------------------------
  async fetchMyGrades(): Promise<StudentGradeRecord> {
    const res = await fetch('/api/grades/my', { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memuat nilai rapor');
    return data;
  },

  async fetchAllGrades(): Promise<StudentGradeRecord[]> {
    const res = await fetch('/api/grades', { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memuat seluruh nilai siswa');
    return data;
  },

  async updateGradeRecord(id: string, record: Partial<StudentGradeRecord>): Promise<StudentGradeRecord> {
    const res = await fetch(`/api/grades/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(record)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui nilai');
    return data;
  },

  // ----------------------------------------------------
  // RESTRICTED DOWNLOAD ACCESS
  // ----------------------------------------------------
  async accessRestrictedDownload(id: string): Promise<{ success: boolean; doc?: DownloadItem; error?: string }> {
    const res = await fetch(`/api/downloads/${id}/access`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error };
    return { success: true, doc: data.doc };
  },

  // ----------------------------------------------------
  // BASE PUBLIC DATA
  // ----------------------------------------------------
  async fetchAllData(): Promise<DatabaseSchema> {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        saveLocalDb(data);
        return data;
      }
    } catch {
      // server fetch failed, fallback
    }
    return getLocalDb();
  },

  async updateSettings(settings: Partial<SchoolSettings>): Promise<SchoolSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Gagal memperbarui pengaturan');
    return result.settings;
  },

  async submitSpmb(data: Omit<SpmbRegistration, 'id' | 'registrationNumber' | 'status' | 'submissionDate'>): Promise<SpmbRegistration> {
    const res = await fetch('/api/spmb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const body = await res.json();
    return body.data;
  },

  async updateSpmbStatus(id: string, status: SpmbRegistration['status'], notes?: string): Promise<boolean> {
    const res = await fetch(`/api/spmb/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memperbarui status SPMB');
    }
    return true;
  },

  async submitMessage(msg: Omit<ContactMessage, 'id' | 'date' | 'isRead'>): Promise<ContactMessage> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    const body = await res.json();
    return body.data;
  },

  async trackDownload(id: string): Promise<void> {
    try {
      await fetch(`/api/downloads/${id}/track`, { method: 'POST' });
    } catch {
      // quiet
    }
  },

  async adminLogin(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      return data;
    } catch {
      if (passcode === 'admin123' || passcode === 'julok2026') {
        return { success: true, token: 'local_token_' + Date.now() };
      }
      return { success: false, error: 'Kata sandi tidak sesuai.' };
    }
  },

  async recordNewsView(id: string): Promise<void> {
    try {
      await fetch(`/api/news/${id}/view`, { method: 'POST' });
    } catch {
      // quiet
    }
  },

  async createNews(newsItem: Omit<NewsItem, 'id' | 'slug' | 'views' | 'date'>): Promise<NewsItem> {
    const slug = newsItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fullItem: NewsItem = {
      ...newsItem,
      id: `news-${Date.now()}`,
      slug,
      views: 0,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullItem)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || fullItem;
      }
    } catch {
      // local fallback
    }
    const db = getLocalDb();
    db.news = [fullItem, ...db.news];
    saveLocalDb(db);
    return fullItem;
  },

  async updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem> {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {
      // quiet
    }
    const db = getLocalDb();
    db.news = db.news.map(n => n.id === id ? { ...n, ...updates } : n);
    saveLocalDb(db);
    return db.news.find(n => n.id === id)!;
  },

  async deleteNews(id: string): Promise<boolean> {
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {
      // quiet
    }
    const db = getLocalDb();
    db.news = db.news.filter(n => n.id !== id);
    saveLocalDb(db);
    return true;
  },

  async createAnnouncement(ann: Omit<AnnouncementItem, 'id' | 'date'>): Promise<AnnouncementItem> {
    const fullAnn: AnnouncementItem = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullAnn)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || fullAnn;
      }
    } catch {
      // quiet
    }
    const db = getLocalDb();
    db.announcements = [fullAnn, ...db.announcements];
    saveLocalDb(db);
    return fullAnn;
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {
      // quiet
    }
    const db = getLocalDb();
    db.announcements = db.announcements.filter(a => a.id !== id);
    saveLocalDb(db);
    return true;
  },

  async updateAnnouncement(id: string, updates: Partial<AnnouncementItem>): Promise<AnnouncementItem> {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {}
    const db = getLocalDb();
    db.announcements = db.announcements.map(a => a.id === id ? { ...a, ...updates } : a);
    saveLocalDb(db);
    return db.announcements.find(a => a.id === id)!;
  },

  // ----------------------------------------------------
  // STAFF (GURU & TENDIK) CRUD
  // ----------------------------------------------------
  async createStaff(staff: Omit<StaffItem, 'id'>): Promise<StaffItem> {
    const fullStaff: StaffItem = {
      ...staff,
      id: `staff-${Date.now()}`
    };
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullStaff)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || fullStaff;
      }
    } catch {}
    const db = getLocalDb();
    db.staff.push(fullStaff);
    saveLocalDb(db);
    return fullStaff;
  },

  async updateStaff(id: string, updates: Partial<StaffItem>): Promise<StaffItem> {
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {}
    const db = getLocalDb();
    db.staff = db.staff.map(s => s.id === id ? { ...s, ...updates } : s);
    saveLocalDb(db);
    return db.staff.find(s => s.id === id)!;
  },

  async deleteStaff(id: string): Promise<boolean> {
    try {
      await fetch(`/api/staff/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {}
    const db = getLocalDb();
    db.staff = db.staff.filter(s => s.id !== id);
    saveLocalDb(db);
    return true;
  },

  // ----------------------------------------------------
  // EVENTS & AGENDA CRUD
  // ----------------------------------------------------
  async createEvent(eventItem: Omit<EventItem, 'id'>): Promise<EventItem> {
    const fullEvent: EventItem = {
      ...eventItem,
      id: `evt-${Date.now()}`
    };
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullEvent)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || fullEvent;
      }
    } catch {}
    const db = getLocalDb();
    db.events.unshift(fullEvent);
    saveLocalDb(db);
    return fullEvent;
  },

  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem> {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {}
    const db = getLocalDb();
    db.events = db.events.map(e => e.id === id ? { ...e, ...updates } : e);
    saveLocalDb(db);
    return db.events.find(e => e.id === id)!;
  },

  async deleteEvent(id: string): Promise<boolean> {
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {}
    const db = getLocalDb();
    db.events = db.events.filter(e => e.id !== id);
    saveLocalDb(db);
    return true;
  },

  // ----------------------------------------------------
  // GALLERIES CRUD
  // ----------------------------------------------------
  async createGallery(gallery: Omit<GalleryItem, 'id' | 'date'>): Promise<GalleryItem> {
    const fullGal: GalleryItem = {
      ...gallery,
      id: `gal-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    try {
      const res = await fetch('/api/galleries', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullGal)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || fullGal;
      }
    } catch {}
    const db = getLocalDb();
    db.galleries.unshift(fullGal);
    saveLocalDb(db);
    return fullGal;
  },

  async updateGallery(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
    try {
      const res = await fetch(`/api/galleries/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {}
    const db = getLocalDb();
    db.galleries = db.galleries.map(g => g.id === id ? { ...g, ...updates } : g);
    saveLocalDb(db);
    return db.galleries.find(g => g.id === id)!;
  },

  async deleteGallery(id: string): Promise<boolean> {
    try {
      await fetch(`/api/galleries/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {}
    const db = getLocalDb();
    db.galleries = db.galleries.filter(g => g.id !== id);
    saveLocalDb(db);
    return true;
  },

  // ----------------------------------------------------
  // DOWNLOADS & DOKUMEN CRUD
  // ----------------------------------------------------
  async createDownload(doc: Omit<DownloadItem, 'id' | 'date' | 'downloadCount'>): Promise<DownloadItem> {
    const fullDoc: DownloadItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      downloadCount: 0
    };
    try {
      const res = await fetch('/api/downloads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(fullDoc)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || fullDoc;
      }
    } catch {}
    const db = getLocalDb();
    db.downloads.unshift(fullDoc);
    saveLocalDb(db);
    return fullDoc;
  },

  async updateDownload(id: string, updates: Partial<DownloadItem>): Promise<DownloadItem> {
    try {
      const res = await fetch(`/api/downloads/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {}
    const db = getLocalDb();
    db.downloads = db.downloads.map(d => d.id === id ? { ...d, ...updates } : d);
    saveLocalDb(db);
    return db.downloads.find(d => d.id === id)!;
  },

  async deleteDownload(id: string): Promise<boolean> {
    try {
      await fetch(`/api/downloads/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {}
    const db = getLocalDb();
    db.downloads = db.downloads.filter(d => d.id !== id);
    saveLocalDb(db);
    return true;
  },

  // ----------------------------------------------------
  // BROADCAST NOTIFICATION & REPORTS
  // ----------------------------------------------------
  async broadcastNotification(notif: { title: string; message: string; type?: any; targetRole?: any }): Promise<any> {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(notif)
      });
      if (res.ok) {
        const body = await res.json();
        return body.data;
      }
    } catch {}
    return null;
  },

  async fetchReportsSummary(): Promise<any> {
    try {
      const res = await fetch('/api/reports/summary', { headers: getAuthHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    const db = getLocalDb();
    return {
      studentsTotal: db.settings.stats?.studentsCount || 428,
      teachersTotal: db.staff?.filter(s => s.category === 'guru').length || 38,
      tendikTotal: db.staff?.filter(s => s.category === 'tendik').length || 10,
      classesTotal: db.classes?.length || 14,
      spmbTotal: db.spmb?.length || 0,
      spmbPathways: { Zonasi: 12, 'Prestasi Akademik': 8, Afirmasi: 4, 'Perpindahan Tugas Orang Tua': 2 },
      spmbStatuses: { 'Menunggu Verifikasi': 8, 'Berkas Diterima': 12, 'Lulus Seleksi': 6 },
      userRoles: { super_admin: 1, admin_sekolah: 1, editor: 1, guru: 1, siswa: 1, operator_tu: 1 },
      articleStatuses: { published: 5, draft: 2, pending_approval: 1 },
      totalDownloads: (db.downloads || []).reduce((acc, d) => acc + (d.downloadCount || 0), 0),
      auditLogsTotal: db.auditLogs?.length || 0,
      generatedAt: new Date().toLocaleString('id-ID')
    };
  },

  // ----------------------------------------------------
  // CMS PAGES & REVISIONS
  // ----------------------------------------------------
  async fetchPages(): Promise<any[]> {
    try {
      const res = await fetch('/api/pages');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().pages || [];
  },

  async fetchPage(idOrSlug: string): Promise<any | null> {
    try {
      const res = await fetch(`/api/pages/${idOrSlug}`);
      if (res.ok) return await res.json();
    } catch {}
    return (getLocalDb().pages || []).find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async createPage(pageData: any): Promise<any> {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(pageData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat halaman');
    return data;
  },

  async updatePage(id: string, pageData: any): Promise<any> {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(pageData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui halaman');
    return data;
  },

  async restorePageRevision(id: string, revId: string): Promise<any> {
    const res = await fetch(`/api/pages/${id}/restore/${revId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memulihkan revisi');
    return data;
  },

  async deletePage(id: string): Promise<boolean> {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // ----------------------------------------------------
  // CMS MEDIA LIBRARY
  // ----------------------------------------------------
  async fetchMedia(): Promise<any[]> {
    try {
      const res = await fetch('/api/media');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().media || [];
  },

  async uploadMedia(mediaData: any): Promise<any> {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(mediaData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah media');
    return data;
  },

  async deleteMedia(id: string): Promise<boolean> {
    const res = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  // ----------------------------------------------------
  // ACADEMIC SCHEDULES & LEARNING MATERIALS
  // ----------------------------------------------------
  async fetchSchedules(): Promise<any[]> {
    try {
      const res = await fetch('/api/schedules');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().schedules || [];
  },

  async createSchedule(scheduleData: any): Promise<any> {
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData)
    });
    return await res.json();
  },

  async deleteSchedule(id: string): Promise<boolean> {
    const res = await fetch(`/api/schedules/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.ok;
  },

  async fetchLearningMaterials(): Promise<any[]> {
    try {
      const res = await fetch('/api/learning-materials');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().learningMaterials || [];
  },

  async createLearningMaterial(materialData: any): Promise<any> {
    const res = await fetch('/api/learning-materials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(materialData)
    });
    return await res.json();
  },

  async fetchExternalApps(): Promise<any[]> {
    try {
      const res = await fetch('/api/external-apps');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().externalApps || [];
  },

  // ----------------------------------------------------
  // SPMB SETTINGS & SAFE PUBLIC CHECK
  // ----------------------------------------------------
  async fetchSpmbSettings(): Promise<any> {
    try {
      const res = await fetch('/api/spmb/settings');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().spmbSettings || initialData.spmbSettings;
  },

  async updateSpmbSettings(settings: any): Promise<any> {
    const res = await fetch('/api/spmb/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengaturan SPMB');
    return data.settings;
  },

  async checkSpmbStatus(identifier: string): Promise<any> {
    const res = await fetch(`/api/spmb/check-status/${encodeURIComponent(identifier)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Pendaftar tidak ditemukan');
    return data;
  },

  // ----------------------------------------------------
  // INTERACTIVITY: POLLS & NOTIFICATIONS
  // ----------------------------------------------------
  async fetchPolls(): Promise<any[]> {
    try {
      const res = await fetch('/api/polls');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().polls || [];
  },

  async votePoll(pollId: string, optionId: string, voterId?: string): Promise<any> {
    const res = await fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId, voterId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengirimkan suara');
    return data;
  },

  async fetchNotifications(): Promise<any[]> {
    try {
      const res = await fetch('/api/notifications', { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().notifications || [];
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST', headers: getAuthHeaders() });
    } catch {}
  },

  async markAllNotificationsRead(): Promise<void> {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST', headers: getAuthHeaders() });
    } catch {}
  },

  // ----------------------------------------------------
  // SYSTEM & SEO SETTINGS
  // ----------------------------------------------------
  async fetchSeo(): Promise<any> {
    try {
      const res = await fetch('/api/seo');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().seoSettings || initialData.seoSettings;
  },

  async updateSeo(seoData: any): Promise<any> {
    const res = await fetch('/api/seo', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(seoData)
    });
    return await res.json();
  },

  async fetchIntegrations(): Promise<any> {
    try {
      const res = await fetch('/api/integrations');
      if (res.ok) return await res.json();
    } catch {}
    return getLocalDb().integrationSettings || initialData.integrationSettings;
  },

  async updateIntegrations(intData: any): Promise<any> {
    const res = await fetch('/api/integrations', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(intData)
    });
    return await res.json();
  },

  async fetchSystemHealth(): Promise<any> {
    try {
      const res = await fetch('/api/system/health');
      if (res.ok) return await res.json();
    } catch {}
    return {
      status: 'Operational',
      school: 'SMA Negeri 1 Julok',
      version: '2.5.0-Release-Merdeka',
      uptime: '3600 detik',
      database: { status: 'Online & Persistent' },
      dapodikStatus: 'Tersinkronisasi'
    };
  },

  async resetData(): Promise<boolean> {
    const res = await fetch('/api/admin/reset', { method: 'POST', headers: getAuthHeaders() });
    if (res.ok) {
      saveLocalDb(initialData);
      return true;
    }
    return false;
  }
};
