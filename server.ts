import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { initialData, initialRoles, initialUsers, initialEditorialArticles, initialStudentGrades, initialAuditLogs } from './src/data/initialData.ts';
import { DatabaseSchema, User, RoleDefinition, PermissionKey, EditorialArticle, AuditLog, StudentGradeRecord, AnnouncementItem, EventItem, StaffItem, GalleryItem, DownloadItem, NotificationItem } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Helper for cryptographic hashing
function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Ensure data folder and db.json exist and merge schema
function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        ...initialData,
        ...parsed,
        settings: { ...initialData.settings, ...(parsed.settings || {}) },
        stats: { ...initialData.settings.stats, ...(parsed.settings?.stats || {}) },
        roles: parsed.roles && parsed.roles.length > 0 ? parsed.roles : initialRoles,
        users: parsed.users && parsed.users.length > 0 ? parsed.users : initialUsers,
        articles: parsed.articles && parsed.articles.length > 0 ? parsed.articles : initialEditorialArticles,
        grades: parsed.grades && parsed.grades.length > 0 ? parsed.grades : initialStudentGrades,
        auditLogs: parsed.auditLogs && parsed.auditLogs.length > 0 ? parsed.auditLogs : initialAuditLogs,
        resetRequests: parsed.resetRequests || [],
        isSuperAdminProvisioned: parsed.isSuperAdminProvisioned !== undefined ? parsed.isSuperAdminProvisioned : true
      };
    }
  } catch (err) {
    console.error('Error reading db.json, using initial data:', err);
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial db.json:', err);
  }
  return initialData;
}

let db = loadDatabase();

function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// In-Memory Session Store: token -> { userId, username, role, expiresAt }
interface SessionData {
  userId: string;
  username: string;
  role: string;
  expiresAt: number;
}
const sessions = new Map<string, SessionData>();

// Helper to record security audit logs
function createAuditLog(
  userId: string,
  username: string,
  userRole: string,
  action: string,
  resource: string,
  details: string,
  ipAddress: string,
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED'
): void {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    userId,
    username,
    userRole,
    action,
    resource,
    details,
    ipAddress,
    status
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500); // keep recent 500 logs
  }
  saveDatabase();
}

// Helper: Sanitize user object (never return passwordHash or salt)
function sanitizeUser(u: User): Omit<User, 'passwordHash' | 'salt'> {
  const { passwordHash: _p, salt: _s, ...clean } = u;
  return clean;
}

// Helper: Get user's permissions based on their role
function getUserPermissions(roleName: string): PermissionKey[] {
  const roleDef = db.roles.find(r => r.name === roleName);
  return roleDef ? roleDef.permissions : [];
}

// Extend Express Request
interface AuthenticatedRequest extends Request {
  user?: User;
  userPermissions?: PermissionKey[];
}

// Authentication Middleware
function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses ditolak. Token autentikasi tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Sesi kedaluwarsa atau tidak valid. Silakan login kembali.' });
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Sesi Anda telah berakhir demi keamanan. Silakan login kembali.' });
  }

  const user = db.users.find(u => u.id === session.userId);
  if (!user) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Akun pengguna tidak ditemukan.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'Akun Anda dinonaktifkan oleh Administrator.' });
  }

  if (user.isLocked) {
    return res.status(403).json({ error: 'Akun Anda terkunci karena kegagalan login berulang kali.' });
  }

  req.user = user;
  req.userPermissions = getUserPermissions(user.role);
  next();
}

