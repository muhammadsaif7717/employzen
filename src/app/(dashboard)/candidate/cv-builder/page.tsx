"use client";

import React, { useState, useEffect } from "react";
import { useAuth, CandidateProfile } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Save,
  Loader2,
  Globe,
  Briefcase,
  GraduationCap,
  FolderCode,
  Award,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";


export default function CVBuilderPage() {
  const { user, profile, refreshUser } = useAuth();

  // Load state from profile
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  // CV Builder specific sub-data
  const [summary, setSummary] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [certificationsStr, setCertificationsStr] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Sync profile data once loaded
  useEffect(() => {
    if (profile) {
      const candidateProfile = profile as CandidateProfile;
      setName(candidateProfile.name || "");
      setTitle(candidateProfile.title || "");
      setPhone(candidateProfile.phone || "");
      setSkillsStr(candidateProfile.skills?.join(", ") || "");
      setExperience(candidateProfile.experience || []);
      setEducation(candidateProfile.education || []);

      const cv = (candidateProfile as any).cvBuilderData || {};
      setSummary(cv.summary || "");
      setLinkedin(cv.socialLinks?.linkedin || "");
      setGithub(cv.socialLinks?.github || "");
      setWebsite(cv.socialLinks?.website || "");
      setProjects(cv.projects || []);
      setCertificationsStr(cv.certifications?.join(", ") || "");
    }
  }, [profile]);

  // Experience Handlers
  const handleAddExperience = () => {
    setExperience([...experience, { company: "", role: "", duration: "", description: "" }]);
  };

  const handleUpdateExperience = (index: number, key: string, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [key]: value };
    setExperience(updated);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Education Handlers
  const handleAddEducation = () => {
    setEducation([...education, { institution: "", degree: "", year: "" }]);
  };

  const handleUpdateEducation = (index: number, key: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [key]: value };
    setEducation(updated);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Project Handlers
  const handleAddProject = () => {
    setProjects([...projects, { name: "", description: "", link: "" }]);
  };

  const handleUpdateProject = (index: number, key: string, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [key]: value };
    setProjects(updated);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("");

    try {
      const skills = skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const certifications = certificationsStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        name,
        title,
        phone,
        skills,
        experience,
        education,
        cvBuilderData: {
          title,
          phone,
          summary,
          socialLinks: {
            linkedin,
            github,
            website,
          },
          projects,
          certifications,
        },
      };

      const response = await axiosInstance.patch("/profile", payload);
      if (response.data?.success) {
        setSaveStatus("success");
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="h-8 w-8 text-blue-500" />
            CV Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Build your professional CV here. Changes are previewed in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="rounded-xl flex items-center gap-1.5 border-slate-350"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Profile & CV
          </Button>
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 rounded-xl text-sm font-semibold print:hidden">
          Profile & CV saved successfully!
        </div>
      )}

      {saveStatus === "error" && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-semibold print:hidden">
          Failed to save changes. Please try again.
        </div>
      )}

      {/* Editor & Preview Split Screen */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Editor Form */}
        <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm print:hidden">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            CV Editor
          </h2>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="rounded-xl h-10"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Professional Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="rounded-xl h-10"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="rounded-xl h-10"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Skills (comma-separated)</label>
                <Input
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="e.g. Node.js, Express, React, TypeScript"
                  className="rounded-xl h-10"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Professional Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A short description of your professional background, strengths, and goals..."
                rows={4}
                className="w-full bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
              Online Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaLinkedin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn URL"
                  className="pl-9 rounded-xl h-10"
                />
              </div>
              <div className="relative">
                <FaGithub className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="GitHub URL"
                  className="pl-9 rounded-xl h-10"
                />
              </div>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Personal Website"
                  className="pl-9 rounded-xl h-10"
                />
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                Work Experience
              </h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Work
              </button>
            </div>

            {experience.map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-slate-500 block mb-0.5">Company Name</label>
                    <Input
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(idx, "company", e.target.value)}
                      placeholder="e.g. Google"
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Duration</label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => handleUpdateExperience(idx, "duration", e.target.value)}
                      placeholder="e.g. Jan 2022 - Present"
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Role / Position</label>
                  <Input
                    value={exp.role}
                    onChange={(e) => handleUpdateExperience(idx, "role", e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="h-9 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Responsibilities</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(idx, "description", e.target.value)}
                    placeholder="Worked on backend pipelines..."
                    rows={2}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                Education History
              </h3>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Education
              </button>
            </div>

            {education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Institution / University</label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(idx, "institution", e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Degree / Study Field</label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(idx, "degree", e.target.value)}
                      placeholder="e.g. B.S. Computer Science"
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Graduation Year</label>
                  <Input
                    value={edu.year}
                    onChange={(e) => handleUpdateEducation(idx, "year", e.target.value)}
                    placeholder="e.g. 2023"
                    className="h-9 rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                Key Projects
              </h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </button>
            </div>

            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveProject(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Project Name</label>
                    <Input
                      value={proj.name}
                      onChange={(e) => handleUpdateProject(idx, "name", e.target.value)}
                      placeholder="e.g. Employzen Portal"
                      className="h-9 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Project Link (optional)</label>
                    <Input
                      value={proj.link}
                      onChange={(e) => handleUpdateProject(idx, "link", e.target.value)}
                      placeholder="e.g. github.com/Jane/project"
                      className="h-9 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Project Description</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => handleUpdateProject(idx, "description", e.target.value)}
                    placeholder="Built real-time messaging..."
                    rows={2}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
              Certifications
            </h3>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Certifications (comma-separated)</label>
              <Input
                value={certificationsStr}
                onChange={(e) => setCertificationsStr(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect, Google UX Design Certificate"
                className="rounded-xl h-10"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live CV Preview */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 rounded-2xl border border-slate-250 dark:border-slate-850 h-fit max-w-[800px] mx-auto print:bg-white print:border-none print:shadow-none print:p-0 print:m-0 w-full">
          
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center print:hidden">
            Live Preview
          </h2>

          {/* Resume printable container */}
          <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-md rounded-lg border border-slate-250/70 print:border-none print:shadow-none print:p-0 print:m-0 font-sans min-h-[1056px] flex flex-col justify-between">
            <div className="space-y-8">
              
              {/* CV Header */}
              <div className="border-b-2 border-slate-200 pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{name || "Jane Doe"}</h1>
                  <p className="text-md font-semibold text-blue-600 mt-1 uppercase tracking-wider">{title || "Your Professional Title"}</p>
                </div>
                <div className="text-right text-xs sm:text-sm text-slate-500 space-y-1">
                  {phone && <p>Phone: {phone}</p>}
                  <p>Email: {user?.email || "you@example.com"}</p>
                  
                  {/* Social Links */}
                  <div className="flex gap-2 justify-end pt-1.5 print:hidden">
                    {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"><FaLinkedin className="h-4 w-4" /></a>}
                    {github && <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-800"><FaGithub className="h-4 w-4" /></a>}
                    {website && <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500"><Globe className="h-4 w-4" /></a>}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Summary</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{summary}</p>
                </div>
              )}

              {/* Work Experience */}
              {experience.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <Briefcase className="h-4 w-4 text-blue-500 shrink-0" />
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-start text-sm">
                          <span className="font-bold text-slate-850">{exp.company || "Company"}</span>
                          <span className="text-xs text-slate-500 font-medium">{exp.duration || "Duration"}</span>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold">{exp.role || "Role"}</p>
                        {exp.description && (
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-2 border-l border-slate-200">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <GraduationCap className="h-4 w-4 text-blue-500 shrink-0" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div>
                          <span className="font-bold text-slate-850">{edu.institution || "Institution"}</span>
                          <p className="text-xs text-slate-500 mt-0.5">{edu.degree || "Degree"}</p>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{edu.year || "Year"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <FolderCode className="h-4 w-4 text-blue-500 shrink-0" />
                    Key Projects
                  </h3>
                  <div className="space-y-3">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-bold text-slate-850">{proj.name || "Project Name"}</span>
                          {proj.link && <span className="text-[10px] text-blue-500 font-medium">{proj.link}</span>}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skillsStr.trim() && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Skills</h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillsStr
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-medium border border-slate-200/50"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certificationsStr.trim() && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <Award className="h-4 w-4 text-blue-500 shrink-0" />
                    Certifications
                  </h3>
                  <ul className="list-disc list-inside text-xs text-slate-700 pl-1 space-y-1">
                    {certificationsStr
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                      .map((cert) => (
                        <li key={cert}>{cert}</li>
                      ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Resume Footer */}
            <div className="text-center text-[10px] text-slate-400 border-t border-slate-200/50 pt-4 mt-8">
              Generated via Employzen Job Portal CV Builder
            </div>
          </div>
        </div>

      </div>

      {/* Global CSS to hide sidebar & navbar during print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          aside, header, footer, button, .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .mx-auto {
            margin: 0 !important;
            max-width: 100% !important;
          }
          main {
            padding: 0 !important;
          }
          /* Show only this printable resume card */
          .bg-slate-100, .bg-slate-100 * {
            visibility: visible;
          }
          .bg-slate-100 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .bg-white {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
