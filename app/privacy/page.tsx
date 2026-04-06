"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#1a2533]">
      {/* Simple Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-[60px] py-4 bg-white/95 backdrop-blur-md border-b border-[#dde9f3]">
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <svg className="w-[42px] h-[30px]" viewBox="0 0 100 60" fill="none">
            <path d="M10 45C10 45 25 10 50 10C75 10 90 45 90 45L75 55C75 55 65 30 50 30C35 30 25 55 25 55L10 45Z" fill="white" stroke="#3d7ab5" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M45 42L50 54L55 42" stroke="#3d7ab5" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="2" fill="#3d7ab5"/>
          </svg>
          <div className="font-serif text-2xl font-extrabold text-[#3d7ab5] tracking-tight">Laborgro</div>
        </Link>
        <Link href="/" className="text-[#3d7ab5] font-semibold text-sm hover:underline">Back to Home</Link>
      </nav>

      <main className="max-w-[800px] mx-auto px-6 pt-32 pb-20">
        <h1 className="font-serif text-4xl font-extrabold mb-4 text-[#1a2533]">Privacy Policy</h1>
        <p className="text-[#6b7f93] mb-10 italic">Last updated: April 7, 2026</p>

        <section className="space-y-8 text-[1.05rem] leading-[1.8] text-[#3e4a59]">
          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">1. Information We Collect</h2>
            <p>
              We collect information that you provide to us directly when you create an account, such as your name, phone number, address, and profile details. For workers, we may collect KYC documents (Aadhaar, etc.) for verification purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">2. How We Use Your Information</h2>
            <p>
              We use the collected information to provide and improve our services, facilitate connections between employers and workers, verify user identities, and communicate with you about your account and platform updates.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">3. Sharing of Information</h2>
            <p>
              Your contact details (such as phone number) are hidden by default and only shared with users you choose to interact with. We do not sell your personal data to third parties. We may share information with law enforcement if required by Indian law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time through your account settings. If you wish to delete your account permanently, please contact our support desk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">6. Cookies</h2>
            <p>
              We use cookies to enhance your experience and remember your login preferences. You can disable cookies through your browser settings, but some features of the platform may not function correctly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <strong className="text-[#3d7ab5]">laborgrow@gmail.com</strong>
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a2533] text-white/50 py-10 px-6 text-center text-sm border-t border-white/10">
        <p>© 2025 Laborgro. All rights reserved.</p>
      </footer>
    </div>
  );
}
