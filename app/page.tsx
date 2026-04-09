"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  useEffect(() => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    reveals.forEach(r => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  const setLang = (code: string) => {
    const langDemos: any = {
      en: { find: 'Find a Painter near me', search: 'Search in your language', voice: 'Voice Search supported', chat: 'Chat in your language' },
      hi: { find: 'पास में पेंटर चाहिए', search: 'अपनी भाषा में खोजें', voice: 'आवाज़ से खोजें', chat: 'हिंदी में बात करें' },
      mr: { find: 'जवळ रंगारी हवा', search: 'तुमच्या भाषेत शोधा', voice: 'आवाजाने शोधा', chat: 'मराठीत बोला' },
      ta: { find: 'அருகில் சாயக்காரர் வேண்டும்', search: 'உங்கள் மொழியில் தேடுங்கள்', voice: 'குரலில் தேடுங்கள்', chat: 'தமிழில் பேசுங்கள்' },
      te: { find: 'దగ్గర పెయింటర్ కావాలి', search: 'మీ భాషలో వెతకండి', voice: 'వాయిస్ సెర్చ్', chat: 'తెలుగులో మాట్లాడండి' },
      bn: { find: 'কাছে পেইন্টার দরকার', search: 'আপনার ভাষায় খুঁজুন', voice: 'ভয়েসে খুঁজুন', chat: 'বাংলায় কথা বলুন' },
      kn: { find: 'ಹತ್ತಿರ ಚಿತ್ರಕಾರ ಬೇಕು', search: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಹುಡುಕಿ', voice: 'ಧ್ವನಿ ಹುಡುಕಾಟ', chat: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ' },
      gu: { find: 'નજીક રંગારો જોઈએ', search: 'તમારી ભાષામાં શોધો', voice: 'વૉઇસ સર્ચ', chat: 'ગુજરાતીમાં વાત કરો' }
    };

    const d = langDemos[code];
    const findEl = document.getElementById('lang-demo-find');
    const searchEl = document.getElementById('lang-demo-search');
    const voiceEl = document.getElementById('lang-demo-voice');
    const chatEl = document.getElementById('lang-demo-chat');

    if (findEl) findEl.textContent = d.find;
    if (searchEl) searchEl.textContent = d.search;
    if (voiceEl) voiceEl.textContent = d.voice;
    if (chatEl) chatEl.textContent = d.chat;

    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('on'));
    const targetBtn = document.querySelector(`[data-lang="${code}"]`);
    if (targetBtn) targetBtn.classList.add('on');
  };

  return (
    <>
      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeRight { from { opacity: 0; transform: translateX(32px) } to { opacity: 1; transform: translateX(0) } }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-[60px] py-3.5 md:py-4 bg-white/80 backdrop-blur-xl border-b border-[#dde9f3]/50 transition-all duration-300">
        <Link href="/" className="shrink-0 block">
          <Logo size="lg" />
        </Link>
        <div className="hidden lg:flex gap-8 items-center">
          <Link href="#services" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">Services</Link>
          <Link href="#how" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">How it Works</Link>
          <Link href="#pricing" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">Pricing</Link>
          <Link href="#workers" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">For Workers</Link>
        </div>
        <div className="flex gap-2.5 md:gap-4 items-center">
          <Link href="/login" className="px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-[#c8dff0] text-[#3d7ab5] no-underline text-[0.82rem] md:text-[0.9rem] font-semibold transition-all duration-300 hover:bg-[#f0f7ff] hover:border-[#3d7ab5]">
            Log In
          </Link>
          <Link href="/signup" className="bg-[#3d7ab5] text-white px-5 md:px-8 py-2 md:py-2.5 rounded-full text-[0.82rem] md:text-[0.9rem] font-bold no-underline transition-all duration-300 shadow-[0_4px_12px_rgba(61,122,181,0.2)] hover:bg-[#2c5f8a] hover:shadow-[0_8px_20px_rgba(61,122,181,0.3)] hover:-translate-y-0.5 active:translate-y-0 shrink-0">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 items-center px-6 md:px-[60px] pt-[100px] md:pt-[120px] pb-16 gap-[40px] md:gap-[60px] bg-[radial-gradient(ellipse_at_top_right,rgba(61,122,181,0.05)_0%,rgba(255,255,255,1)_60%)] relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3d7ab5]/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#1a8c4e]/3 blur-[100px] rounded-full -z-10"></div>

        <div className="relative z-10 w-full text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#c8dff0] text-[#3d7ab5] px-4 py-1.5 rounded-full text-[0.78rem] md:text-[0.82rem] font-bold mb-6 animate-[fadeUp_0.6s_ease_both] shadow-sm">
            <div className="w-1.5 h-1.5 bg-[#3d7ab5] rounded-full animate-[pulse_2s_infinite]"></div>
            India's Trusted Blue-Collar Platform
          </div>
          <h1 className="font-serif text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold leading-[1.05] text-[#1a2533] mb-6 animate-[fadeUp_0.6s_0.1s_ease_both]">
            Hire <span className="relative inline-block"><em className="italic text-[#3d7ab5] relative z-10">skilled workers</em><div className="absolute bottom-2 left-0 w-full h-3 bg-[#3d7ab5]/10 -rotate-1"></div></span> for any job, instantly
          </h1>
          <p className="text-[1.05rem] md:text-[1.15rem] text-[#6b7f93] leading-[1.6] max-w-[540px] mx-auto lg:mx-0 mb-10 animate-[fadeUp_0.6s_0.2s_ease_both]">
            From house cleaning to security guards — find verified, nearby workers in your city within minutes. Chat, call & pay securely — all in one app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-[fadeUp_0.6s_0.3s_ease_both]">
            <Link href="/dashboard" className="bg-[#3d7ab5] text-white px-8 py-4.5 rounded-2xl text-[1.05rem] font-bold no-underline transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(61,122,181,0.4)] inline-flex items-center justify-center gap-2 hover:bg-[#2c5f8a] hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(61,122,181,0.5)]">
              Hire a Worker
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
            <Link href="#workers" className="bg-white text-[#3d7ab5] px-8 py-4.5 rounded-2xl text-[1.05rem] font-bold no-underline border-2 border-[#c8dff0] inline-flex items-center justify-center gap-2 transition-all duration-300 hover:border-[#3d7ab5] hover:bg-[#f0f7ff] shadow-sm">
              <span>🔨</span> Find Work
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-9 animate-[fadeUp_0.6s_0.4s_ease_both] max-w-lg mx-auto lg:mx-0">
            <div className="text-center lg:text-left">
              <div className="font-serif text-[1.5rem] md:text-[2rem] font-extrabold text-[#3d7ab5]">50K+</div>
              <div className="text-[0.7rem] md:text-[0.82rem] font-bold text-[#6b7f93] mt-0.5 uppercase tracking-wider">Workers</div>
            </div>
            <div className="text-center lg:text-left border-x border-[#dde9f3] px-2 md:px-0 md:border-x-0 md:border-l-[3px] md:border-[#c8dff0]/50 md:pl-8">
              <div className="font-serif text-[1.5rem] md:text-[2rem] font-extrabold text-[#3d7ab5]">1.2L+</div>
              <div className="text-[0.7rem] md:text-[0.82rem] font-bold text-[#6b7f93] mt-0.5 uppercase tracking-wider">Jobs Done</div>
            </div>
            <div className="text-center lg:text-left md:border-l-[3px] md:border-[#c8dff0]/50 md:pl-8">
              <div className="font-serif text-[1.5rem] md:text-[2rem] font-extrabold text-[#3d7ab5]">8</div>
              <div className="text-[0.7rem] md:text-[0.82rem] font-bold text-[#6b7f93] mt-0.5 uppercase tracking-wider">Langs</div>
            </div>
          </div>
        </div>
        <div className="w-full lg:flex flex-col gap-4 animate-[fadeRight_0.8s_0.3s_ease_both] relative z-10 max-w-[500px] mx-auto">
          <div className="bg-white border border-[#dde9f3] rounded-[20px] p-5 shadow-[0_4px_24px_rgba(61,122,181,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.15)] hover:border-[#c8dff0] bg-gradient-to-br from-[#3d7ab5] to-[#2c5f8a] border-transparent shadow-lg text-white">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[1.4rem] shrink-0">👨‍🎨</div>
              <div>
                <div className="font-bold text-[0.95rem] text-white">Ajay Pawar</div>
                <div className="text-[0.78rem] text-white/70 mt-0.5">Painter · ⭐ 4.9 · 0.8km away</div>
              </div>
              <div className="ml-auto font-serif font-extrabold text-white text-[1rem]">₹499/day</div>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-white/20 text-white">✓ Verified</span>
              <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-white/20 text-white">🟢 Available Now</span>
              <Link href="/dashboard" className="ml-auto bg-white text-[#3d7ab5] border-none px-5 py-2 rounded-full font-bold text-[0.85rem] transition-all no-underline hover:bg-white/90 hover:scale-105 active:scale-95">Hire Now</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white border border-[#dde9f3] rounded-[20px] p-5 shadow-[0_4px_24px_rgba(61,122,181,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.15)] hover:border-[#c8dff0]">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-[36px] h-[36px] rounded-full bg-[#eef5fb] flex items-center justify-center text-[1rem] shrink-0">👩‍🍳</div>
                <div>
                  <div className="font-bold text-[0.82rem] text-[#1a2533]">Priya Sharma</div>
                  <div className="text-[0.7rem] text-[#6b7f93]">Cleaner · ★ 4.8</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-[#e6f7ee] text-[#1a8c4e]">🟢 Free</span>
                <span className="ml-auto font-serif font-extrabold text-[#3d7ab5] text-[0.9rem]">₹350/day</span>
              </div>
            </div>
            <div className="bg-white border border-[#dde9f3] rounded-[20px] p-5 shadow-[0_4px_24px_rgba(61,122,181,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.15)] hover:border-[#c8dff0]">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-[36px] h-[36px] rounded-full bg-[#eef5fb] flex items-center justify-center text-[1rem] shrink-0">👨‍🔧</div>
                <div>
                  <div className="font-bold text-[0.82rem] text-[#1a2533]">Suresh M.</div>
                  <div className="text-[0.7rem] text-[#6b7f93]">Carpenter · ★ 4.7</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-[#eef5fb] text-[#3d7ab5]">📍 2km</span>
                <span className="ml-auto font-serif font-extrabold text-[#3d7ab5] text-[0.9rem]">₹600/day</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center bg-[#eef5fb] rounded-[12px] p-2.5 md:p-[10px_14px]">
            <div className="text-[0.75rem] font-bold text-[#3d7ab5] shrink-0">🌐 App available in:</div>
            <div className="flex gap-1.5 flex-wrap">
              {['EN', 'हि', 'मराठी', 'தமிழ்', 'తె', 'বাং', 'ಕ', 'ગુ'].map((l, i) => (
                <div key={i} className={`px-2.5 py-1 rounded-full text-[0.72rem] font-bold border border-[#c8dff0] ${i===0?'bg-[#3d7ab5] text-white':'bg-white text-[#3d7ab5]'}`}>{l}</div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#d63b3b] rounded-[12px] p-2.5 md:p-[10px_14px] text-white">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[1rem] shrink-0">🎙️</div>
            <span className="text-[0.78rem] font-semibold">Mic search — speak in any language to find workers</span>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <div className="bg-[#3d7ab5] px-5 md:px-[60px] py-5 flex gap-0 overflow-x-auto scrollbar-hide">
        {[
          { icon: '✅', text: 'Background Verified Workers' },
          { icon: '🔒', text: 'Phone Numbers Hidden · Secure Chat' },
          { icon: '🌐', text: '8 Indian Languages' },
          { icon: '🎙️', text: 'Voice Search in Any Language' },
          { icon: '📍', text: 'Live Map — Find Workers Nearby' },
          { icon: '💰', text: 'Secure UPI / Card Payments' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 px-7 border-r border-white/15 last:border-none whitespace-nowrap shrink-0">
            <span className="text-[1.2rem]">{item.icon}</span>
            <span className="text-[0.82rem] font-semibold text-white/90">{item.text}</span>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section id="services" className="py-20 px-6 md:px-[60px] bg-white">
        <div className="reveal text-center mb-[52px]">
          <div className="text-[0.75rem] font-bold text-[#3d7ab5] tracking-[4px] uppercase mb-4 opacity-70">Categories</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] mb-5 text-[#1a2533]">Every blue-collar service,<br className="hidden md:block"/> under one roof</h2>
          <p className="text-[#6b7f93] text-[1rem] md:text-[1.1rem] max-w-[560px] leading-[1.6] mx-auto">From your home to your office — hire from 15+ service categories, all within minutes of your location.</p>
        </div>
        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: '🎨', name: 'Painter', rate: '₹350/day', desc: 'Interior, exterior, waterproofing. Verified painters near you.' },
            { icon: '🔨', name: 'Carpenter', rate: '₹450/day', desc: 'Furniture repair, custom woodwork, modular fitting.' },
            { icon: '🚿', name: 'Plumber', rate: '₹300/job', desc: 'Pipe leaks, tap fitting, tank cleaning, bathroom repair.' },
            { icon: '⚡', name: 'Electrician', rate: '₹400/job', desc: 'Wiring, MCB repair, fan & AC fitting, switchboard work.' },
            { icon: '🏠', name: 'House Cleaner', rate: '₹250/day', desc: 'Deep cleaning, daily help, post-renovation cleanup.' },
            { icon: '🚗', name: 'Car Wash', rate: '₹149/wash', desc: 'At-home car and bike cleaning, interior detailing.' },
            { icon: '🛡️', name: 'Security Guard', rate: '₹600/day', desc: 'Trained guards for offices, events, residences.' },
            { icon: '💼', name: 'Office Staff', rate: '₹400/day', desc: 'Peons, helpers, office boys for corporate offices.' }
          ].map((item, i) => (
            <div key={i} className="group relative bg-[#f8fbff] border border-[#dde9f3] rounded-[24px] p-6 transition-all duration-400 cursor-pointer hover:bg-white hover:border-[#3d7ab5] hover:shadow-[0_20px_40px_-10px_rgba(61,122,181,0.15)] hover:-translate-y-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-5 group-hover:bg-[#3d7ab5] shadow-[#3d7ab5]/5 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-[1.1rem] text-[#1a2533] mb-1.5">{item.name}</h3>
              <div className="text-[0.85rem] text-[#3d7ab5] font-bold mb-3 px-2 py-0.5 bg-[#3d7ab5]/5 inline-block rounded-md tracking-tight">{item.rate}</div>
              <p className="text-[0.9rem] text-[#6b7f93] leading-[1.5]">{item.desc}</p>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-300">
                <svg className="w-5 h-5 text-[#3d7ab5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 md:px-[60px] bg-[#fdfdfd] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="reveal">
          <div className="text-[0.75rem] font-bold text-[#3d7ab5] tracking-[4px] uppercase mb-4 opacity-70">Process</div>
          <h2 className="font-serif text-[clamp(2.2rem,4vw,3rem)] font-extrabold leading-[1.1] mb-6 text-[#1a2533]">Book a worker in<br className="hidden md:block"/> under 5 minutes</h2>
          <p className="text-[#6b7f93] text-[1.1rem] leading-[1.6] mb-12 max-w-[500px]">Getting help has never been easier. Search, book, chat, and pay — entirely within the app.</p>
          <div className="space-y-10">
            {[
              { num: '01', title: 'Search or speak your need', desc: 'Type or use the 🎙️ voice mic to search in your language. Filter by location, distance, price, and availability.' },
              { num: '02', title: 'Browse verified profiles', desc: 'See background-verified workers on a live map. Read ratings, check availability, and compare prices.' },
              { num: '03', title: 'Chat, call & book securely', desc: 'Message or call via in-app — your phone number stays hidden. Book instantly and pay safely after job completion.' },
              { num: '04', title: 'Rate & repeat', desc: 'Leave a rating, re-hire your favourites, and build a trusted network of workers for your home or office.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="text-[2.2rem] font-serif font-extrabold text-[#3d7ab5]/15 group-hover:text-[#3d7ab5]/40 transition-colors leading-none pt-1">{step.num}</div>
                <div>
                  <h3 className="font-bold text-[1.15rem] text-[#1a2533] mb-2">{step.title}</h3>
                  <p className="text-[#6b7f93] text-[0.95rem] leading-[1.6] max-w-[400px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal relative">
           <div className="absolute -inset-4 bg-gradient-to-tr from-[#3d7ab5]/10 to-[#1a8c4e]/5 rounded-[40px] blur-2xl -z-10"></div>
           <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(61,122,181,0.15)] border border-[#dde9f3]/50">
            <div className="bg-[#f0f7ff] border border-[#c8dff0] rounded-2xl p-2 flex items-center gap-3 mb-8 shadow-sm group/search">
              <span className="ml-3 text-[#3d7ab5] text-lg">🔍</span>
              <input type="text" value="Painter in Noida" readOnly className="bg-transparent border-none flex-1 font-sans text-[1rem] text-[#1a2533] outline-none"/>
              <button className="bg-[#3d7ab5] text-white px-5 py-2.5 rounded-xl font-bold text-[0.9rem] shadow-[0_4px_10px_rgba(61,122,181,0.2)]">Search</button>
            </div>
            
            <div className="space-y-4">
              {[
                { av: '👨‍🎨', name: 'Ajay Pawar', role: 'Painter · ⭐ 4.9', dist: '0.8km', price: '₹499/day' },
                { av: '👨‍🎨', name: 'Ravi Shankar', role: 'Painter · ⭐ 4.7', dist: '2.3km', price: '₹380/day' },
                { av: '👨‍🎨', name: 'Mohan Lal', role: 'Painter · ⭐ 4.8', dist: '3.1km', price: '₹420/day' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-[#dde9f3] bg-white transition-all hover:border-[#3d7ab5] hover:shadow-md hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center text-xl shrink-0">{item.av}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[1rem] text-[#1a2533] truncate">{item.name}</div>
                    <div className="text-[0.8rem] text-[#6b7f93]">{item.role}</div>
                    <div className="mt-1"><span className="text-[0.7rem] font-bold px-2 py-0.5 rounded-full bg-[#e6f7ee] text-[#1a8c4e]">{item.dist}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif font-extrabold text-[#3d7ab5] text-[1.1rem] mb-1">{item.price}</div>
                    <button className="bg-[#3d7ab5]/10 text-[#3d7ab5] hover:bg-[#3d7ab5] hover:text-white transition-colors py-1.5 px-4 rounded-lg text-[0.8rem] font-bold">Details</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#3d7ab5] to-[#2c5f8a] text-white flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📍</div>
                  <div className="text-[0.85rem] font-bold">12 Painters near you</div>
               </div>
               <button className="text-[0.75rem] font-extrabold uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">View Map</button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-6 md:px-[60px] bg-[#eef5fb]">
        <div className="reveal text-center mb-[52px]">
          <div className="text-[0.82rem] font-bold text-[#3d7ab5] tracking-[2px] uppercase mb-3">Pricing</div>
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.2] mb-4">Simple, transparent pricing<br/>for employers</h2>
          <p className="text-[#6b7f93] text-[1rem] max-w-[520px] leading-[1.7] mx-auto">Post your first job from just ₹99. No hidden fees, no subscription required.</p>
        </div>
        <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5.5">
          {[
            { name: 'Basic', price: '₹99', period: 'per job post', feats: ['7-day listing', 'Up to 10 applications', 'Standard placement', 'Basic search visibility', 'In-app chat'] },
            { popular: true, name: 'Featured', price: '₹249', period: 'per job post', feats: ['30-day listing', 'Unlimited applications', 'Top placement in search', 'Highlighted listing', 'Priority support', 'In-app chat + calls'] },
            { name: 'Hire via Laborgro', price: '5%', period: 'of total job value', feats: ['Secure escrow payments', 'Dispute resolution included', 'Background-verified workers', 'Pay only after job done', 'Full transaction protection'] }
          ].map((plan, i) => (
            <div key={i} className={`bg-white border-2 border-[#dde9f3] rounded-[20px] p-[28px_24px] transition-all duration-300 relative ${plan.popular?'border-[#3d7ab5] shadow-[0_16px_48px_rgba(61,122,181,0.18)] lg:-translate-y-2':''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3d7ab5] text-white text-[0.72rem] font-extrabold px-4 py-1 rounded-full whitespace-nowrap">⭐ Most Popular</div>}
              <div className="font-extrabold text-[1rem] mb-1.5">{plan.name}</div>
              <div className="font-serif text-[2.6rem] font-extrabold text-[#3d7ab5] leading-none mb-1">{plan.price}</div>
              <div className="text-[0.82rem] text-[#6b7f93] mb-5">{plan.period}</div>
              <div className="flex flex-col gap-2 mb-5.5">
                {plan.feats.map((f, j) => (
                  <div key={j} className="text-[0.85rem] text-[#6b7f93] flex items-center gap-2 before:content-['✓'] before:text-[#1a8c4e] before:font-extrabold shrink-0">{f}</div>
                ))}
              </div>
              <button className={`w-full py-4 rounded-[16px] font-bold text-[1rem] cursor-pointer transition-all duration-300 ${plan.popular?'bg-[#3d7ab5] text-white border-none shadow-[0_4px_12px_rgba(61,122,181,0.2)] hover:bg-[#2c5f8a] hover:shadow-[0_6px_20px_rgba(61,122,181,0.3)]':'bg-[#f0f7ff] text-[#3d7ab5] border-2 border-[#c8dff0] hover:bg-[#3d7ab5] hover:text-white hover:border-[#3d7ab5]'}`}>Post {plan.name} Job</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WORKERS */}
      <section id="workers" className="py-24 px-6 md:px-[60px] bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f0f7ff]/50 rounded-l-[100px] -z-10 translate-x-20"></div>
        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <div className="text-[0.75rem] font-bold text-[#3d7ab5] tracking-[4px] uppercase mb-4 opacity-70">For Skilled Workers</div>
            <h2 className="font-serif text-[clamp(2.4rem,4.5vw,3.2rem)] font-extrabold leading-[1.05] mb-6 text-[#1a2533]">Start earning more with <em className="italic text-[#3d7ab5]">zero commission</em></h2>
            <p className="text-[#6b7f93] text-[1.1rem] leading-[1.7] mb-12 max-w-[540px]">Join India's fastest-growing platform for blue-collar workers. Get job alerts in your local language, talk directly to customers, and keep 100% of what you earn.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
               {[
                 { icon: '💰', title: '0% Commission', desc: 'Keep all your earnings. We don\'t take a cut from your hard work.' },
                 { icon: '📱', title: 'Direct Access', desc: 'Chat and call customers directly. No middleman involved.' },
                 { icon: '🗺️', title: 'Local Jobs', desc: 'Find work within 2-5km of your location to save on travel.' },
                 { icon: '💬', title: 'Speak & Work', desc: 'Full support for 8 Indian languages. Use your voice to search.' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-[#f0f7ff] text-[#3d7ab5] flex items-center justify-center text-[1.4rem] shrink-0 font-bold transition-transform group-hover:scale-110">{item.icon}</div>
                   <div>
                     <h4 className="font-bold text-[1.05rem] text-[#1a2533] mb-1">{item.title}</h4>
                     <p className="text-[#6b7f93] text-[0.88rem] leading-[1.5]">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="bg-[#3d7ab5] text-white px-10 py-4.5 rounded-2xl text-[1rem] font-bold no-underline transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(61,122,181,0.4)] hover:bg-[#2c5f8a] hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(61,122,181,0.5)] text-center">Join as Worker Today</Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-[#f8fbff] rounded-[48px] p-8 md:p-12 relative z-10 border border-[#dde9f3] shadow-[0_40px_80px_-20px_rgba(61,122,181,0.1)]">
               <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-md">👨‍🔧</div>
                  <div>
                    <h3 className="font-bold text-xl text-[#1a2533]">Worker Dashboard</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-[#1a8c4e] rounded-full animate-pulse"></div>
                      <span className="text-[#1a8c4e] text-sm font-bold uppercase tracking-wider">Active Now</span>
                    </div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#dde9f3]/50 flex items-center justify-between transition-transform hover:scale-[1.02] cursor-default">
                     <div>
                        <div className="text-[0.65rem] font-extrabold text-[#3d7ab5] uppercase tracking-[1.5px] mb-1.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#3d7ab5] rounded-full"></span> New job</div>
                        <div className="font-bold text-[1rem] text-[#1a2533]">Need Carpenter for Wardrobe</div>
                     </div>
                     <div className="text-[#3d7ab5] font-serif font-extrabold text-xl">₹600</div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#dde9f3]/50 flex items-center justify-between opacity-50 grayscale-[0.2]">
                     <div>
                        <div className="text-[0.65rem] font-extrabold text-[#6b7f93] uppercase tracking-[1.5px] mb-1.5">2 hours ago</div>
                        <div className="font-bold text-[1rem] text-[#1a2533]">House Cleaning Service</div>
                     </div>
                     <div className="text-[#6b7f93] font-serif font-extrabold text-xl">₹350</div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-[#dde9f3]/50 flex items-center justify-between transition-transform hover:scale-[1.02] cursor-default">
                     <div>
                        <div className="text-[0.65rem] font-extrabold text-[#1a8c4e] uppercase tracking-[1.5px] mb-1.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#1a8c4e] rounded-full"></span> Customer Chat</div>
                        <div className="font-bold text-[1rem] text-[#1a2533]">"Available for job today?"</div>
                     </div>
                     <button className="bg-[#1a8c4e] text-white px-5 py-2 rounded-xl text-[0.8rem] font-bold shadow-md shadow-[#1a8c4e]/20">Reply</button>
                  </div>
               </div>

               <div className="mt-10 pt-10 border-t border-[#dde9f3] flex justify-between items-center">
                  <div>
                    <div className="text-[0.7rem] font-bold text-[#6b7f93] uppercase tracking-wider mb-1.5">Monthly Earnings</div>
                    <div className="font-serif text-3xl font-extrabold text-[#1a2533]">₹14,500</div>
                  </div>
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => <div key={i} className={`w-10 h-10 rounded-full border-[3px] border-white shadow-sm bg-[#dde9f3]`}></div>)}
                    <div className="w-10 h-10 rounded-full border-[3px] border-white bg-[#3d7ab5] text-white text-[0.75rem] flex items-center justify-center font-bold shadow-sm">+12</div>
                  </div>
               </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#3d7ab5]/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#1a8c4e]/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      <section id="languages" className="py-24 px-6 md:px-[60px] bg-[#f8fbff] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(61,122,181,0.05),transparent_50%)]"></div>
        <div className="reveal bg-gradient-to-br from-[#3d7ab5] to-[#2c5f8a] rounded-[48px] p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 shadow-[0_40px_100px_-20px_rgba(61,122,181,0.3)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div>
            <div className="text-[0.75rem] font-bold text-white/60 tracking-[4px] uppercase mb-4">Linguistic Accessibility</div>
            <h2 className="font-serif text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold text-white mb-6 leading-[1.1]">Built for every<br/>Indian worker</h2>
            <p className="text-white/80 text-[1.1rem] leading-[1.7] mb-10 max-w-[500px]">Not just translated labels — the entire platform speaks your language. Every screen, every button, every message. Use the voice microphone to speak your search instead of typing.</p>
            
            <div className="flex gap-3 flex-wrap mb-10">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'mr', label: 'मराठी' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'bn', label: 'বাংলা' },
                { code: 'kn', label: 'ಕನ್ನಡ' },
                { code: 'gu', label: 'ગુજરાતી' }
              ].map((l, i) => (
                <button
                  key={i}
                  data-lang={l.code}
                  onClick={() => setLang(l.code)}
                  className={`lang-btn px-6 py-3 rounded-2xl border-2 border-white/20 text-[0.9rem] font-bold cursor-pointer transition-all duration-300 ${
                    i === 0
                      ? 'on bg-white text-[#3d7ab5] border-white shadow-lg'
                      : 'text-white bg-white/5 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-white/90 bg-black/10 p-5 rounded-3xl border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🎙️</div>
              <div>
                <div className="font-bold text-[1rem]">Voice Search Enabled</div>
                <div className="text-[0.85rem] text-white/60 mt-0.5">Hold to speak & find work instantly</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
             {[
               { icon: '🇮🇳', title: 'Find a Painter near me', sub: 'Search in your local language', meta: '12 active', id: 'lang-demo-find' },
               { icon: '🗺️', title: 'Local Job Alerts', sub: 'Get notifications in 8 languages', meta: 'Instant', id: 'lang-demo-voice' },
               { icon: '💬', title: 'Chat Translation', sub: 'Real-time message translation', meta: 'Real-time', id: 'lang-demo-chat' }
             ].map((item, i) => (
               <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-6 flex items-center gap-5 transition-transform hover:scale-[1.03]">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[1.8rem] shrink-0">{item.icon}</div>
                 <div>
                   <div id={item.id} className="font-bold text-white text-[1.05rem] mb-1">{item.title}</div>
                   <div className="text-white/60 text-[0.85rem]">{item.sub}</div>
                 </div>
                 <div className="ml-auto text-[0.7rem] font-extrabold text-white/40 uppercase tracking-widest">{item.meta}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0f16] text-[#6b7f93] px-6 md:px-[60px] pt-24 pb-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3d7ab5]/20 to-transparent"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="mb-8 block">
              <Logo size="lg" variant="white" />
            </Link>
            <p className="text-[0.95rem] leading-[1.8] max-w-[300px] mb-8">
              Empowering India's blue-collar workforce through language-first technology and direct-to-customer connection.
            </p>
            <div className="flex gap-4">
              {['𝕏', 'fb', 'ig', 'in'].map(s => (
                <div key={s} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold hover:bg-[#3d7ab5] hover:text-white transition-all cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>
          
          {[
            { 
              title: 'Top Services', 
              links: [
                { name: 'Home Painting', href: '#services' },
                { name: 'Carpentry Work', href: '#services' },
                { name: 'House Cleaning', href: '#services' },
                { name: 'Plumbing Repair', href: '#services' },
                { name: 'Electrician Services', href: '#services' },
                { name: 'Security Guards', href: '#services' }
              ] 
            },
            { 
              title: 'For You', 
              links: [
                { name: 'About Laborgro', href: '#' },
                { name: 'How it Works', href: '#how' },
                { name: 'For Workers', href: '#workers' },
                { name: 'Pricing Plans', href: '#pricing' },
                { name: 'Safety Centers', href: '#' },
                { name: 'Help Desk', href: 'mailto:laborgrow@gmail.com' }
              ] 
            },
            { 
              title: 'Legal', 
              links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Worker Agreement', href: '#' },
                { name: 'Trust & Safety', href: '#' }
              ] 
            }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-8 text-[1rem] tracking-wider uppercase text-sm">{col.title}</h4>
              <ul className="list-none p-0 space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-[#6b7f93] no-underline text-[0.9rem] transition-colors hover:text-[#3d7ab5] flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3d7ab5]/0 group-hover:bg-[#3d7ab5] transition-all"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/5 pt-12 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-[0.88rem]">
            © 2025 <span className="text-white font-bold">Laborgro Technologies Private Limited</span>.
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[0.8rem] font-bold uppercase tracking-widest text-[#3d7ab5]/60">
            <span className="flex items-center gap-2 border border-[#3d7ab5]/20 px-4 py-2 rounded-full bg-[#3d7ab5]/5">
              <span className="text-lg">🇮🇳</span> Built for India
            </span>
            <span className="flex items-center gap-2 border border-[#3d7ab5]/20 px-4 py-2 rounded-full bg-[#3d7ab5]/5">
              <span className="text-lg">🌐</span> 8 Languages
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

