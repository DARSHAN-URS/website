"use client";

import React, { useEffect } from "react";
import Link from "next/link";

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
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-[60px] py-4 bg-white/95 backdrop-blur-md border-b border-[#dde9f3] transition-all duration-300">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <svg className="w-[34px] h-[34px]" viewBox="0 0 80 80" fill="none">
            <path d="M16 36 Q20 18 40 16 Q60 18 64 36 Q58 50 40 52 Q22 50 16 36Z" fill="#3d7ab5" fillOpacity="0.9"/>
            <path d="M20 36 Q24 22 40 20 Q56 22 60 36" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx="36" cy="51" r="2.2" fill="white"/>
            <circle cx="40" cy="53" r="2.2" fill="white"/>
            <circle cx="44" cy="51" r="2.2" fill="white"/>
            <rect x="38" y="53" width="4" height="9" rx="2" fill="#3d7ab5"/>
          </svg>
          <div className="font-serif text-2xl font-extrabold text-[#3d7ab5] tracking-tight">Laborgro</div>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="#services" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">Services</Link>
          <Link href="#how" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">How it Works</Link>
          <Link href="#pricing" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">Pricing</Link>
          <Link href="#workers" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">For Workers</Link>
          <Link href="#languages" className="no-underline text-[#6b7f93] text-[0.9rem] font-medium transition-colors duration-200 hover:text-[#3d7ab5]">Languages</Link>
        </div>
        <div className="flex gap-2.5 items-center">
          <Link href="/login" className="px-5 py-2.25 rounded-full border-[1.5px] border-[#c8dff0] text-[#3d7ab5] no-underline text-[0.88rem] font-semibold transition-all duration-200 hover:bg-[#eef5fb]">Log In</Link>
          <Link href="/signup" className="bg-[#3d7ab5] text-white px-5.5 py-2.25 rounded-full text-[0.88rem] font-semibold no-underline transition-all duration-200 shadow-[0_4px_12px_rgba(61,122,181,0.3)] hover:bg-[#2c5f8a] hover:-translate-y-px">Get Started Free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-6 md:px-[60px] pt-[120px] pb-20 gap-[60px] bg-[linear-gradient(145deg,#fff_0%,#eef5fb_100%)] relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#eef5fb] border border-[#c8dff0] text-[#3d7ab5] px-4 py-1.5 rounded-full text-[0.82rem] font-bold mb-5.5 animate-[fadeUp_0.6s_ease_both]">
            <div className="w-2 h-2 bg-[#3d7ab5] rounded-full animate-[pulse_2s_infinite]"></div>
            India's Trusted Blue-Collar Platform
          </div>
          <h1 className="font-serif text-[clamp(2.6rem,5vw,4rem)] font-extrabold leading-[1.1] text-[#1a2533] mb-5 animate-[fadeUp_0.6s_0.1s_ease_both]">
            Hire <em className="italic text-[#3d7ab5]">skilled workers</em> for any job, instantly
          </h1>
          <p className="text-[1.1rem] text-[#6b7f93] leading-[1.7] max-w-[480px] mb-9 animate-[fadeUp_0.6s_0.2s_ease_both]">
            From house cleaning to security guards — find verified, nearby workers in your city within minutes. Chat, call & pay securely — all in one app.
          </p>
          <div className="flex gap-3.5 flex-wrap mb-12 animate-[fadeUp_0.6s_0.3s_ease_both]">
            <Link href="/dashboard" className="bg-[#3d7ab5] text-white px-7 py-3.5 rounded-full text-[0.95rem] font-bold no-underline transition-all duration-200 shadow-[0_4px_20px_rgba(61,122,181,0.35)] inline-flex items-center gap-2 hover:bg-[#2c5f8a] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(61,122,181,0.45)]">Hire a Worker →</Link>
            <Link href="#workers" className="bg-transparent text-[#3d7ab5] px-7 py-3.5 rounded-full text-[0.95rem] font-bold no-underline border-2 border-[#c8dff0] inline-flex items-center gap-2 transition-all duration-200 hover:border-[#3d7ab5] hover:bg-[#eef5fb]">🔨 Find Work</Link>
          </div>
          <div className="flex gap-9 animate-[fadeUp_0.6s_0.4s_ease_both] flex-wrap">
            <div className="border-l-[3px] border-[#c8dff0] pl-4"><div className="font-serif text-[1.8rem] font-extrabold text-[#3d7ab5]">50K+</div><div className="text-[0.82rem] text-[#6b7f93] mt-0.5">Verified Workers</div></div>
            <div className="border-l-[3px] border-[#c8dff0] pl-4"><div className="font-serif text-[1.8rem] font-extrabold text-[#3d7ab5]">1.2L+</div><div className="text-[0.82rem] text-[#6b7f93] mt-0.5">Jobs Completed</div></div>
            <div className="border-l-[3px] border-[#c8dff0] pl-4"><div className="font-serif text-[1.8rem] font-extrabold text-[#3d7ab5]">8</div><div className="text-[0.82rem] text-[#6b7f93] mt-0.5">Indian Languages</div></div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-3.5 animate-[fadeRight_0.8s_0.3s_ease_both] relative z-10">
          <div className="bg-white border-[1.5px] border-[#dde9f3] rounded-[16px] p-[18px] shadow-[0_4px_20px_rgba(61,122,181,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.15)] hover:border-[#c8dff0] bg-gradient-to-br from-[#3d7ab5] to-[#2c5f8a] border-transparent">
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
              <Link href="/dashboard" className="ml-auto bg-white text-[#3d7ab5] border-none px-4 py-1.75 rounded-full font-bold text-[0.8rem] transition-all no-underline">Hire Now</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white border-[1.5px] border-[#dde9f3] rounded-[16px] p-[18px] shadow-[0_4px_20px_rgba(61,122,181,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.15)] hover:border-[#c8dff0]">
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
            <div className="bg-white border-[1.5px] border-[#dde9f3] rounded-[16px] p-[18px] shadow-[0_4px_20px_rgba(61,122,181,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.15)] hover:border-[#c8dff0]">
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
          <div className="text-[0.82rem] font-bold text-[#3d7ab5] tracking-[2px] uppercase mb-3">What we offer</div>
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.2] mb-4">Every blue-collar service,<br/>under one roof</h2>
          <p className="text-[#6b7f93] text-[1rem] max-w-[500px] leading-[1.7] mx-auto">From your home to your office — hire from 15+ service categories, all within minutes of your location.</p>
        </div>
        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
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
            <div key={i} className="bg-[#eef5fb] border-[1.5px] border-[#dde9f3] rounded-[16px] p-[24px_20px] transition-all duration-300 cursor-pointer hover:bg-[#3d7ab5] group hover:text-white hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(61,122,181,0.25)] hover:border-[#3d7ab5]">
              <div className="text-[2rem] mb-3.5 w-[54px] h-[54px] bg-white rounded-[13px] flex items-center justify-center shadow-[0_2px_10px_rgba(61,122,181,0.1)] transition-colors duration-300 group-hover:bg-white/20">{item.icon}</div>
              <div className="font-bold text-[0.95rem] mb-[5px]">{item.name}</div>
              <div className="text-[0.8rem] text-[#3d7ab5] font-bold mb-[6px] group-hover:text-white/80">{item.rate}</div>
              <div className="text-[0.82rem] text-[#6b7f93] leading-[1.5] transition-colors duration-300 group-hover:text-white/80">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 px-6 md:px-[60px] bg-[#eef5fb] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="reveal">
          <div className="text-[0.82rem] font-bold text-[#3d7ab5] tracking-[2px] uppercase mb-3">How it works</div>
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.2] mb-4">Book a worker in<br/>under 5 minutes</h2>
          <p className="text-[#6b7f93] text-[1rem] leading-[1.7] mb-12">Getting help has never been easier. Search, book, chat, and pay — entirely within the app.</p>
          <div className="flex flex-col gap-7">
            {[
              { num: '1', title: 'Search or speak your need', desc: 'Type or use the 🎙️ voice mic to search in your language. Filter by location, distance, price, and availability.' },
              { num: '2', title: 'Browse verified profiles', desc: 'See background-verified workers on a live map. Read ratings, check availability, and compare prices.' },
              { num: '3', title: 'Chat, call & book securely', desc: 'Message or call via in-app — your phone number stays hidden. Book instantly and pay safely after job completion.' },
              { num: '4', title: 'Rate & repeat', desc: 'Leave a rating, re-hire your favourites, and build a trusted network of workers for your home or office.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-[18px] items-start">
                <div className="w-11 h-11 rounded-full bg-[#3d7ab5] text-white font-serif text-[1.1rem] font-extrabold flex items-center justify-center shrink-0">{step.num}</div>
                <div>
                  <div className="font-bold text-[1rem] mb-[5px]">{step.title}</div>
                  <div className="text-[#6b7f93] text-[0.88rem] leading-[1.6]">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal">
          <div className="bg-white rounded-[24px] p-7 shadow-[0_8px_40px_rgba(61,122,181,0.12)]">
            <div className="bg-[#eef5fb] border-[1.5px] border-[#dde9f3] rounded-full p-[12px_18px] flex items-center gap-2.5 mb-4">
              <span>🔍</span>
              <input type="text" value="Painter in Noida" readOnly className="bg-transparent border-none flex-1 font-sans text-[0.9rem] text-[#1a2533] outline-none"/>
              <button className="bg-[#3d7ab5] text-white border-none p-[8px_18px] rounded-full font-semibold cursor-pointer text-[0.85rem]">Search</button>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { av: '👨‍🎨', name: 'Ajay Pawar', role: 'Painter · ⭐ 4.9', dist: '0.8km', price: '₹499/day' },
                { av: '👨‍🎨', name: 'Ravi Shankar', role: 'Painter · ⭐ 4.7', dist: '2.3km', price: '₹380/day' },
                { av: '👨‍🎨', name: 'Mohan Lal', role: 'Painter · ⭐ 4.8', dist: '3.1km', price: '₹420/day' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-[12px_14px] rounded-[12px] border-[1.5px] border-[#dde9f3] transition-all hover:border-[#3d7ab5] hover:bg-[#eef5fb]">
                  <div className="w-10 h-10 rounded-full bg-[#eef5fb] flex items-center justify-center text-[1.15rem] shrink-0">{item.av}</div>
                  <div>
                    <div className="font-bold text-[0.88rem]">{item.name}</div>
                    <div className="text-[0.75rem] text-[#6b7f93]">{item.role}</div>
                    <div className="flex gap-1.5 mt-[3px]"><span className="text-[0.68rem] font-bold px-1.75 py-0.5 rounded-full bg-[#e6f7ee] text-[#1a8c4e]">{item.dist}</span></div>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-1.5">
                    <div className="font-serif font-extrabold text-[#3d7ab5] text-[0.9rem]">{item.price}</div>
                    <button className="bg-[#3d7ab5] text-white border-none p-[6px_14px] rounded-full text-[0.75rem] font-bold cursor-pointer">Chat</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[linear-gradient(135deg,#d4ecd4,#eef5fb)] rounded-[14px] h-[90px] flex items-center justify-center mt-3.5 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle,#b7e4cd_1px,transparent_1px)] bg-[size:22px_22px] opacity-60"></div>
               <div className="bg-white px-3.5 py-1.5 rounded-full text-[0.78rem] font-bold text-[#1a8c4e] shadow-[0_2px_8px_rgba(0,0,0,0.1)] relative z-10">📍 Live Worker Map — 12 painters near you</div>
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
              <button className={`w-full p-3.25 rounded-[13px] font-bold text-[0.9rem] cursor-pointer transition-all duration-200 ${plan.popular?'bg-[#3d7ab5] text-white border-none':'bg-[#eef5fb] text-[#3d7ab5] border-2 border-[#c8dff0] hover:bg-[#3d7ab5] hover:text-white hover:border-[#3d7ab5]'}`}>Post {plan.name} Job</button>
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="languages" className="py-20 px-6 md:px-[60px] bg-white">
        <div className="reveal bg-[linear-gradient(135deg,#3d7ab5,#2c5f8a)] rounded-[28px] p-10 md:p-[60px] grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          <div>
            <div className="text-[0.82rem] font-bold text-white/55 tracking-[2px] uppercase mb-3">Languages</div>
            <h2 className="font-serif text-[2.2rem] font-extrabold text-white mb-3.5 leading-tight">Built for every<br/>Indian worker</h2>
            <p className="text-white/72 text-[1rem] leading-[1.7] mb-6">Not just translated labels — the entire app speaks your language. Every screen, every button, every message. Even if you can't read, use the voice mic to speak your search.</p>
            <div className="flex gap-2.5 flex-wrap">
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
                <button key={i} data-lang={l.code} onClick={() => setLang(l.code)} className={`px-[18px] py-2 rounded-full border-2 border-white/30 text-white text-[0.82rem] font-bold cursor-pointer transition-all ${i===0?'on bg-white text-[#3d7ab5] border-white':'bg-white/10 hover:bg-white hover:text-[#3d7ab5] hover:border-white'}`}>{l.label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
             {[
               { icon: '🇮🇳', title: 'Find a Painter near me', sub: 'Search in your language', meta: '12 workers', id: 'lang-demo-find' },
               { icon: '🎙️', title: 'Voice Search supported', sub: 'Speak — no typing needed', meta: 'All langs', id: 'lang-demo-voice' },
               { icon: '💬', title: 'Chat in your language', sub: 'All messages translated', meta: 'Real-time', id: 'lang-demo-chat' }
             ].map((item, i) => (
               <div key={i} className="bg-white/12 border border-white/20 rounded-[14px] p-[16px_18px] flex items-center gap-3.5">
                 <div className="text-[1.5rem] shrink-0">{item.icon}</div>
                 <div>
                   <div id={item.id} className="font-bold text-white text-[0.9rem]">{item.title}</div>
                   <div className="text-white/65 text-[0.75rem]">{item.sub}</div>
                 </div>
                 <div className="ml-auto text-[0.75rem] font-bold text-white/80">{item.meta}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a2533] text-white/55 px-6 md:px-[60px] pt-[60px] pb-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <svg className="w-7 h-7 opacity-90" viewBox="0 0 80 80" fill="none">
                <path d="M16 36 Q20 18 40 16 Q60 18 64 36 Q58 50 40 52 Q22 50 16 36Z" fill="rgba(255,255,255,0.7)"/>
                <circle cx="36" cy="51" r="2" fill="rgba(255,255,255,0.5)"/>
                <circle cx="40" cy="53" r="2" fill="rgba(255,255,255,0.5)"/>
                <circle cx="44" cy="51" r="2" fill="rgba(255,255,255,0.5)"/>
              </svg>
              <div className="font-serif text-[1.4rem] text-white font-extrabold">Laborgro</div>
            </div>
            <p className="text-[0.85rem] leading-[1.6] max-w-[280px]">India's trusted platform connecting skilled blue-collar workers with customers. 8 languages, live map, in-app chat & calls.</p>
          </div>
          {[
            { title: 'Services', links: ['Painting', 'Carpentry', 'House Cleaning', 'Plumbing', 'Electrician', 'Security Guard', 'Car Wash', 'Office Staff'] },
            { title: 'Company', links: ['About Us', 'How it Works', 'For Workers', 'Pricing', 'Safety', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Worker Agreement'] }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-4 text-[0.88rem]">{col.title}</h4>
              {col.links.map((link, j) => (
                <Link key={j} href="#" className="block text-white/50 no-underline text-[0.85rem] mb-2.25 transition-colors hover:text-white">{link}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-[26px] flex flex-col md:flex-row justify-between items-center text-[0.82rem] gap-2.5">
          <span>© 2025 Laborgro. All rights reserved.</span>
          <span>Made with ❤️ in India &nbsp;·&nbsp; 🌐 8 Languages &nbsp;·&nbsp; 📍 Available Across India</span>
        </div>
      </footer>
    </>
  );
}
