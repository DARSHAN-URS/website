'use client';

import React from 'react';
import { Save, Bell, Shield, Globe, User, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Admin Settings</h1>
        <p className="text-muted">Configure portal preferences and administrative controls.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue" />
            <h3 className="font-bold text-blue-dark">Profile Information</h3>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-dark">Full Name</label>
              <input type="text" defaultValue="Admin Officer" className="w-full bg-blue-pale/20 border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue/30 transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-dark">Email Address</label>
              <input type="email" defaultValue="admin@laborgro.com" className="w-full bg-blue-pale/20 border border-border rounded-xl px-4 py-2.5 outline-none focus:border-blue/30 transition-all text-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue" />
            <h3 className="font-bold text-blue-dark">Security & Permissions</h3>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-dark">Two-Factor Authentication</p>
              <p className="text-xs text-muted">Add an extra layer of security to your account.</p>
            </div>
            <button className="px-4 py-2 bg-blue-pale text-blue rounded-xl text-xs font-bold hover:bg-blue-light transition-all">Enable 2FA</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-dark">Role-Based Access Control</p>
              <p className="text-xs text-muted">Your current role is set to Super Admin.</p>
            </div>
            <button className="px-4 py-2 bg-blue-pale text-blue rounded-xl text-xs font-bold hover:bg-blue-light transition-all" disabled>Locked</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue" />
            <h3 className="font-bold text-blue-dark">Notifications</h3>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-dark">Critical Alerts</p>
              <p className="text-xs text-muted">Receive email notifications for critical system alerts.</p>
            </div>
            <div className="w-12 h-6 bg-blue rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-blue-dark">Dispute Resolutions</p>
              <p className="text-xs text-muted">Notify me when a dispute is assigned or resolved.</p>
            </div>
            <div className="w-12 h-6 bg-blue rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-2.5 bg-white border border-border rounded-xl text-sm font-bold text-blue-dark hover:bg-blue-pale transition-all">Discard</button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-blue text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue/20 transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
