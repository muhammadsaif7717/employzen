"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  User,
  Phone,
  Mail,
  Camera,
  Loader2,
  CheckCircle,
  Briefcase,
  Globe,
  MapPin,
  Building,
  Tag,
  ShieldCheck,
} from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Common fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Candidate fields
  const [title, setTitle] = useState("");
  const [skillsStr, setSkillsStr] = useState("");

  // Employer fields
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        if (response.data?.success) {
          const profile = response.data.data;
          setName(profile.name || "");
          setPhone(profile.phone || "");
          setAvatarUrl(profile.avatarUrl || "");
          setEmail(profile.email || "");

          if (user.role === "candidate") {
            setTitle(profile.title || "");
            setSkillsStr(Array.isArray(profile.skills) ? profile.skills.join(", ") : "");
          } else if (user.role === "employer") {
            const company = profile.company || {};
            setCompanyName(company.name || "");
            setWebsite(company.website || "");
            setLocation(company.location || "");
            setIndustry(company.industry || "");
            setDescription(company.description || "");
          }
        }
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setErrorMsg("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "6b76f11d2f71058cb524a";
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
      if (response.data?.success) {
        const url = response.data.data.url;
        setAvatarUrl(url);
        setSuccessMsg("Photo uploaded to ImgBB successfully! Click 'Save Changes' to update your profile.");
      } else {
        setErrorMsg("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("ImgBB upload error:", err);
      setErrorMsg("Failed to upload image to ImgBB.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload: any = {
      name,
      phone,
      avatarUrl,
      email,
    };

    if (password) {
      payload.password = password;
    }

    if (user?.role === "candidate") {
      payload.title = title;
      payload.skills = skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else if (user?.role === "employer") {
      payload.companyName = companyName;
      payload.website = website;
      payload.location = location;
      payload.industry = industry;
      payload.description = description;
    }

    try {
      const response = await axiosInstance.patch("/profile", payload);
      if (response.data?.success) {
        setSuccessMsg("Profile updated successfully!");
        setPassword("");
        // Refresh active context session to update display avatar & name in navbar
        await refreshUser();
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      const data = err.response?.data;
      if (data?.errorSources && Array.isArray(data.errorSources) && data.errorSources.length > 0) {
        setErrorMsg(data.errorSources.map((s: any) => s.message).join(", "));
      } else {
        setErrorMsg(data?.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <span className="mt-4 text-slate-500 font-semibold dark:text-slate-400">Loading your profile...</span>
      </div>
    );
  }

  // ─── INITIALS FOR ALL ROLES ───────────────────────────────────────────────
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Card: Avatar Management */}
        <div className="w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col items-center shrink-0">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center ring-4 ring-blue-50 dark:ring-blue-900/30">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-blue-600 dark:text-blue-400 font-bold text-3xl">{initials}</span>
              )}
            </div>
            
            <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-all hover:scale-105">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center mt-4 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{name || "Your Name"}</h3>
            <p className="text-xs font-semibold text-slate-400 capitalize">{user.role}</p>
          </div>

          <p className="text-slate-450 dark:text-slate-500 text-[10px] text-center mt-6 leading-relaxed">
            Supports PNG, JPG, or WEBP. Uploads are processed instantly to ImgBB storage.
          </p>
        </div>

        {/* Right Card: Profile Form */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-3 border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Profile Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Success/Error Alerts */}
            {successMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5 shrink-0" />
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Basic Details (All Roles) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +880 15..."
                    className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Change Password <span className="text-slate-400 text-xs font-normal">(Leave blank to keep current)</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* ─── Candidate Specific Fields ───────────────────────────────── */}
            {user.role === "candidate" && (
              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Candidate Details</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Professional Title
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <Input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineer, Product Designer"
                      className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Skills <span className="text-slate-400 text-xs font-normal">(comma-separated)</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <Input
                      type="text"
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      placeholder="React, TypeScript, Node.js, CSS"
                      className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Employer Specific Fields ────────────────────────────────── */}
            {user.role === "employer" && (
              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Company Profile</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <Input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Stripe"
                        className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Website URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <Input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <Input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Industry
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <Input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g. Technology, Fintech"
                        className="h-11 pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Provide a short overview of your company..."
                    className="w-full p-3.5 text-sm rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button
                type="submit"
                disabled={saving || uploading}
                className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
