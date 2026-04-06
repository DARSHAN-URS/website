"use client";

import React from "react";
import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="font-serif text-4xl font-extrabold mb-4 text-[#1a2533]">Terms and Conditions</h1>
        <p className="text-[#6b7f93] mb-10 italic">Last updated: April 7, 2026</p>

        <section className="space-y-8 text-[1.05rem] leading-[1.8] text-[#3e4a59]">
          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using Laborgro (the "Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. Laborgro is a platform designed to connect employers with skilled blue-collar workers across India.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">2. Nature of Service</h2>
            <p>
              Laborgro acts as an intermediary platform. We are not an employer, recruitment agency, or manpower supplier. Our service is to provide a marketplace for employers to list jobs and for workers to offer their services. Any contract for work is directly between the employer and the worker.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">3. User Eligibility and Registration</h2>
            <p>
              Users must be at least 18 years of age and residents of India to register. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">4. Profile and Job Accuracy</h2>
            <p>
              Users agree to provide truthful and accurate information in their profiles or job postings. Laborgro reserves the right to remove any content that is found to be false, misleading, illegal, or discriminatory.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">5. Verification Disclaimer</h2>
            <p>
              While we perform basic background checks on workers marked as "Verified," Laborgro does not guarantee the quality, safety, or legal compliance of any worker or employer. Users are encouraged to perform their own due diligence before hiring or accepting work.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">6. Fees and Payments</h2>
            <p>
              Employers may be charged a fee for posting jobs or using premium features. Workers keep 100% of their earnings from jobs found on the platform, unless a payment processing fee is applicable. All fees paid to Laborgro are non-refundable unless specified otherwise.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Laborgro shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of the platform or any interactions between users.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">8. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1a2533] mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact our help desk at:
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
