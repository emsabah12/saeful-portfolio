'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  GraduationCap,
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  Save,
  AlertTriangle,
  Building2,
  Award,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export interface ExperienceItem {
  id: string;
  company_name: string;
  position_en: string;
  position_id?: string;
  description_en: string;
  description_id?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  order_index: number;
  created_at: string;
}

export interface EducationItem {
  id: string;
  institution_name: string;
  degree_en: string;
  degree_id?: string;
  field_of_study_en: string;
  field_of_study_id?: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  created_at: string;
}

const INITIAL_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-001',
    company_name: 'TechVenture Global Inc.',
    position_en: 'Senior Fullstack Software Architect',
    position_id: 'Arsitek Perangkat Lunak Fullstack Senior',
    description_en: 'Leading core micro-frontend architecture migration to Next.js 15 App Router. Managing high-throughput edge telemetry handling over 50M daily requests with Sub-15ms TTFB.',
    description_id: 'Memimpin migrasi arsitektur mikro-frontend ke Next.js 15 App Router. Mengelola telemetri edge berkinerja tinggi yang menangani lebih dari 50 juta permintaan harian dengan TTFB Sub-15ms.',
    location: 'Singapore (Remote)',
    start_date: '2023-08-01',
    end_date: '',
    is_current: true,
    order_index: 1,
    created_at: '2026-01-10 09:00',
  },
  {
    id: 'exp-002',
    company_name: 'Nusa Cloud Systems',
    position_en: 'Lead DevOps & Cloud Engineer',
    position_id: 'Ketua Tim DevOps & Rekayasa Awan',
    description_en: 'Architected Kubernetes microservice clusters and automated zero-downtime PostgreSQL DB migrations via Supabase and Terraform.',
    description_id: 'Merancang klaster mikroservis Kubernetes dan mengotomatiskan migrasi database PostgreSQL zero-downtime melalui Supabase dan Terraform.',
    location: 'Jakarta, Indonesia',
    start_date: '2021-02-01',
    end_date: '2023-07-31',
    is_current: false,
    order_index: 2,
    created_at: '2026-01-05 10:30',
  },
];

const INITIAL_EDUCATIONS: EducationItem[] = [
  {
    id: 'edu-001',
    institution_name: 'Bandung Institute of Technology (ITB)',
    degree_en: 'Bachelor of Science in Computer Science',
    degree_id: 'Sarjana Komputer (S.Kom)',
    field_of_study_en: 'Software Engineering & Distributed Systems',
    field_of_study_id: 'Rekayasa Perangkat Lunak & Sistem Terdistribusi',
    start_date: '2017-08-01',
    end_date: '2021-07-15',
    gpa: '3.88 / 4.00',
    created_at: '2026-01-01 12:00',
  },
];

