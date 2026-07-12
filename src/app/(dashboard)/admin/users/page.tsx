/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
 
"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Filter,
  Ban,
  UserCheck,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      if (response.data?.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId: string, currentStatus: "active" | "blocked") => {
    setActioningId(userId);
    setActionError("");
    setActionSuccess("");

    const newStatus = currentStatus === "active" ? "blocked" : "active";

    try {
      const response = await axiosInstance.patch(`/users/${userId}/status`, {
        status: newStatus,
      });

      if (response.data?.success) {
        setActionSuccess(
          `User account has been ${newStatus === "blocked" ? "blocked" : "activated"} successfully!`
        );
        // Update local state
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err: any) {
      console.error(err);
      setActionError(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setActioningId(null);
      setTimeout(() => {
        setActionSuccess("");
        setActionError("");
      }, 3000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account? All associated profile data and listings will be deleted!")) {
      return;
    }

    setActioningId(userId);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await axiosInstance.delete(`/users/${userId}`);

      if (response.data?.success) {
        setActionSuccess("User account and associated profiles deleted successfully.");
        // Remove from list
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err: any) {
      console.error(err);
      setActionError(err.response?.data?.message || "Failed to delete user account.");
    } finally {
      setActioningId(null);
      setTimeout(() => {
        setActionSuccess("");
        setActionError("");
      }, 3000);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const name = u.profile?.name || (u.role === "admin" ? "Administrator" : "User");
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || u.status === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Users className="h-8 w-8 text-blue-500" />
          User Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor users, block accounts, or permanently delete user profiles.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 rounded-xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-semibold flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="md:col-span-2 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-9"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full h-9 px-3 py-1 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-705 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
          >
            <option value="All">All Roles</option>
            <option value="Candidate">Candidate</option>
            <option value="Employer">Company</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 px-3 py-1 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-705 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <Users className="h-12 w-12 text-slate-350 dark:text-slate-650 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No users found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No accounts match your current filters or search term.
          </p>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 font-bold text-slate-705 dark:text-slate-300">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Date Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => {
                const name =
                  u.profile?.name || (u.role === "admin" ? "Administrator" : "User");
                const roleColors: Record<string, string> = {
                  candidate: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
                  employer: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
                  admin: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
                };

                return (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {name}
                      {u.profile?.company?.name && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                          {u.profile.company.name}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-505 dark:text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <Badge className={`capitalize font-semibold border-none text-[10px] sm:text-xs px-2.5 py-0.5 ${roleColors[u.role]}`}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-505 dark:text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`font-semibold text-[10px] sm:text-xs px-2.5 py-0.5 ${
                          u.status === "active"
                            ? "bg-green-50/50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-450 dark:border-green-900/30"
                            : "bg-red-50/50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-450 dark:border-red-900/30"
                        }`}
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {u.role !== "admin" && (
                          <>
                            {u.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actioningId === u._id}
                                onClick={() => handleToggleBlock(u._id, "active")}
                                className="h-8 rounded-lg text-amber-600 hover:text-amber-700 border-amber-200 hover:bg-amber-50"
                              >
                                <Ban className="h-3.5 w-3.5 mr-1" />
                                Block
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actioningId === u._id}
                                onClick={() => handleToggleBlock(u._id, "blocked")}
                                className="h-8 rounded-lg text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                              >
                                <UserCheck className="h-3.5 w-3.5 mr-1" />
                                Unblock
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actioningId === u._id}
                              onClick={() => handleDeleteUser(u._id)}
                              className="h-8 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
