import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FileCheck, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Download, 
  ShieldCheck, 
  User as UserIcon, 
  Calendar,
  Sparkles,
  Search,
  FileText
} from 'lucide-react';
import { User, StudentGradeRecord, DatabaseSchema, DownloadItem } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface GuruDashboardProps {
  currentUser: User;
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string) => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  currentUser,
  data,
  onRefresh,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'rapor' | 'materials'>('rapor');
  const [gradeRecords, setGradeRecords] = useState<StudentGradeRecord[]>(data.grades || []);
  const [selectedRecord, setSelectedRecord] = useState<StudentGradeRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [searchStudent, setSearchStudent] = useState('');

  // Confidential materials access
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [accessedDoc, setAccessedDoc] = useState<DownloadItem | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadGrades = async () => {
    try {
      const records = await api.fetchAllGrades();
      setGradeRecords(records);
      if (records.length > 0 && !selectedRecord) {
        setSelectedRecord(records[0]);
      }
    } catch {
      if (data.grades && data.grades.length > 0 && !selectedRecord) {
        setSelectedRecord(data.grades[0]);
      }
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const handleScoreChange = (index: number, newScore: number) => {
    if (!selectedRecord) return;
    const clampedScore = Math.max(0, Math.min(100, newScore));
    let letterGrade: 'A' | 'B' | 'C' | 'D' = 'D';
    if (clampedScore >= 88) letterGrade = 'A';
    else if (clampedScore >= 78) letterGrade = 'B';
    else if (clampedScore >= 68) letterGrade = 'C';

    const updatedSubjects = [...selectedRecord.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      score: clampedScore,
      letterGrade
    };

    setSelectedRecord({
      ...selectedRecord,
      subjects: updatedSubjects
    });
  };

  const handleCompetencyChange = (index: number, text: string) => {
    if (!selectedRecord) return;
    const updatedSubjects = [...selectedRecord.subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      competencyDesc: text
    };
    setSelectedRecord({
      ...selectedRecord,
      subjects: updatedSubjects
    });
  };

  const handleAttendanceChange = (field: 'sick' | 'permission' | 'unexcused', val: number) => {
    if (!selectedRecord) return;
    setSelectedRecord({
      ...selectedRecord,
      attendance: {
        ...selectedRecord.attendance,
        [field]: Math.max(0, val)
      }
    });
  };

  const handleSaveGrades = async () => {
    if (!selectedRecord) return;
    setIsSaving(true);
    try {
      await api.updateGradeRecord(selectedRecord.id, selectedRecord);
      showToast(`Nilai rapor ${selectedRecord.studentName} berhasil disimpan.`);
      await loadGrades();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan nilai.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Test restricted download access (Requirement 13)
  const handleAccessRestrictedDoc = async (docId: string) => {
    setDownloadingDocId(docId);
    try {
      const res = await api.accessRestrictedDownload(docId);
      if (res.success && res.doc) {
        setAccessedDoc(res.doc);
        showToast(`Izin terverifikasi: Dokumen '${res.doc.title}' berhasil diakses.`);
      } else {
        showToast(res.error || 'Akses ditolak: Dokumen bersifat rahasia.', 'error');
      }
    } catch {
      showToast('Gagal memverifikasi hak akses berkas.', 'error');
    } finally {
      setDownloadingDocId(null);
    }
  };

  const restrictedDownloads = data.downloads.filter(d => d.isRestricted || (d.requiredRole && d.requiredRole.length > 0));

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-2 border transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700' 
            : 'bg-rose-900 text-rose-100 border-rose-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>PORTAL GURU & E-RAPOR KURIKULUM MERDEKA</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">T.A. 2025/2026</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat Bertugas, {currentUser.fullName}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola pencatatan capaian pembelajaran siswa, asesmen sumatif, deskripsi kompetensi, dan akses silabus rahasia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Wewenang Guru Aktif</span>
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('rapor')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'rapor' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Penilaian E-Rapor (Fase E & F)</span>
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'materials' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Dokumen Rahasia & Bank Soal Asesmen</span>
          </button>
        </div>
      </div>

      {activeTab === 'rapor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Student Selector */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Daftar Siswa Bimbingan
            </h2>
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa/NISN..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {gradeRecords
                .filter(r => r.studentName.toLowerCase().includes(searchStudent.toLowerCase()) || r.nisn.includes(searchStudent))
                .map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedRecord?.id === rec.id
                        ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs">{rec.studentName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      NISN: {rec.nisn} · {rec.className}
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Right: Grade Editor */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {selectedRecord ? (
              <div className="space-y-6">
                {/* Student Bio Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedRecord.studentName}</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>NISN: <strong>{selectedRecord.nisn}</strong></span>
                      <span>·</span>
                      <span>Kelas: <strong>{selectedRecord.className}</strong></span>
                      <span>·</span>
                      <span>Semester: <strong>{selectedRecord.semester}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveGrades}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Nilai Rapor'}</span>
                  </button>
                </div>

                {/* Subject Grades Table */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-sky-800" />
                    <span>Capaian Mata Pelajaran (Kurikulum Merdeka)</span>
                  </h3>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Mata Pelajaran</th>
                          <th className="py-2.5 px-2 text-center w-20">Nilai (0-100)</th>
                          <th className="py-2.5 px-2 text-center w-16">Predikat</th>
                          <th className="py-2.5 px-3">Deskripsi Capaian Kompetensi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedRecord.subjects.map((sub, idx) => (
                          <tr key={sub.subjectName} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 font-medium text-slate-800">
                              <div>{sub.subjectName}</div>
                              <div className="text-[10px] text-slate-400">Guru: {sub.teacherName}</div>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={sub.score}
                                onChange={(e) => handleScoreChange(idx, parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-center font-bold text-sky-950 bg-sky-50/50 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:bg-white"
                              />
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                sub.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-900' :
                                sub.letterGrade === 'B' ? 'bg-sky-100 text-sky-900' :
                                sub.letterGrade === 'C' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                              }`}>
                                {sub.letterGrade}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <textarea
                                rows={2}
                                value={sub.competencyDesc}
                                onChange={(e) => handleCompetencyChange(idx, e.target.value)}
                                className="w-full p-1.5 text-[11px] text-slate-700 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Attendance & Homeroom Teacher Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">Rekapitulasi Kehadiran</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Sakit (Hari)</label>
                        <input
                          type="number"
                          value={selectedRecord.attendance.sick}
                          onChange={(e) => handleAttendanceChange('sick', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Izin (Hari)</label>
                        <input
                          type="number"
                          value={selectedRecord.attendance.permission}
                          onChange={(e) => handleAttendanceChange('permission', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-600 block mb-1">Alpa / Tanpa Ket. (Hari)</label>
                        <input
                          type="number"
                          value={selectedRecord.attendance.unexcused}
                          onChange={(e) => handleAttendanceChange('unexcused', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-800">Catatan Wali Kelas / Dewan Guru</h4>
                    <textarea
                      rows={3}
                      value={selectedRecord.homeroomNotes}
                      onChange={(e) => setSelectedRecord({ ...selectedRecord, homeroomNotes: e.target.value })}
                      placeholder="Motivasi belajar dan penguatan karakter Profil Pelajar Pancasila..."
                      className="w-full p-2 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                Pilih siswa dari daftar sebelah kiri untuk menelaah atau mengisi nilai.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab: Confidential Materials & Exam Access */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Akses Terbatas: Dokumen Rahasia & Bank Soal Asesmen
              </h2>
              <p className="text-xs text-slate-500">
                Sesuai batasan kewenangan RBAC (Requirement 13), berkas berikut hanya dapat dibuka oleh Guru, Tenaga Pendidik, dan Administrator.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden mt-4">
            {restrictedDownloads.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Rahasia / Terbatas
                    </span>
                    <span className="text-xs text-slate-500">Kategori: {doc.category}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">Ukuran: {doc.fileSize}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                  <p className="text-xs text-slate-600">{doc.description}</p>
                </div>

                <button
                  onClick={() => handleAccessRestrictedDoc(doc.id)}
                  disabled={downloadingDocId === doc.id}
                  className="px-4 py-2 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingDocId === doc.id ? 'Memverifikasi...' : 'Buka Berkas Rahasia'}</span>
                </button>
              </div>
            ))}
          </div>

          {accessedDoc && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dokumen Resmi Terotentikasi: {accessedDoc.title}</span>
              </div>
              <p>
                Akses diberikan kepada <strong>{currentUser.fullName} ({currentUser.role})</strong>. File: <code>{accessedDoc.title}.{accessedDoc.fileType.toLowerCase()}</code>. Harap jaga kerahasiaan isi dokumen sesuai Pakta Integritas Dewan Guru SMA Negeri 1 Julok.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