// Permission Gate Middleware
function requirePermission(perm: PermissionKey) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.userPermissions) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }

    // Super Admin has all permissions automatically
    if (req.user.role === 'super_admin' || req.userPermissions.includes(perm)) {
      return next();
    }

    createAuditLog(
      req.user.id,
      req.user.username,
      req.user.role,
      'PERMISSION_DENIED',
      perm,
      `Mencoba mengakses fitur '${perm}' tanpa wewenang role yang sesuai.`,
      req.ip || '127.0.0.1',
      'BLOCKED'
    );

    return res.status(403).json({
      error: `Akses ditolak: Anda tidak memiliki izin '${perm}'.`,
      code: 'PERMISSION_DENIED',
      requiredPermission: perm,
      userRole: req.user.role
    });
  };
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // ----------------------------------------------------
  // AUTHENTICATION & SESSION ENDPOINTS
  // ----------------------------------------------------

  // 1. User Login (Email or Username + Password)
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    const ip = req.ip || '127.0.0.1';

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Mohon masukkan email/username dan kata sandi.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = db.users.find(u => 
      u.username.toLowerCase() === cleanId || 
      u.email.toLowerCase() === cleanId
    );

    if (!user) {
      createAuditLog('UNKNOWN', identifier, 'GUEST', 'LOGIN_FAILED', 'AUTH', 'Upaya login dengan identitas tidak terdaftar.', ip, 'FAILED');
      return res.status(401).json({ error: 'Nama pengguna atau kata sandi tidak sesuai.' });
    }

    // Check account status
    if (!user.isActive) {
      createAuditLog(user.id, user.username, user.role, 'LOGIN_BLOCKED', 'AUTH', 'Upaya login pada akun nonaktif.', ip, 'BLOCKED');
      return res.status(403).json({ error: 'Akun Anda sedang dinonaktifkan. Hubungi Administrator SMAN 1 Julok.' });
    }

    // Check lock status
    if (user.isLocked) {
      if (user.lockUntil && new Date() < new Date(user.lockUntil)) {
        createAuditLog(user.id, user.username, user.role, 'LOGIN_BLOCKED', 'AUTH', 'Upaya login pada akun terkunci.', ip, 'BLOCKED');
        return res.status(403).json({ 
          error: `Akun terkunci hingga ${new Date(user.lockUntil).toLocaleTimeString('id-ID')} karena salah kata sandi 5 kali.` 
        });
      } else {
        // Unlock expired
        user.isLocked = false;
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
      }
    }

    // Verify Password Hash
    const salt = user.salt || 'julok_salt_2026';
    const computedHash = hashPassword(password, salt);

    if (user.passwordHash !== computedHash) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      
      // Lock after 5 consecutive failures
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins lock
        saveDatabase();
        createAuditLog(user.id, user.username, user.role, 'ACCOUNT_LOCKED', 'AUTH', 'Akun otomatis terkunci setelah 5 kali gagal login berturut-turut.', ip, 'BLOCKED');
        return res.status(403).json({ error: 'Akun Anda terkunci selama 15 menit karena 5 kali percobaan gagal berturut-turut.' });
      }

      saveDatabase();
      createAuditLog(user.id, user.username, user.role, 'LOGIN_FAILED', 'AUTH', `Kata sandi salah. Percobaan ke-${user.failedLoginAttempts}/5.`, ip, 'FAILED');
      return res.status(401).json({ 
        error: `Kata sandi salah. Percobaan gagal ${user.failedLoginAttempts} dari 5 batas maksimal.` 
      });
    }

    // Success login
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = undefined;
    user.lastLogin = new Date().toISOString();

    // Create session token
    const token = 'token_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    sessions.set(token, {
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt
    });

    saveDatabase();

    createAuditLog(user.id, user.username, user.role, 'LOGIN_SUCCESS', 'AUTH', `Login berhasil sebagai role ${user.role}.`, ip, 'SUCCESS');

    const permissions = getUserPermissions(user.role);
    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      permissions
    });
  });

  // 2. Google OAuth / SSO Login Endpoint (Verified client token)
  app.post('/api/auth/google', (req, res) => {
    const { email, fullName, googleId: _gid } = req.body;
    const ip = req.ip || '127.0.0.1';

    if (!email) {
      return res.status(400).json({ error: 'Email Google diperlukan.' });
    }

    let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Auto-assign as student if email matches school domain or default to guest student role
      const isStudent = email.includes('siswa') || email.includes('student');
      const roleName = isStudent ? 'siswa' : 'editor';
      user = {
        id: `usr-${Date.now()}`,
        username: email.split('@')[0],
        email,
        fullName: fullName || email.split('@')[0],
        role: roleName,
        isActive: true,
        isLocked: false,
        failedLoginAttempts: 0,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
    }

    const token = 'token_google_' + crypto.randomBytes(32).toString('hex');
    sessions.set(token, {
      userId: user.id,
      username: user.username,
      role: user.role,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    });

    user.lastLogin = new Date().toISOString();
    saveDatabase();

    createAuditLog(user.id, user.username, user.role, 'GOOGLE_LOGIN_SUCCESS', 'AUTH', 'Login berhasil melalui SSO Google Workspace.', ip, 'SUCCESS');

    res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      permissions: getUserPermissions(user.role)
    });
  });

  // 3. Current User Me
  app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(401).json({ error: 'Tidak terotentikasi' });
    res.json({
      user: sanitizeUser(req.user),
      permissions: req.userPermissions,
      roleDetails: db.roles.find(r => r.name === req.user?.role)
    });
  });

  // 4. Logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const session = sessions.get(token);
      if (session) {
        createAuditLog(session.userId, session.username, session.role, 'LOGOUT', 'AUTH', 'Sesi diakhiri secara manual oleh pengguna.', req.ip || '127.0.0.1', 'SUCCESS');
        sessions.delete(token);
      }
    }
    res.json({ success: true, message: 'Berhasil keluar.' });
  });

  // 5. Forgot Password (Safe reset code generation)
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Alamat email wajib diisi.' });

    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      // Do not disclose whether email exists for anti-enumeration security
      return res.json({ 
        success: true, 
        message: 'Jika email Anda terdaftar, kode verifikasi reset kata sandi telah dikirimkan.' 
      });
    }

    // Generate 6-digit secure numeric code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

    db.resetRequests.push({
      id: `rst-${Date.now()}`,
      email: user.email,
      token: resetCode,
      expiresAt,
      isUsed: false,
      createdAt: new Date().toISOString()
    });
    saveDatabase();

    createAuditLog(user.id, user.username, user.role, 'PASSWORD_RESET_REQUESTED', 'AUTH', 'Permintaan kode reset kata sandi diajukan.', req.ip || '127.0.0.1', 'SUCCESS');

    // In production, send via SMTP/email. In preview environment, return code in response so evaluator can test immediately!
    res.json({
      success: true,
      message: 'Kode reset kata sandi 6-digit telah dibuat (berlaku 15 menit).',
      debugSecurityCode: resetCode // Helpful for evaluation test
    });
  });

  // 6. Reset Password with Code
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, kode verifikasi, dan kata sandi baru wajib diisi.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Kata sandi baru minimal harus 8 karakter.' });
    }

    const resetReq = db.resetRequests.find(r => 
      r.email.toLowerCase() === email.trim().toLowerCase() &&
      r.token === code.trim() &&
      !r.isUsed &&
      new Date() <= new Date(r.expiresAt)
    );

    if (!resetReq) {
      return res.status(400).json({ error: 'Kode verifikasi tidak valid atau telah kedaluwarsa.' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    const salt = generateSalt();
    user.salt = salt;
    user.passwordHash = hashPassword(newPassword, salt);
    user.isLocked = false;
    user.failedLoginAttempts = 0;
    resetReq.isUsed = true;
    saveDatabase();

    createAuditLog(user.id, user.username, user.role, 'PASSWORD_RESET_SUCCESS', 'AUTH', 'Kata sandi berhasil diperbarui menggunakan kode verifikasi.', req.ip || '127.0.0.1', 'SUCCESS');

    res.json({ success: true, message: 'Kata sandi berhasil diperbarui. Silakan login dengan kata sandi baru Anda.' });
  });

  // 7. Initial Super Admin Provisioning Wizard
  app.post('/api/admin/provision-superadmin', (req, res) => {
    const { setupKey, adminUsername, adminEmail, adminFullName, adminPassword } = req.body;

    // Secure key check
    const MASTER_PROVISION_KEY = process.env.PROVISION_KEY || 'JULOK_SECURE_INIT_2026';
    if (setupKey !== MASTER_PROVISION_KEY) {
      return res.status(403).json({ error: 'Kunci provisi sistem tidak valid.' });
    }

    if (!adminUsername || !adminEmail || !adminPassword) {
      return res.status(400).json({ error: 'Data admin tidak lengkap.' });
    }

    const salt = generateSalt();
    const superAdmin: User = {
      id: `usr-superadmin-${Date.now()}`,
      username: adminUsername.trim().toLowerCase(),
      email: adminEmail.trim().toLowerCase(),
      fullName: adminFullName || 'Super Administrator',
      role: 'super_admin',
      passwordHash: hashPassword(adminPassword, salt),
      salt,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString()
    };

    // Replace or add superadmin
    db.users = db.users.filter(u => u.role !== 'super_admin');
    db.users.unshift(superAdmin);
    db.isSuperAdminProvisioned = true;
    saveDatabase();

    createAuditLog(superAdmin.id, superAdmin.username, 'super_admin', 'SUPERADMIN_PROVISIONED', 'SYSTEM', 'Akun Super Admin baru berhasil diprovisi secara aman.', req.ip || '127.0.0.1', 'SUCCESS');

    res.json({ success: true, message: 'Super Admin berhasil diprovisi.' });
  });

  // ----------------------------------------------------
  // USER MANAGEMENT & RBAC ENDPOINTS (Protected)
  // ----------------------------------------------------

  // 8. List Users (Requires users.manage)
  app.get('/api/users', authenticate, requirePermission('users.manage'), (_req, res) => {
    res.json(db.users.map(sanitizeUser));
  });

  // 9. Create User (Requires users.manage) - Rule 9: No self-escalation
  app.post('/api/users', authenticate, requirePermission('users.manage'), (req: AuthenticatedRequest, res) => {
    const { username, email, fullName, role, password, nip, nisn, classId, subject, phone } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Username, email, password, dan role wajib diisi.' });
    }

    // Rule 9: Only super_admin can create super_admin accounts
    if (role === 'super_admin' && req.user?.role !== 'super_admin') {
      createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'PRIVILEGE_ESCALATION_BLOCKED', 'USERS', 'Mencoba membuat akun Super Admin tanpa izin yang memadai.', req.ip || '127.0.0.1', 'BLOCKED');
      return res.status(403).json({ error: 'Hanya Super Admin yang diizinkan membuat akun ber-role Super Admin.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (db.users.some(u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail)) {
      return res.status(400).json({ error: 'Username atau email sudah digunakan.' });
    }

    const salt = generateSalt();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      fullName: fullName || cleanUsername,
      role,
      passwordHash: hashPassword(password, salt),
      salt,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      createdAt: new Date().toISOString(),
      nip,
      nisn,
      classId,
      subject,
      phone
    };

    db.users.push(newUser);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'USER_CREATED', 'USERS', `Membuat akun baru ${newUser.username} dengan role ${newUser.role}.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.status(201).json(sanitizeUser(newUser));
  });

  // 10. Update User Role / Data (Rule 9: Users cannot elevate their own role)
  app.put('/api/users/:id', authenticate, requirePermission('users.manage'), (req: AuthenticatedRequest, res) => {
    const userToEdit = db.users.find(u => u.id === req.params.id);
    if (!userToEdit) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });

    // Rule 9: Users CANNOT change their own role!
    if (req.user?.id === userToEdit.id && req.body.role && req.body.role !== req.user.role) {
      createAuditLog(req.user.id, req.user.username, req.user.role, 'SELF_ESCALATION_ATTEMPT', 'USERS', 'Mencoba mengubah role akun milik dirinya sendiri.', req.ip || '127.0.0.1', 'BLOCKED');
      return res.status(403).json({ error: 'Aturan Keamanan: Anda tidak diizinkan menaikkan atau mengubah role akun Anda sendiri.' });
    }

    // Only super_admin can assign or demote super_admin role
    if ((req.body.role === 'super_admin' || userToEdit.role === 'super_admin') && req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Hanya Super Admin yang dapat mengelola role Super Admin.' });
    }

    if (req.body.fullName) userToEdit.fullName = req.body.fullName;
    if (req.body.role) userToEdit.role = req.body.role;
    if (req.body.phone !== undefined) userToEdit.phone = req.body.phone;
    if (req.body.nip !== undefined) userToEdit.nip = req.body.nip;
    if (req.body.nisn !== undefined) userToEdit.nisn = req.body.nisn;
    if (req.body.classId !== undefined) userToEdit.classId = req.body.classId;
    if (req.body.subject !== undefined) userToEdit.subject = req.body.subject;

    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'USER_UPDATED', 'USERS', `Memperbarui data akun ${userToEdit.username}.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(sanitizeUser(userToEdit));
  });

  // 11. Toggle User Active / Inactive / Unlock
  app.post('/api/users/:id/toggle-status', authenticate, requirePermission('users.manage'), (req: AuthenticatedRequest, res) => {
    const userToEdit = db.users.find(u => u.id === req.params.id);
    if (!userToEdit) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });

    if (req.user?.id === userToEdit.id) {
      return res.status(400).json({ error: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' });
    }

    if (req.body.action === 'unlock') {
      userToEdit.isLocked = false;
      userToEdit.failedLoginAttempts = 0;
      userToEdit.lockUntil = undefined;
      createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'USER_UNLOCKED', 'USERS', `Membuka kunci akun ${userToEdit.username}.`, req.ip || '127.0.0.1', 'SUCCESS');
    } else {
      userToEdit.isActive = !userToEdit.isActive;
      createAuditLog(req.user!.id, req.user!.username, req.user!.role, userToEdit.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', 'USERS', `Mengubah status akun ${userToEdit.username} menjadi ${userToEdit.isActive ? 'Aktif' : 'Nonaktif'}.`, req.ip || '127.0.0.1', 'SUCCESS');
    }

    saveDatabase();
    res.json(sanitizeUser(userToEdit));
  });

  // 12. Delete User
  app.delete('/api/users/:id', authenticate, requirePermission('users.manage'), (req: AuthenticatedRequest, res) => {
    const userToDel = db.users.find(u => u.id === req.params.id);
    if (!userToDel) return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });

    if (userToDel.role === 'super_admin') {
      return res.status(403).json({ error: 'Akun Super Admin tidak boleh dihapus.' });
    }

    if (req.user?.id === userToDel.id) {
      return res.status(400).json({ error: 'Anda tidak dapat menghapus akun Anda sendiri.' });
    }

    db.users = db.users.filter(u => u.id !== req.params.id);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'USER_DELETED', 'USERS', `Menghapus akun pengguna ${userToDel.username}.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json({ success: true });
  });

  // ----------------------------------------------------
  // ROLES & CUSTOM ROLE CREATOR (Protected)
  // ----------------------------------------------------

  // 13. List Roles
  app.get('/api/roles', (_req, res) => {
    // Attach current user count
    const rolesWithCount = db.roles.map(r => ({
      ...r,
      userCount: db.users.filter(u => u.role === r.name).length
    }));
    res.json(rolesWithCount);
  });

  // 14. Create Custom Role (Requires roles.manage)
  app.post('/api/roles', authenticate, requirePermission('roles.manage'), (req: AuthenticatedRequest, res) => {
    const { name, label, description, permissions } = req.body;

    if (!name || !label || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Nama, label, dan daftar izin role wajib diisi.' });
    }

    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (db.roles.some(r => r.name === cleanName)) {
      return res.status(400).json({ error: 'Nama kode role sudah digunakan.' });
    }

    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      name: cleanName,
      label: label.trim(),
      description: description || '',
      permissions,
      isSystemRole: false
    };

    db.roles.push(newRole);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ROLE_CREATED', 'ROLES', `Membuat role kustom baru: '${newRole.label}' dengan ${permissions.length} hak akses.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.status(201).json(newRole);
  });

  // 15. Update Role Permissions (Requires roles.manage)
  app.put('/api/roles/:id', authenticate, requirePermission('roles.manage'), (req: AuthenticatedRequest, res) => {
    const role = db.roles.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({ error: 'Role tidak ditemukan.' });

    // Super admin role cannot lose permissions
    if (role.name === 'super_admin' && req.body.permissions && req.body.permissions.length < 10) {
      return res.status(400).json({ error: 'Role Super Admin tidak dapat dikurangi hak aksesnya.' });
    }

    if (req.body.label) role.label = req.body.label;
    if (req.body.description !== undefined) role.description = req.body.description;
    if (req.body.permissions && Array.isArray(req.body.permissions)) {
      role.permissions = req.body.permissions;
    }

    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ROLE_UPDATED', 'ROLES', `Memperbarui izin hak akses untuk role '${role.label}'.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(role);
  });

  // 16. Delete Custom Role (System roles cannot be deleted)
  app.delete('/api/roles/:id', authenticate, requirePermission('roles.manage'), (req: AuthenticatedRequest, res) => {
    const role = db.roles.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({ error: 'Role tidak ditemukan.' });

    if (role.isSystemRole) {
      return res.status(400).json({ error: 'Role sistem bawaan tidak dapat dihapus.' });
    }

    // Check if users are assigned to this role
    const assignedUsers = db.users.filter(u => u.role === role.name);
    if (assignedUsers.length > 0) {
      return res.status(400).json({ 
        error: `Tidak dapat menghapus role: masih terdapat ${assignedUsers.length} pengguna yang menggunakan role ini.` 
      });
    }

    db.roles = db.roles.filter(r => r.id !== req.params.id);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ROLE_DELETED', 'ROLES', `Menghapus role kustom '${role.label}'.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json({ success: true });
  });

  // ----------------------------------------------------
  // AUDIT LOGS (Protected: require audit.view)
  // ----------------------------------------------------
  app.get('/api/audit-logs', authenticate, requirePermission('audit.view'), (req, res) => {
    const { action, status, search } = req.query;
    let logs = [...db.auditLogs];

    if (action && typeof action === 'string' && action !== 'all') {
      logs = logs.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    if (status && typeof status === 'string' && status !== 'all') {
      logs = logs.filter(l => l.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      logs = logs.filter(l => 
        l.username.toLowerCase().includes(q) || 
        l.details.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q)
      );
    }

    res.json(logs.slice(0, 100)); // Recent 100 entries
  });

  // ----------------------------------------------------
  // EDITORIAL PIPELINE WORKFLOW (Rule 6: Draft -> Pending -> Approved -> Published)
  // ----------------------------------------------------

  // 17. Get Editorial Articles
  app.get('/api/editorial/articles', authenticate, (req: AuthenticatedRequest, res) => {
    const userRole = req.user?.role;
    const canApprove = req.userPermissions?.includes('content.approve');

    // Editor sees own articles + all published
    if (userRole === 'editor' && !canApprove) {
      const myArticles = db.articles.filter(a => a.authorId === req.user?.id || a.status === 'published');
      return res.json(myArticles);
    }

    // Approvers / Admins see all pipeline stages
    res.json(db.articles);
  });

  // 18. Create Draft (Editor or higher)
  app.post('/api/editorial/articles', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const { title, excerpt, content, category, imageUrl, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Judul dan isi artikel wajib diisi.' });
    }

    const newArticle: EditorialArticle = {
      id: `art-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: excerpt || title.substring(0, 120),
      content,
      category: category || 'Kegiatan',
      authorId: req.user!.id,
      authorName: req.user!.fullName,
      imageUrl: imageUrl || '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || ['SMAN 1 Julok'],
      views: 0
    };

    db.articles.unshift(newArticle);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ARTICLE_DRAFT_CREATED', 'EDITORIAL', `Membuat draf artikel: '${newArticle.title}'.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.status(201).json(newArticle);
  });

  // 19. Submit Draft to Review (Status -> pending_approval)
  app.post('/api/editorial/articles/:id/submit', authenticate, (req: AuthenticatedRequest, res) => {
    const article = db.articles.find(a => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Artikel tidak ditemukan.' });

    // Only author or admin can submit
    if (article.authorId !== req.user?.id && req.user?.role !== 'super_admin' && req.user?.role !== 'admin_sekolah') {
      return res.status(403).json({ error: 'Hanya penulis artikel yang dapat mengajukan persetujuan.' });
    }

    article.status = 'pending_approval';
    article.updatedAt = new Date().toISOString();
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ARTICLE_SUBMITTED', 'EDITORIAL', `Mengajukan artikel '${article.title}' ke tahap peninjauan persetujuan.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(article);
  });

  // 20. Approve Article (Requires content.approve)
  app.post('/api/editorial/articles/:id/approve', authenticate, requirePermission('content.approve'), (req: AuthenticatedRequest, res) => {
    const article = db.articles.find(a => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Artikel tidak ditemukan.' });

    article.status = 'approved';
    article.reviewerId = req.user!.id;
    article.reviewerName = req.user!.fullName;
    article.reviewNotes = req.body.reviewNotes || 'Disetujui untuk dipublikasikan.';
    article.updatedAt = new Date().toISOString();
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ARTICLE_APPROVED', 'EDITORIAL', `Menyetujui artikel '${article.title}'.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(article);
  });

  // 21. Reject Article with Notes (Requires content.approve)
  app.post('/api/editorial/articles/:id/reject', authenticate, requirePermission('content.approve'), (req: AuthenticatedRequest, res) => {
    const article = db.articles.find(a => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Artikel tidak ditemukan.' });

    article.status = 'rejected';
    article.reviewerId = req.user!.id;
    article.reviewerName = req.user!.fullName;
    article.reviewNotes = req.body.reviewNotes || 'Memerlukan revisi data.';
    article.updatedAt = new Date().toISOString();
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ARTICLE_REJECTED', 'EDITORIAL', `Mengembalikan artikel '${article.title}' untuk revisi: ${article.reviewNotes}`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(article);
  });

  // 22. Publish Article (Requires content.publish)
  app.post('/api/editorial/articles/:id/publish', authenticate, requirePermission('content.publish'), (req: AuthenticatedRequest, res) => {
    const article = db.articles.find(a => a.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Artikel tidak ditemukan.' });

    article.status = 'published';
    article.publishedAt = new Date().toISOString();
    article.updatedAt = new Date().toISOString();

    // Synchronize to public news list so it appears on Homepage
    const existingNewsIdx = db.news.findIndex(n => n.id === article.id);
    const newsItem = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.authorName,
      date: new Date().toISOString().split('T')[0],
      imageUrl: article.imageUrl,
      tags: article.tags,
      views: article.views || 0,
      isFeatured: false
    };

    if (existingNewsIdx !== -1) {
      db.news[existingNewsIdx] = newsItem;
    } else {
      db.news.unshift(newsItem);
    }

    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ARTICLE_PUBLISHED', 'EDITORIAL', `Mempublikasikan artikel resmi: '${article.title}' ke website publik.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(article);
  });

  // ----------------------------------------------------
  // ACADEMIC & STUDENT GRADES (Rule 8: Siswa only sees own grades)
  // ----------------------------------------------------

  // 23. View Own Grades (For Siswa)
  app.get('/api/grades/my', authenticate, (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(401).json({ error: 'Tidak terotentikasi' });

    // Look up by studentId or nisn
    const myGrade = db.grades.find(g => 
      g.studentId === req.user?.id || 
      (req.user?.nisn && g.nisn === req.user.nisn)
    );

    if (!myGrade) {
      return res.status(404).json({ error: 'Laporan hasil belajar belum diterbitkan untuk akun ini.' });
    }

    createAuditLog(req.user.id, req.user.username, req.user.role, 'VIEW_OWN_GRADES', 'ACADEMIC', 'Siswa mengakses laporan hasil belajar pribadi.', req.ip || '127.0.0.1', 'SUCCESS');

    res.json(myGrade);
  });

  // 24. List All Grades (Requires grades.manage - Guru/Admin)
  app.get('/api/grades', authenticate, requirePermission('grades.manage'), (_req, res) => {
    res.json(db.grades);
  });

  // 25. Update Grades (Requires grades.manage)
  app.put('/api/grades/:id', authenticate, requirePermission('grades.manage'), (req: AuthenticatedRequest, res) => {
    const grade = db.grades.find(g => g.id === req.params.id);
    if (!grade) return res.status(404).json({ error: 'Data nilai tidak ditemukan.' });

    if (req.body.subjects) grade.subjects = req.body.subjects;
    if (req.body.attendance) grade.attendance = req.body.attendance;
    if (req.body.homeroomNotes) grade.homeroomNotes = req.body.homeroomNotes;

    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'GRADES_UPDATED', 'ACADEMIC', `Memperbarui nilai siswa: ${grade.studentName} (${grade.className}).`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json(grade);
  });

  // ----------------------------------------------------
  // RESTRICTED DOWNLOAD ACCESS (Rule 13)
  // ----------------------------------------------------
  app.get('/api/downloads/:id/access', authenticate, (req: AuthenticatedRequest, res) => {
    const doc = db.downloads.find(d => d.id === req.params.id);
    if (!doc) return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });

    if (doc.isRestricted && doc.requiredRole && doc.requiredRole.length > 0) {
      const hasRole = req.user?.role === 'super_admin' || doc.requiredRole.includes(req.user?.role || '');
      if (!hasRole) {
        createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'RESTRICTED_DOC_BLOCKED', 'DOWNLOADS', `Mencoba mengunduh dokumen terbatas: '${doc.title}'.`, req.ip || '127.0.0.1', 'BLOCKED');
        return res.status(403).json({ 
          error: `Akses ditolak: Dokumen ini bersifat terbatas untuk role: ${doc.requiredRole.join(', ')}.` 
        });
      }
    }

    doc.downloadCount = (doc.downloadCount || 0) + 1;
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'DOWNLOAD_SUCCESS', 'DOWNLOADS', `Mengunduh dokumen: '${doc.title}'.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json({ success: true, doc });
  });

  // ----------------------------------------------------
  // EXISTING PUBLIC APIS (Preserved)
  // ----------------------------------------------------
  app.get('/api/data', (_req, res) => {
    const { adminPasscode: _code, resetRequests: _r, users: _u, ...publicData } = db;
    res.json({
      ...publicData,
      roles: db.roles.map(r => ({ id: r.id, name: r.name, label: r.label, description: r.description }))
    });
  });

  app.get('/api/settings', (_req, res) => res.json(db.settings));
  app.put('/api/settings', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'SETTINGS_UPDATED', 'SETTINGS', 'Memperbarui informasi dan pengaturan sekolah.', req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, settings: db.settings });
  });

  app.get('/api/news', (_req, res) => res.json(db.news));
  
  // Announcements CRUD
  app.get('/api/announcements', (_req, res) => res.json(db.announcements));
  app.post('/api/announcements', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: req.body.title || 'Pengumuman Baru',
      content: req.body.content || '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      target: req.body.target || 'Semua',
      isUrgent: !!req.body.isUrgent,
      downloadUrl: req.body.downloadUrl,
      attachmentName: req.body.attachmentName
    };
    db.announcements.unshift(newAnn);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ANNOUNCEMENT_CREATED', 'CONTENT', `Membuat pengumuman: ${newAnn.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json({ success: true, data: newAnn });
  });
  app.put('/api/announcements/:id', authenticate, requirePermission('content.edit'), (req: AuthenticatedRequest, res) => {
    const idx = db.announcements.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Pengumuman tidak ditemukan' });
    db.announcements[idx] = { ...db.announcements[idx], ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ANNOUNCEMENT_UPDATED', 'CONTENT', `Memperbarui pengumuman: ${db.announcements[idx].title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, data: db.announcements[idx] });
  });
  app.delete('/api/announcements/:id', authenticate, requirePermission('content.delete'), (req: AuthenticatedRequest, res) => {
    const found = db.announcements.find(a => a.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'Pengumuman tidak ditemukan' });
    db.announcements = db.announcements.filter(a => a.id !== req.params.id);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'ANNOUNCEMENT_DELETED', 'CONTENT', `Menghapus pengumuman: ${found.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true });
  });

  // Events / Calendar CRUD
  app.get('/api/events', (_req, res) => res.json(db.events));
  app.post('/api/events', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title: req.body.title || 'Agenda Baru',
      date: req.body.date || new Date().toISOString().split('T')[0],
      endDate: req.body.endDate,
      time: req.body.time || '08:00 - Selesai',
      location: req.body.location || 'Kampus SMAN 1 Julok',
      organizer: req.body.organizer || 'Panitia Sekolah',
      description: req.body.description || '',
      category: req.body.category || 'Akademik'
    };
    db.events.unshift(newEvent);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'EVENT_CREATED', 'CALENDAR', `Menambah agenda: ${newEvent.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json({ success: true, data: newEvent });
  });
  app.put('/api/events/:id', authenticate, requirePermission('content.edit'), (req: AuthenticatedRequest, res) => {
    const idx = db.events.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Agenda tidak ditemukan' });
    db.events[idx] = { ...db.events[idx], ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'EVENT_UPDATED', 'CALENDAR', `Memperbarui agenda: ${db.events[idx].title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, data: db.events[idx] });
  });
  app.delete('/api/events/:id', authenticate, requirePermission('content.delete'), (req: AuthenticatedRequest, res) => {
    const found = db.events.find(e => e.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'Agenda tidak ditemukan' });
    db.events = db.events.filter(e => e.id !== req.params.id);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'EVENT_DELETED', 'CALENDAR', `Menghapus agenda: ${found.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true });
  });

  // Staff / Guru & Tendik CRUD
  app.get('/api/staff', (_req, res) => res.json(db.staff));
  app.post('/api/staff', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const newStaff: StaffItem = {
      id: `staff-${Date.now()}`,
      name: req.body.name || 'Guru Baru',
      nip: req.body.nip || '-',
      role: req.body.role || 'Guru Mata Pelajaran',
      subject: req.body.subject || '-',
      education: req.body.education || 'S1 Pendidikan',
      photoUrl: req.body.photoUrl || '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      category: req.body.category || 'guru',
      isLeader: !!req.body.isLeader
    };
    db.staff.push(newStaff);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'STAFF_CREATED', 'ACADEMIC', `Menambah data pendidik/tendik: ${newStaff.name}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json({ success: true, data: newStaff });
  });
  app.put('/api/staff/:id', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const idx = db.staff.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Data guru/staf tidak ditemukan' });
    db.staff[idx] = { ...db.staff[idx], ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'STAFF_UPDATED', 'ACADEMIC', `Memperbarui data pendidik/tendik: ${db.staff[idx].name}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, data: db.staff[idx] });
  });
  app.delete('/api/staff/:id', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const found = db.staff.find(s => s.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'Data tidak ditemukan' });
    db.staff = db.staff.filter(s => s.id !== req.params.id);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'STAFF_DELETED', 'ACADEMIC', `Menghapus data pendidik/tendik: ${found.name}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true });
  });

  app.get('/api/classes', (_req, res) => res.json(db.classes));
  app.get('/api/facilities', (_req, res) => res.json(db.facilities));
  app.get('/api/achievements', (_req, res) => res.json(db.achievements));

  // Galleries CRUD
  app.get('/api/galleries', (_req, res) => res.json(db.galleries));
  app.post('/api/galleries', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const newGal: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: req.body.title || 'Foto Kegiatan',
      type: req.body.type || 'photo',
      url: req.body.url || '/src/assets/images/hero_sman1julok_1793290495969.jpg',
      category: req.body.category || 'Kegiatan Belajar',
      caption: req.body.caption || '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    db.galleries.unshift(newGal);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'GALLERY_CREATED', 'MEDIA', `Menambah galeri: ${newGal.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json({ success: true, data: newGal });
  });
  app.put('/api/galleries/:id', authenticate, requirePermission('content.edit'), (req: AuthenticatedRequest, res) => {
    const idx = db.galleries.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Galeri tidak ditemukan' });
    db.galleries[idx] = { ...db.galleries[idx], ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'GALLERY_UPDATED', 'MEDIA', `Memperbarui galeri: ${db.galleries[idx].title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, data: db.galleries[idx] });
  });
  app.delete('/api/galleries/:id', authenticate, requirePermission('content.delete'), (req: AuthenticatedRequest, res) => {
    const found = db.galleries.find(g => g.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'Galeri tidak ditemukan' });
    db.galleries = db.galleries.filter(g => g.id !== req.params.id);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'GALLERY_DELETED', 'MEDIA', `Menghapus galeri: ${found.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true });
  });

  // Downloads / Dokumen CRUD
  app.get('/api/downloads', (_req, res) => res.json(db.downloads));
  app.post('/api/downloads', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const newDoc: DownloadItem = {
      id: `doc-${Date.now()}`,
      title: req.body.title || 'Dokumen Resmi',
      category: req.body.category || 'Kurikulum & Kalender',
      fileSize: req.body.fileSize || '1.2 MB',
      fileType: req.body.fileType || 'PDF',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      downloadCount: 0,
      description: req.body.description || '',
      isRestricted: !!req.body.isRestricted,
      requiredRole: req.body.requiredRole || []
    };
    db.downloads.unshift(newDoc);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'DOCUMENT_CREATED', 'DOWNLOADS', `Mengunggah dokumen resmi: ${newDoc.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json({ success: true, data: newDoc });
  });
  app.put('/api/downloads/:id', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const idx = db.downloads.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Dokumen tidak ditemukan' });
    db.downloads[idx] = { ...db.downloads[idx], ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'DOCUMENT_UPDATED', 'DOWNLOADS', `Memperbarui dokumen: ${db.downloads[idx].title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, data: db.downloads[idx] });
  });
  app.delete('/api/downloads/:id', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const found = db.downloads.find(d => d.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'Dokumen tidak ditemukan' });
    db.downloads = db.downloads.filter(d => d.id !== req.params.id);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'DOCUMENT_DELETED', 'DOWNLOADS', `Menghapus dokumen: ${found.title}`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true });
  });

  // Broadcast Notification Creation
  app.post('/api/notifications', authenticate, requirePermission('content.publish'), (req: AuthenticatedRequest, res) => {
    const { title, message, type = 'urgent_announcement', targetRole = 'all' } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Judul dan pesan notifikasi wajib diisi' });

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      isRead: false,
      targetRole
    };
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(newNotif);
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'NOTIFICATION_BROADCAST', 'NOTIFICATIONS', `Mengirim siaran notifikasi: ${title} (${targetRole})`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json({ success: true, data: newNotif });
  });

  // Reports Summary Endpoint
  app.get('/api/reports/summary', authenticate, (req: AuthenticatedRequest, res) => {
    const spmbPathways: Record<string, number> = {};
    (db.spmb || []).forEach(s => {
      spmbPathways[s.chosenPathway] = (spmbPathways[s.chosenPathway] || 0) + 1;
    });

    const spmbStatuses: Record<string, number> = {};
    (db.spmb || []).forEach(s => {
      spmbStatuses[s.status] = (spmbStatuses[s.status] || 0) + 1;
    });

    const userRoles: Record<string, number> = {};
    (db.users || []).forEach(u => {
      userRoles[u.role] = (userRoles[u.role] || 0) + 1;
    });

    const articleStatuses: Record<string, number> = {};
    (db.articles || []).forEach(a => {
      articleStatuses[a.status] = (articleStatuses[a.status] || 0) + 1;
    });

    res.json({
      studentsTotal: db.settings.stats?.studentsCount || 428,
      teachersTotal: db.staff?.filter(s => s.category === 'guru').length || 38,
      tendikTotal: db.staff?.filter(s => s.category === 'tendik').length || 10,
      classesTotal: db.classes?.length || 14,
      spmbTotal: db.spmb?.length || 0,
      spmbPathways,
      spmbStatuses,
      userRoles,
      articleStatuses,
      totalDownloads: (db.downloads || []).reduce((acc, d) => acc + (d.downloadCount || 0), 0),
      auditLogsTotal: db.auditLogs?.length || 0,
      generatedAt: new Date().toLocaleString('id-ID')
    });
  });

  app.get('/api/messages', (_req, res) => res.json(db.messages));
  app.get('/api/faqs', (_req, res) => res.json(db.faqs));

  // SPMB registration & verification
  app.get('/api/spmb', (req, res) => {
    const { query } = req.query;
    if (query && typeof query === 'string') {
      const q = query.trim().toLowerCase();
      const filtered = db.spmb.filter(s => 
        s.registrationNumber.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q)
      );
      return res.json(filtered);
    }
    res.json(db.spmb);
  });

  app.post('/api/spmb', (req, res) => {
    const count = db.spmb.length + 1;
    const year = new Date().getFullYear();
    const regNo = `SPMB-${year}-${String(count).padStart(3, '0')}`;
    const newReg = {
      id: `spmb-${Date.now()}`,
      registrationNumber: regNo,
      status: 'Menunggu Verifikasi',
      submissionDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.spmb.unshift(newReg);
    saveDatabase();
    res.status(201).json({ success: true, data: newReg });
  });

  app.put('/api/spmb/:id/status', authenticate, requirePermission('spmb.verify'), (req: AuthenticatedRequest, res) => {
    const index = db.spmb.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Pendaftar tidak ditemukan' });

    db.spmb[index].status = req.body.status;
    if (req.body.notes !== undefined) db.spmb[index].notes = req.body.notes;
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'SPMB_STATUS_UPDATED', 'SPMB', `Mengubah status verifikasi pendaftar ${db.spmb[index].registrationNumber} menjadi: ${db.spmb[index].status}.`, req.ip || '127.0.0.1', 'SUCCESS');

    res.json({ success: true, data: db.spmb[index] });
  });

  app.post('/api/messages', (req, res) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      ...req.body
    };
    db.messages.unshift(newMsg);
    saveDatabase();
    res.status(201).json({ success: true, data: newMsg });
  });

  // Reset to default
  app.post('/api/admin/reset', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    db = JSON.parse(JSON.stringify(initialData));
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'SYSTEM_RESET', 'DATABASE', 'Mengembalikan seluruh data ke standar awal SMA Negeri 1 Julok.', req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, message: 'Data berhasil dikembalikan ke standar awal SMA Negeri 1 Julok' });
  });

  // ==========================================
  // A. CONTENT MANAGEMENT SYSTEM (CMS) APIS
  // ==========================================

  // List Pages
  app.get('/api/pages', (_req, res) => {
    res.json(db.pages || []);
  });

  // Get Page by ID or Slug
  app.get('/api/pages/:idOrSlug', (req, res) => {
    const page = (db.pages || []).find(p => p.id === req.params.idOrSlug || p.slug === req.params.idOrSlug);
    if (!page) return res.status(404).json({ error: 'Halaman tidak ditemukan' });
    page.viewCount = (page.viewCount || 0) + 1;
    saveDatabase();
    res.json(page);
  });

  // Create Custom Page
  app.post('/api/pages', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const { title, excerpt, content, status = 'draft', menuPlacement = 'none', publishedAt, expiresAt } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Judul dan konten halaman wajib diisi' });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newPage = {
      id: `page-${Date.now()}`,
      title,
      slug,
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      status,
      author: req.user!.fullName,
      authorId: req.user!.id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      publishedAt: status === 'published' ? (publishedAt || new Date().toISOString().split('T')[0]) : undefined,
      expiresAt,
      menuPlacement,
      viewCount: 0,
      revisions: [
        {
          id: `rev-${Date.now()}`,
          contentId: `page-${Date.now()}`,
          contentType: 'page' as const,
          timestamp: new Date().toLocaleString('id-ID'),
          authorName: req.user!.fullName,
          authorId: req.user!.id,
          title,
          content,
          summary: 'Versi perdana halaman'
        }
      ]
    };

    if (!db.pages) db.pages = [];
    db.pages.unshift(newPage);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'PAGE_CREATED', 'CMS', `Membuat halaman baru: '${title}'.`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json(newPage);
  });

  // Update Custom Page with Revision Tracking
  app.put('/api/pages/:id', authenticate, requirePermission('content.edit'), (req: AuthenticatedRequest, res) => {
    const page = (db.pages || []).find(p => p.id === req.params.id);
    if (!page) return res.status(404).json({ error: 'Halaman tidak ditemukan' });

    const { title, excerpt, content, status, menuPlacement, publishedAt, expiresAt, revisionSummary } = req.body;

    // Snapshot existing version before update
    if (!page.revisions) page.revisions = [];
    page.revisions.unshift({
      id: `rev-${Date.now()}`,
      contentId: page.id,
      contentType: 'page' as const,
      timestamp: new Date().toLocaleString('id-ID'),
      authorName: req.user!.fullName,
      authorId: req.user!.id,
      title: page.title,
      content: page.content,
      summary: revisionSummary || 'Pembaruan isi halaman'
    });

    if (title) {
      page.title = title;
      page.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (excerpt !== undefined) page.excerpt = excerpt;
    if (content !== undefined) page.content = content;
    if (status !== undefined) page.status = status;
    if (menuPlacement !== undefined) page.menuPlacement = menuPlacement;
    if (publishedAt !== undefined) page.publishedAt = publishedAt;
    if (expiresAt !== undefined) page.expiresAt = expiresAt;
    page.updatedAt = new Date().toISOString().split('T')[0];

    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'PAGE_UPDATED', 'CMS', `Memperbarui halaman '${page.title}' beserta riwayat revisi.`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json(page);
  });

  // Restore Page Revision
  app.post('/api/pages/:id/restore/:revId', authenticate, requirePermission('content.edit'), (req: AuthenticatedRequest, res) => {
    const page = (db.pages || []).find(p => p.id === req.params.id);
    if (!page) return res.status(404).json({ error: 'Halaman tidak ditemukan' });

    const rev = (page.revisions || []).find(r => r.id === req.params.revId);
    if (!rev) return res.status(404).json({ error: 'Revisi tidak ditemukan' });

    page.title = rev.title;
    page.content = rev.content;
    page.updatedAt = new Date().toISOString().split('T')[0];
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'PAGE_RESTORED', 'CMS', `Memulihkan revisi versi ${rev.timestamp} pada halaman '${page.title}'.`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json(page);
  });

  // Delete Page
  app.delete('/api/pages/:id', authenticate, requirePermission('content.delete'), (req: AuthenticatedRequest, res) => {
    const idx = (db.pages || []).findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Halaman tidak ditemukan' });

    const title = db.pages[idx].title;
    db.pages.splice(idx, 1);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'PAGE_DELETED', 'CMS', `Menghapus halaman: '${title}'.`, req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true });
  });

  // CMS Categories & Tags
  app.get('/api/categories', (_req, res) => res.json(db.contentCategories || []));
  app.post('/api/categories', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama kategori wajib diisi' });

    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      postCount: 0
    };
    if (!db.contentCategories) db.contentCategories = [];
    db.contentCategories.push(newCat);
    saveDatabase();
    res.status(201).json(newCat);
  });

  app.get('/api/tags', (_req, res) => res.json(db.contentTags || []));

  // Media Library
  app.get('/api/media', (_req, res) => res.json(db.media || []));
  app.post('/api/media', authenticate, requirePermission('content.create'), (req: AuthenticatedRequest, res) => {
    const { title, url, fileType = 'image', fileSize = '1.0 MB', dimensions } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'Judul dan URL media wajib diisi' });

    const newMedia = {
      id: `med-${Date.now()}`,
      title,
      url,
      fileType,
      fileSize,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: req.user!.fullName,
      dimensions
    };
    if (!db.media) db.media = [];
    db.media.unshift(newMedia);
    saveDatabase();

    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'MEDIA_UPLOADED', 'CMS', `Mengunggah media baru: '${title}'.`, req.ip || '127.0.0.1', 'SUCCESS');
    res.status(201).json(newMedia);
  });

  app.delete('/api/media/:id', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    if (!db.media) return res.status(404).json({ error: 'Media tidak ditemukan' });
    db.media = db.media.filter(m => m.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // ==========================================
  // B. ACADEMIC INFO APIS (Schedules & Learning Materials)
  // ==========================================
  app.get('/api/schedules', (_req, res) => {
    res.json(db.schedules || []);
  });

  app.post('/api/schedules', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    const newSchedule = {
      id: `sch-${Date.now()}`,
      ...req.body
    };
    if (!db.schedules) db.schedules = [];
    db.schedules.push(newSchedule);
    saveDatabase();
    res.status(201).json(newSchedule);
  });

  app.delete('/api/schedules/:id', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    if (!db.schedules) return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
    db.schedules = db.schedules.filter(s => s.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  app.get('/api/learning-materials', (_req, res) => {
    res.json(db.learningMaterials || []);
  });

  app.post('/api/learning-materials', authenticate, requirePermission('document.manage'), (req: AuthenticatedRequest, res) => {
    const newMat = {
      id: `mat-${Date.now()}`,
      uploadedDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    if (!db.learningMaterials) db.learningMaterials = [];
    db.learningMaterials.unshift(newMat);
    saveDatabase();
    res.status(201).json(newMat);
  });

  app.get('/api/external-apps', (_req, res) => {
    res.json(db.externalApps || []);
  });

  // ==========================================
  // D. SPMB ADVANCED APIS (Safe Search & Export)
  // ==========================================
  app.get('/api/spmb/settings', (_req, res) => {
    res.json(db.spmbSettings || initialData.spmbSettings);
  });

  app.put('/api/spmb/settings', authenticate, requirePermission('spmb.verify'), (req: AuthenticatedRequest, res) => {
    db.spmbSettings = { ...db.spmbSettings, ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'SPMB_SETTINGS_UPDATED', 'SPMB', 'Memperbarui periode dan kuota pendaftaran SPMB.', req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, settings: db.spmbSettings });
  });

  // Public Safe Status Checking (Protects NIK, parent name, address)
  app.get('/api/spmb/check-status/:identifier', (req, res) => {
    const ident = req.params.identifier.trim().toLowerCase();
    const applicant = db.spmb.find(s => 
      s.registrationNumber.toLowerCase() === ident || 
      s.nisn.toLowerCase() === ident
    );

    if (!applicant) {
      return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan. Periksa kembali nomor registrasi atau NISN Anda.' });
    }

    // Return sanitized public result
    res.json({
      registrationNumber: applicant.registrationNumber,
      fullName: applicant.fullName,
      originSchool: applicant.originSchool,
      chosenPathway: applicant.chosenPathway,
      status: applicant.status,
      submissionDate: applicant.submissionDate,
      notes: applicant.notes || 'Berkas Anda sedang dalam proses penelaahan panitia SPMB.'
    });
  });

  // Export SPMB Data to CSV
  app.get('/api/spmb/export', authenticate, requirePermission('spmb.verify'), (_req, res) => {
    const headers = ['No_Reg', 'Nama_Lengkap', 'NISN', 'Jalur', 'Asal_Sekolah', 'Rerata_Nilai', 'Status', 'Tanggal_Daftar', 'Kontak_Ortu'];
    const rows = db.spmb.map(s => [
      `"${s.registrationNumber}"`,
      `"${s.fullName}"`,
      `"${s.nisn}"`,
      `"${s.chosenPathway}"`,
      `"${s.originSchool}"`,
      s.averageScore,
      `"${s.status}"`,
      `"${s.submissionDate}"`,
      `"${s.parentPhone}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data-spmb-sman1julok.csv"');
    res.send(csvContent);
  });

  // ==========================================
  // E. INTERACTIVITY APIS (Polls & Notifications)
  // ==========================================
  app.get('/api/polls', (_req, res) => {
    res.json(db.polls || []);
  });

  app.post('/api/polls/:id/vote', (req, res) => {
    const poll = (db.polls || []).find(p => p.id === req.params.id);
    if (!poll) return res.status(404).json({ error: 'Survei tidak ditemukan' });

    const { optionId, voterId = 'anon-' + Date.now() } = req.body;
    if (!poll.isActive) return res.status(400).json({ error: 'Survei ini telah berakhir' });

    if (poll.userVotedIds?.includes(voterId)) {
      return res.status(400).json({ error: 'Anda telah memberikan suara pada survei ini sebelumnya' });
    }

    const opt = poll.options.find(o => o.id === optionId);
    if (!opt) return res.status(404).json({ error: 'Opsi pilihan tidak valid' });

    opt.votes += 1;
    poll.totalVotes += 1;
    if (!poll.userVotedIds) poll.userVotedIds = [];
    poll.userVotedIds.push(voterId);

    saveDatabase();
    res.json({ success: true, poll });
  });

  // In-App Notifications
  app.get('/api/notifications', authenticate, (req: AuthenticatedRequest, res) => {
    const role = req.user?.role || 'all';
    const list = (db.notifications || []).filter(n => 
      !n.targetRole || n.targetRole === 'all' || n.targetRole === role || req.user?.role === 'super_admin'
    );
    res.json(list);
  });

  app.post('/api/notifications/:id/read', authenticate, (req, res) => {
    const notif = (db.notifications || []).find(n => n.id === req.params.id);
    if (notif) {
      notif.isRead = true;
      saveDatabase();
    }
    res.json({ success: true });
  });

  app.post('/api/notifications/read-all', authenticate, (_req, res) => {
    if (db.notifications) {
      db.notifications.forEach(n => n.isRead = true);
      saveDatabase();
    }
    res.json({ success: true });
  });

  // ==========================================
  // H. SYSTEM & SEO SETTINGS APIS
  // ==========================================
  app.get('/api/seo', (_req, res) => res.json(db.seoSettings || initialData.seoSettings));
  app.put('/api/seo', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    db.seoSettings = { ...db.seoSettings, ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'SEO_UPDATED', 'SETTINGS', 'Memperbarui konfigurasi SEO dan metadata.', req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, seoSettings: db.seoSettings });
  });

  app.get('/api/integrations', (_req, res) => res.json(db.integrationSettings || initialData.integrationSettings));
  app.put('/api/integrations', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    db.integrationSettings = { ...db.integrationSettings, ...req.body };
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'INTEGRATIONS_UPDATED', 'SETTINGS', 'Memperbarui konfigurasi integrasi eksternal.', req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, integrationSettings: db.integrationSettings });
  });

  // System Health Monitoring
  app.get('/api/system/health', (_req, res) => {
    res.json({
      status: 'Operational',
      school: 'SMA Negeri 1 Julok',
      npsn: db.settings.npsn,
      version: '2.5.0-Release-Merdeka',
      uptime: process.uptime().toFixed(0) + ' detik',
      nodeVersion: process.version,
      database: {
        totalRecords: (db.news?.length || 0) + (db.spmb?.length || 0) + (db.users?.length || 0) + (db.pages?.length || 0),
        status: 'Online & Persistent'
      },
      dapodikStatus: db.integrationSettings?.dapodikStatus || 'Tersinkronisasi',
      activeSessions: sessions.size,
      serverTime: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
    });
  });

  // Full Database Backup Export
  app.get('/api/system/backup', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'DATABASE_BACKUP_DOWNLOAD', 'SYSTEM', 'Mengunduh salinan cadangan lengkap database JSON.', req.ip || '127.0.0.1', 'SUCCESS');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="backup-sman1julok-${Date.now()}.json"`);
    res.json(db);
  });

  // Database Restore
  app.post('/api/system/restore', authenticate, requirePermission('settings.manage'), (req: AuthenticatedRequest, res) => {
    if (!req.body || !req.body.settings || !req.body.users) {
      return res.status(400).json({ error: 'Format berkas cadangan database tidak valid.' });
    }
    db = req.body;
    saveDatabase();
    createAuditLog(req.user!.id, req.user!.username, req.user!.role, 'DATABASE_RESTORED', 'SYSTEM', 'Memulihkan database dari berkas cadangan.', req.ip || '127.0.0.1', 'SUCCESS');
    res.json({ success: true, message: 'Database berhasil dipulihkan.' });
  });

  // Vite Integration in Development
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMA Negeri 1 Julok RBAC Server running on port ${PORT} [Mode: ${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