export default function AdminExperiencesPage() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'educations'>('experiences');
  const [experiences, setExperiences] = useState<ExperienceItem[]>(INITIAL_EXPERIENCES);
  const [educations, setEducations] = useState<EducationItem[]>(INITIAL_EDUCATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form States
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'exp' | 'edu' } | null>(null);
  const [activeLang, setActiveLang] = useState<'en' | 'id'>('en');

  // Experience Form Fields
  const [expCompany, setExpCompany] = useState('');
  const [expPosEn, setExpPosEn] = useState('');
  const [expPosId, setExpPosId] = useState('');
  const [expDescEn, setExpDescEn] = useState('');
  const [expDescId, setExpDescId] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expIsCurrent, setExpIsCurrent] = useState(false);
  const [expOrderIndex, setExpOrderIndex] = useState(1);

  // Education Form Fields
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegreeEn, setEduDegreeEn] = useState('');
  const [eduDegreeId, setEduDegreeId] = useState('');
  const [eduFieldEn, setEduFieldEn] = useState('');
  const [eduFieldId, setEduFieldId] = useState('');
  const [eduStartDate, setEduStartDate] = useState('');
  const [eduEndDate, setEduEndDate] = useState('');
  const [eduGpa, setEduGpa] = useState('');

  const telemetry = useMemo(() => {
    const totalExp = experiences.length;
    const currentRoles = experiences.filter((e) => e.is_current).length;
    const totalEdu = educations.length;
    return { totalExp, currentRoles, totalEdu };
  }, [experiences, educations]);

  const filteredExperiences = useMemo(() => {
    return experiences.filter(
      (e) =>
        e.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.position_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [experiences, searchQuery]);

  const filteredEducations = useMemo(() => {
    return educations.filter(
      (e) =>
        e.institution_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.degree_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.field_of_study_en.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [educations, searchQuery]);

  const handleOpenExpModal = (exp?: ExperienceItem) => {
    if (exp) {
      setEditingExp(exp);
      setExpCompany(exp.company_name);
      setExpPosEn(exp.position_en);
      setExpPosId(exp.position_id || '');
      setExpDescEn(exp.description_en);
      setExpDescId(exp.description_id || '');
      setExpLocation(exp.location || '');
      setExpStartDate(exp.start_date);
      setExpEndDate(exp.end_date || '');
      setExpIsCurrent(exp.is_current);
      setExpOrderIndex(exp.order_index);
    } else {
      setEditingExp(null);
      setExpCompany('');
      setExpPosEn('');
      setExpPosId('');
      setExpDescEn('');
      setExpDescId('');
      setExpLocation('Remote / Onsite');
      setExpStartDate('');
      setExpEndDate('');
      setExpIsCurrent(false);
      setExpOrderIndex(experiences.length + 1);
    }
    setActiveLang('en');
    setIsExpModalOpen(true);
  };

  const handleOpenEduModal = (edu?: EducationItem) => {
    if (edu) {
      setEditingEdu(edu);
      setEduInstitution(edu.institution_name);
      setEduDegreeEn(edu.degree_en);
      setEduDegreeId(edu.degree_id || '');
      setEduFieldEn(edu.field_of_study_en);
      setEduFieldId(edu.field_of_study_id || '');
      setEduStartDate(edu.start_date);
      setEduEndDate(edu.end_date || '');
      setEduGpa(edu.gpa || '');
    } else {
      setEditingEdu(null);
      setEduInstitution('');
      setEduDegreeEn('');
      setEduDegreeId('');
      setEduFieldEn('');
      setEduFieldId('');
      setEduStartDate('');
      setEduEndDate('');
      setEduGpa('');
    }
    setActiveLang('en');
    setIsEduModalOpen(true);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExp) {
      setExperiences((prev) =>
        prev.map((item) =>
          item.id === editingExp.id
            ? {
                ...item,
                company_name: expCompany,
                position_en: expPosEn,
                position_id: expPosId || undefined,
                description_en: expDescEn,
                description_id: expDescId || undefined,
                location: expLocation || undefined,
                start_date: expStartDate,
                end_date: expIsCurrent ? undefined : expEndDate,
                is_current: expIsCurrent,
                order_index: Number(expOrderIndex),
              }
            : item
        )
      );
    } else {
      const newExp: ExperienceItem = {
        id: `exp-${Date.now()}`,
        company_name: expCompany,
        position_en: expPosEn,
        position_id: expPosId || undefined,
        description_en: expDescEn,
        description_id: expDescId || undefined,
        location: expLocation || undefined,
        start_date: expStartDate,
        end_date: expIsCurrent ? undefined : expEndDate,
        is_current: expIsCurrent,
        order_index: Number(expOrderIndex),
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setExperiences((prev) => [newExp, ...prev]);
    }
    setIsExpModalOpen(false);
  };

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEdu) {
      setEducations((prev) =>
        prev.map((item) =>
          item.id === editingEdu.id
            ? {
                ...item,
                institution_name: eduInstitution,
                degree_en: eduDegreeEn,
                degree_id: eduDegreeId || undefined,
                field_of_study_en: eduFieldEn,
                field_of_study_id: eduFieldId || undefined,
                start_date: eduStartDate,
                end_date: eduEndDate || undefined,
                gpa: eduGpa || undefined,
              }
            : item
        )
      );
    } else {
      const newEdu: EducationItem = {
        id: `edu-${Date.now()}`,
        institution_name: eduInstitution,
        degree_en: eduDegreeEn,
        degree_id: eduDegreeId || undefined,
        field_of_study_en: eduFieldEn,
        field_of_study_id: eduFieldId || undefined,
        start_date: eduStartDate,
        end_date: eduEndDate || undefined,
        gpa: eduGpa || undefined,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setEducations((prev) => [newEdu, ...prev]);
    }
    setIsEduModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'exp') {
        setExperiences((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      } else {
        setEducations((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f131c] text-[#dfe2ef] p-6 lg:p-8 font-sans">
      {/* Ambient Accent Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-[#4d8eff]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8c909f] font-semibold">
            <span>CMS Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#adc6ff]">Career & Academic</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight mt-1">
            Experience & Education Manager
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Manage professional career timeline, work achievements, and academic qualifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setExperiences(INITIAL_EXPERIENCES);
              setEducations(INITIAL_EDUCATIONS);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1f29] hover:bg-[#262a34] text-[#dfe2ef] text-xs font-semibold transition-all border border-[#1F293D] shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-[#adc6ff]" />
            <span>Reset Sample Data</span>
          </button>

          {activeTab === 'experiences' ? (
            <button
              onClick={() => handleOpenExpModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4d8eff] text-[#00285d] text-xs font-bold hover:bg-[#adc6ff] transition-all shadow-md shadow-[#4d8eff]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Experience</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenEduModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4edea3] text-[#003824] text-xs font-bold hover:bg-[#6ffbbe] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          )}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
              Work Experiences
            </span>
            <p className="text-3xl font-black text-[#F9FAFB] mt-1">{telemetry.totalExp}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/10 text-[#adc6ff] flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
              Current Active Roles
            </span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-black text-[#4edea3]">{telemetry.currentRoles}</p>
              {telemetry.currentRoles > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
              Academic Degrees
            </span>
            <p className="text-3xl font-black text-[#ffb786] mt-1">{telemetry.totalEdu}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#df7412]/20 text-[#ffb786] flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#1c1f29] rounded-xl border border-[#1F293D] p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1F293D]">
          {/* Main Tab Buttons */}
          <div className="flex items-center bg-[#0a0e17] p-1 rounded-lg border border-[#1F293D]">
            <button
              onClick={() => setActiveTab('experiences')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                activeTab === 'experiences'
                  ? 'bg-[#4d8eff] text-[#00285d]'
                  : 'text-[#8c909f] hover:text-[#dfe2ef]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Career History ({experiences.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('educations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                activeTab === 'educations'
                  ? 'bg-[#4edea3] text-[#003824]'
                  : 'text-[#8c909f] hover:text-[#dfe2ef]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Academic History ({educations.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="flex items-center bg-[#0a0e17] px-3 py-2 rounded-lg border border-[#1F293D] w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8c909f]" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'experiences' ? 'company, role...' : 'institution, degree...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#F9FAFB] px-2 focus:outline-none placeholder:text-[#8c909f] w-full"
            />
          </div>
        </div>

        {}
        {activeTab === 'experiences' && (
          <div className="overflow-x-auto w-full mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#181b25] text-[#8c909f] text-xs uppercase tracking-wider border-b border-[#1F293D]">
                  <th className="py-3 px-4 rounded-l-lg">Company & Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]">
                {filteredExperiences.length > 0 ? (
                  filteredExperiences.map((exp) => (
                    <tr key={exp.id} className="hover:bg-[#262a34] transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#F9FAFB]">
                            {exp.position_en}
                          </span>
                          <span className="text-xs text-[#adc6ff] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" /> {exp.company_name}
                          </span>
                          <span className="text-xs text-[#8c909f] line-clamp-1 mt-1 font-mono">
                            {exp.description_en}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-[#c2c6d6]">
                        {exp.location ? (
                          <span className="flex items-center gap-1 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-[#8c909f]" /> {exp.location}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-[#8c909f]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {exp.start_date} ~ {exp.is_current ? 'Present' : exp.end_date}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {exp.is_current ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#4edea3] text-[11px] font-mono border border-[#10B981]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Active Role
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#181b25] text-[#8c909f] text-[11px] font-mono border border-[#1F293D]">
                            Past Role
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenExpModal(exp)}
                            className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                            title="Edit Experience"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: exp.id, type: 'exp' })}
                            className="p-1.5 rounded hover:bg-[#93000a] text-[#c2c6d6] hover:text-[#ffb4ab] transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-sm text-[#8c909f]">
                      No work experiences found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {}
        {activeTab === 'educations' && (
          <div className="overflow-x-auto w-full mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#181b25] text-[#8c909f] text-xs uppercase tracking-wider border-b border-[#1F293D]">
                  <th className="py-3 px-4 rounded-l-lg">Institution & Degree</th>
                  <th className="py-3 px-4">Field of Study</th>
                  <th className="py-3 px-4">GPA / Score</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]">
                {filteredEducations.length > 0 ? (
                  filteredEducations.map((edu) => (
                    <tr key={edu.id} className="hover:bg-[#262a34] transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#F9FAFB]">
                            {edu.institution_name}
                          </span>
                          <span className="text-xs text-[#ffb786] flex items-center gap-1 mt-0.5">
                            <Award className="w-3.5 h-3.5" /> {edu.degree_en}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-[#c2c6d6]">
                        {edu.field_of_study_en}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-[#4edea3]">
                        {edu.gpa ? edu.gpa : '-'}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-[#8c909f]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {edu.start_date} ~ {edu.end_date || 'Present'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEduModal(edu)}
                            className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                            title="Edit Education"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: edu.id, type: 'edu' })}
                            className="p-1.5 rounded hover:bg-[#93000a] text-[#c2c6d6] hover:text-[#ffb4ab] transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-sm text-[#8c909f]">
                      No academic history records found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      {isExpModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#181b25] border-b border-[#1F293D]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#adc6ff]" />
                <h2 className="text-base font-bold text-[#F9FAFB]">
                  {editingExp ? 'Edit Experience Entry' : 'Create New Work Experience'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#0a0e17] p-1 rounded-lg border border-[#1F293D]">
                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      activeLang === 'en'
                        ? 'bg-[#4d8eff] text-[#00285d]'
                        : 'text-[#8c909f] hover:text-[#dfe2ef]'
                    }`}
                  >
                    EN (English)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang('id')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      activeLang === 'id'
                        ? 'bg-[#4d8eff] text-[#00285d]'
                        : 'text-[#8c909f] hover:text-[#dfe2ef]'
                    }`}
                  >
                    ID (Bahasa)
                  </button>
                </div>

                <button
                  onClick={() => setIsExpModalOpen(false)}
                  className="p-1 rounded text-[#8c909f] hover:text-[#F9FAFB] hover:bg-[#31353f]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveExperience} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="e.g. TechVenture Global Inc."
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-[#4d8eff]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Location / Work Type
                  </label>
                  <input
                    type="text"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    placeholder="e.g. Singapore (Remote)"
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Job Title ({activeLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeLang === 'en' ? expPosEn : expPosId}
                    onChange={(e) =>
                      activeLang === 'en'
                        ? setExpPosEn(e.target.value)
                        : setExpPosId(e.target.value)
                    }
                    placeholder="e.g. Senior Fullstack Software Architect"
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-[#4d8eff]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={expStartDate}
                    onChange={(e) => setExpStartDate(e.target.value)}
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">End Date</label>
                  <input
                    type="date"
                    disabled={expIsCurrent}
                    value={expEndDate}
                    onChange={(e) => setExpEndDate(e.target.value)}
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none disabled:opacity-40"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between bg-[#0a0e17] p-3 rounded-lg border border-[#1F293D]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCurrentCheck"
                      checked={expIsCurrent}
                      onChange={(e) => setExpIsCurrent(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#1c1f29] border-[#1F293D] text-[#4d8eff] focus:ring-0"
                    />
                    <label htmlFor="isCurrentCheck" className="text-xs font-semibold text-[#F9FAFB] cursor-pointer">
                      I currently work in this role (Present)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8c909f]">Display Priority Index:</span>
                    <input
                      type="number"
                      min={1}
                      value={expOrderIndex}
                      onChange={(e) => setExpOrderIndex(Number(e.target.value))}
                      className="w-16 bg-[#1c1f29] text-[#F9FAFB] text-xs px-2 py-1 rounded border border-[#1F293D] text-center"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Description & Bullet Achievements ({activeLang.toUpperCase()}) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={activeLang === 'en' ? expDescEn : expDescId}
                    onChange={(e) =>
                      activeLang === 'en'
                        ? setExpDescEn(e.target.value)
                        : setExpDescId(e.target.value)
                    }
                    placeholder="Key responsibilities and engineering impact..."
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F293D]">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#4d8eff] text-[#00285d] text-xs font-bold hover:bg-[#adc6ff] transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {isEduModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#181b25] border-b border-[#1F293D]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#ffb786]" />
                <h2 className="text-base font-bold text-[#F9FAFB]">
                  {editingEdu ? 'Edit Academic Qualification' : 'Add Academic Qualification'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#0a0e17] p-1 rounded-lg border border-[#1F293D]">
                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      activeLang === 'en'
                        ? 'bg-[#4edea3] text-[#003824]'
                        : 'text-[#8c909f] hover:text-[#dfe2ef]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang('id')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      activeLang === 'id'
                        ? 'bg-[#4edea3] text-[#003824]'
                        : 'text-[#8c909f] hover:text-[#dfe2ef]'
                    }`}
                  >
                    ID
                  </button>
                </div>

                <button
                  onClick={() => setIsEduModalOpen(false)}
                  className="p-1 rounded text-[#8c909f] hover:text-[#F9FAFB] hover:bg-[#31353f]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEducation} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Institution / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    placeholder="e.g. Bandung Institute of Technology (ITB)"
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-[#4edea3]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Degree Name ({activeLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeLang === 'en' ? eduDegreeEn : eduDegreeId}
                    onChange={(e) =>
                      activeLang === 'en'
                        ? setEduDegreeEn(e.target.value)
                        : setEduDegreeId(e.target.value)
                    }
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-[#4edea3]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">
                    Field of Study ({activeLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeLang === 'en' ? eduFieldEn : eduFieldId}
                    onChange={(e) =>
                      activeLang === 'en'
                        ? setEduFieldEn(e.target.value)
                        : setEduFieldId(e.target.value)
                    }
                    placeholder="e.g. Software Engineering"
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-[#4edea3]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={eduStartDate}
                    onChange={(e) => setEduStartDate(e.target.value)}
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">End / Graduation Date</label>
                  <input
                    type="date"
                    value={eduEndDate}
                    onChange={(e) => setEduEndDate(e.target.value)}
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1 block">GPA / Grade Score</label>
                  <input
                    type="text"
                    value={eduGpa}
                    onChange={(e) => setEduGpa(e.target.value)}
                    placeholder="e.g. 3.88 / 4.00"
                    className="w-full bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F293D]">
                <button
                  type="button"
                  onClick={() => setIsEduModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#4edea3] text-[#003824] text-xs font-bold hover:bg-[#6ffbbe] transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Education</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-[#ffb4ab] mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#F9FAFB]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this {deleteTarget.type === 'exp' ? 'work experience' : 'academic history'} record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-[#93000a] text-[#ffdad6] text-xs font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
