"use client";

import { useState } from "react";
import { getStoredToken } from "@/lib/auth";
import { Download, LogOut, Mail, UserCircle2, ShieldCheck, CreditCard, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/types";
import { api } from "@/lib/api";

export function ProfilePanel({
  user: initialUser,
  onLogout,
  exportCsv,
  exportPdf
}: {
  user: User;
  onLogout: () => void;
  exportCsv: string;
  exportPdf: string;
}) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user.name,
    currency: user.currency,
    monthlyBudget: user.monthlyBudget
  });

  const downloadFile = async (url: string, filename: string) => {
    const token = getStoredToken();
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) {
      toast.error("Download failed");
      return;
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = filename;
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    toast.success(`${filename} downloaded`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedUser = await api.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({ name: user.name, currency: user.currency, monthlyBudget: user.monthlyBudget });
    setIsEditing(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 pb-10">
      {/* Left Column */}
      <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6">
        
        {/* Main User Card */}
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute top-4 right-4 z-20">
            {!isEditing ? (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 rounded-full hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20">
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving} className="h-8 w-8 rounded-full text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/20 dark:hover:bg-brand-500/30 transition-colors">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 mb-4 ring-8 ring-white dark:ring-slate-950">
              <UserCircle2 className="h-12 w-12" />
            </div>
            
            {isEditing ? (
              <Input 
                className="max-w-[220px] text-center font-bold text-lg mb-1 h-9 rounded-xl" 
                value={formData.name} 
                onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} 
              />
            ) : (
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            )}

            <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            <div className="mt-6 flex w-full flex-col gap-2 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Member since</span>
                 <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Jan 2024'}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Account Tier</span>
                 <span className="font-medium text-brand-600 dark:text-brand-400">Pro Plan</span>
               </div>
            </div>
          </div>
        </Card>

        {/* Global Preferences */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-medium">Theme Appearance</p>
              <p className="text-sm text-slate-500">Toggle light or dark mode</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-slate-500">Weekly reports & alerts</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-brand-500 flex items-center px-1 cursor-pointer">
               <div className="h-4 w-4 rounded-full bg-white ml-auto" />
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6">

        {/* Finance Settings */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
             <div>
               <h3 className="text-lg font-semibold">Finance Settings</h3>
               <p className="text-sm text-slate-500">Manage your money defaults</p>
             </div>
             {isEditing && <div className="text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-full uppercase tracking-wider">Editing mode</div>}
          </div>
          <div className="p-6 grid gap-4 sm:grid-cols-2 bg-slate-50/50 dark:bg-transparent">
            <div className={`rounded-2xl border ${isEditing ? 'border-brand-300 dark:border-brand-500/50 ring-2 ring-brand-500/10' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900/50 p-4 relative overflow-hidden transition-all duration-300`}>
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <CreditCard className="h-10 w-10" />
              </div>
              <div className="flex items-center gap-2 text-slate-500 mb-3 relative z-10">
                 <CreditCard className="h-4 w-4 text-brand-500" />
                 <p className="text-sm">Base Currency</p>
              </div>
              {isEditing ? (
                <Input 
                  className="relative z-10 font-medium h-10 w-full" 
                  value={formData.currency} 
                  onChange={(e) => setFormData(p => ({...p, currency: e.target.value}))} 
                />
              ) : (
                <p className="text-2xl font-bold relative z-10">{user.currency}</p>
              )}
            </div>
            <div className={`rounded-2xl border ${isEditing ? 'border-emerald-300 dark:border-emerald-500/50 ring-2 ring-emerald-500/10' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900/50 p-4 relative overflow-hidden transition-all duration-300`}>
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="flex items-center gap-2 text-slate-500 mb-3 relative z-10">
                 <ShieldCheck className="h-4 w-4 text-emerald-500" />
                 <p className="text-sm">Monthly Budget</p>
              </div>
              {isEditing ? (
                 <Input 
                   type="number"
                   className="relative z-10 font-medium h-10 w-full" 
                   value={formData.monthlyBudget} 
                   onChange={(e) => setFormData(p => ({...p, monthlyBudget: Number(e.target.value)}))} 
                 />
              ) : (
                <p className="text-2xl font-bold relative z-10">${user.monthlyBudget}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Export Data */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Export Data</h3>
          <p className="text-sm text-slate-500 mb-4">Download your complete transaction history for tax purposes or personal backup.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => downloadFile(exportCsv, "transactions.csv")}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 hover:border-brand-500 transition-colors text-left"
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">Raw CSV Data</span>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
              </div>
              <span className="text-xs text-slate-500">Spreadsheet compatible format</span>
            </button>
            <button
              type="button"
              onClick={() => downloadFile(exportPdf, "transactions.pdf")}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 hover:border-brand-500 transition-colors text-left"
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">Formatted PDF</span>
                <Download className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
              </div>
              <span className="text-xs text-slate-500">Print-ready PDF report</span>
            </button>
          </div>
        </Card>

        {/* Security / Danger Zone */}
        <Card className="p-6 border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/5">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Account Security</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
             <div>
               <p className="font-medium">Active Sessions</p>
               <p className="text-sm text-slate-500">You are currently logged in on this device.</p>
             </div>
             <Button
                variant="secondary"
                className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 bg-white dark:bg-slate-900"
                onClick={() => {
                  onLogout();
                  toast.success("You have been logged out");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
