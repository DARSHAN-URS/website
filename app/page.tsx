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
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <svg className="w-[42px] h-[30px] transition-transform group-hover:scale-105" viewBox="0 0 100 60" fill="none">
            <path d="M10 45C10 45 25 10 50 10C75 10 90 45 90 45L75 55C75 55 65 30 50 30C35 30 25 55 25 55L10 45Z" fill="white" stroke="#3d7ab5" strokeWidth="6" strokeLinejoin="round"/>
            <path d="M45 42L50 54L55 42" stroke="#3d7ab5" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="2" fill="#3d7ab5"/>



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
        <div className="flex gap-4 items-center">
          <Link href="/login" className="px-6 py-2.5 rounded-full border border-[#c8dff0] text-[#3d7ab5] no-underline text-[0.9rem] font-semibold transition-all duration-300 hover:bg-[#f0f7ff] hover:border-[#3d7ab5]">
            Log In
          </Link>
          <Link href="/signup" className="bg-[#3d7ab5] text-white px-8 py-2.5 rounded-full text-[0.9rem] font-semibold no-underline transition-all duration-300 shadow-[0_4px_14px_rgba(61,122,181,0.25)] hover:bg-[#2c5f8a] hover:shadow-[0_6px_20px_rgba(61,122,181,0.35)] hover:-translate-y-0.5 active:translate-y-0">
            Sign Up
          </Link>
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
          <div className="flex gap-4 flex-wrap mb-12 animate-[fadeUp_0.6s_0.3s_ease_both]">
            <Link href="/dashboard" className="bg-[#3d7ab5] text-white px-8 py-4 rounded-full text-[1rem] font-bold no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(61,122,181,0.3)] inline-flex items-center gap-2 hover:bg-[#2c5f8a] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(61,122,181,0.4)]">Hire a Worker →</Link>
            <Link href="#workers" className="bg-transparent text-[#3d7ab5] px-8 py-4 rounded-full text-[1rem] font-bold no-underline border-2 border-[#c8dff0] inline-flex items-center gap-2 transition-all duration-300 hover:border-[#3d7ab5] hover:bg-[#f0f7ff]">🔨 Find Work</Link>
          </div>
          <div className="flex gap-9 animate-[fadeUp_0.6s_0.4s_ease_both] flex-wrap">
            <div className="border-l-[3px] border-[#c8dff0] pl-4"><div className="font-serif text-[1.8rem] font-extrabold text-[#3d7ab5]">50K+</div><div className="text-[0.82rem] text-[#6b7f93] mt-0.5">Verified Workers</div></div>
            <div className="border-l-[3px] border-[#c8dff0] pl-4"><div className="font-serif text-[1.8rem] font-extrabold text-[#3d7ab5]">1.2L+</div><div className="text-[0.82rem] text-[#6b7f93] mt-0.5">Jobs Completed</div></div>
            <div className="border-l-[3px] border-[#c8dff0] pl-4"><div className="font-serif text-[1.8rem] font-extrabold text-[#3d7ab5]">8</div><div className="text-[0.82rem] text-[#6b7f93] mt-0.5">Indian Languages</div></div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-3.5 animate-[fadeRight_0.8s_0.3s_ease_both] relative z-10">
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
            <div className="bg-[#f0f7ff] border border-[#c8dff0] rounded-full p-1.5 flex items-center gap-3 mb-4 shadow-sm relative group/search">
              <span className="ml-3 text-[#3d7ab5]">🔍</span>
              <input type="text" value="Painter in Noida" readOnly className="bg-transparent border-none flex-1 font-sans text-[0.95rem] text-[#1a2533] outline-none"/>
              <div className="flex items-center gap-2 px-2 border-r border-[#c8dff0] mr-1">
                 <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d7ab5] hover:bg-white transition-all" title="Voice Search">🎙️</button>
              </div>
              <button className="bg-[#3d7ab5] text-white border-none px-6 py-2.5 rounded-full font-bold cursor-pointer text-[0.88rem] transition-all hover:bg-[#2c5f8a] shadow-sm">Search</button>
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
              <button className={`w-full py-4 rounded-[16px] font-bold text-[1rem] cursor-pointer transition-all duration-300 ${plan.popular?'bg-[#3d7ab5] text-white border-none shadow-[0_4px_12px_rgba(61,122,181,0.2)] hover:bg-[#2c5f8a] hover:shadow-[0_6px_20px_rgba(61,122,181,0.3)]':'bg-[#f0f7ff] text-[#3d7ab5] border-2 border-[#c8dff0] hover:bg-[#3d7ab5] hover:text-white hover:border-[#3d7ab5]'}`}>Post {plan.name} Job</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WORKERS */}
      <section id="workers" className="py-24 px-6 md:px-[60px] bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f0f7ff] rounded-l-[100px] -z-10 translate-x-20 opacity-50"></div>
        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[0.82rem] font-bold text-[#3d7ab5] tracking-[2px] uppercase mb-3 text-left">For Skilled Workers</div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] mb-6 text-[#1a2533]">Start earning more with <em className="italic text-[#3d7ab5]">zero commission</em></h2>
            <p className="text-[#6b7f93] text-[1.1rem] leading-[1.7] mb-10 max-w-[500px]">Join India's fastest-growing platform for blue-collar workers. Get job alerts in your local language, talk directly to customers, and keep 100% of what you earn.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
               {[
                 { icon: '💰', title: '0% Commission', desc: 'Keep all your earnings. We don\'t take a cut from your hard work.' },
                 { icon: '📱', title: 'Direct Access', desc: 'Chat and call customers directly. No middleman involved.' },
                 { icon: '🗺️', title: 'Local Jobs', desc: 'Find work within 2-5km of your location to save on travel.' },
                 { icon: '💬', title: 'Speak & Work', desc: 'Full support for 8 Indian languages. Use your voice to search.' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-[#eef5fb] text-[#3d7ab5] flex items-center justify-center text-[1.2rem] shrink-0 font-bold">{item.icon}</div>
                   <div>
                     <div className="font-bold text-[0.95rem] mb-1">{item.title}</div>
                     <div className="text-[#6b7f93] text-[0.82rem] leading-[1.5]">{item.desc}</div>
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex gap-4">
              <Link href="/signup" className="bg-[#3d7ab5] text-white px-10 py-4 rounded-full text-[1rem] font-bold no-underline transition-all duration-300 shadow-[0_4px_20px_rgba(61,122,181,0.3)] hover:bg-[#2c5f8a] hover:-translate-y-0.5">Join as Worker →</Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-[#eef5fb] rounded-[40px] p-8 md:p-12 relative z-10 border border-[#c8dff0]">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">👨‍🔧</div>
                  <div>
                    <div className="font-bold text-lg">Worker Dashboard</div>
                    <div className="text-[#3d7ab5] text-sm font-bold">🟢 Active & Looking for Work</div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#dde9f3] flex items-center justify-between">
                     <div>
                        <div className="text-[0.7rem] font-bold text-[#6b7f93] uppercase tracking-wider mb-1">New Job Alert</div>
                        <div className="font-bold text-[0.95rem]">Need Carpenter for Wardrobe</div>
                     </div>
                     <div className="text-[#3d7ab5] font-serif font-extrabold">₹600</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#dde9f3] flex items-center justify-between opacity-60">
                     <div>
                        <div className="text-[0.7rem] font-bold text-[#6b7f93] uppercase tracking-wider mb-1">2 hours ago</div>
                        <div className="font-bold text-[0.95rem]">House Cleaning Service</div>
                     </div>
                     <div className="text-[#3d7ab5] font-serif font-extrabold">₹350</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#dde9f3] flex items-center justify-between">
                     <div>
                        <div className="text-[0.7rem] font-bold text-[#6b7f93] uppercase tracking-wider mb-1">In-App Chat</div>
                        <div className="font-bold text-[0.95rem]">"Available for job today?"</div>
                     </div>
                     <button className="bg-[#1a8c4e] text-white px-4 py-1.5 rounded-full text-[0.75rem] font-bold">Reply</button>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-[#c8dff0] flex justify-between items-center">
                  <div>
                    <div className="text-[0.7rem] font-bold text-[#6b7f93] uppercase mb-1">Monthly Earnings</div>
                    <div className="font-serif text-2xl font-extrabold text-[#1a2533]">₹14,500</div>
                  </div>
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#dde9f3]"></div>)}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#3d7ab5] text-white text-[0.6rem] flex items-center justify-center font-bold">+12</div>
                  </div>
               </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#3d7ab5]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#3d7ab5]/10 rounded-full blur-3xl -z-10"></div>
          </div>
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
                <button
                  key={i}
                  data-lang={l.code}
                  onClick={() => setLang(l.code)}
                  className={`lang-btn px-5 py-2.5 rounded-full border-2 border-white/30 text-[0.88rem] font-bold cursor-pointer transition-all duration-300 ${
                    i === 0
                      ? 'on bg-white text-[#3d7ab5] border-white'
                      : 'text-white bg-white/10 hover:bg-white hover:text-[#3d7ab5] hover:border-white'
                  }`}
                >
                  {l.label}
                </button>
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
            { 
              title: 'Services', 
              links: [
                { name: 'Painting', href: '#services' },
                { name: 'Carpentry', href: '#services' },
                { name: 'House Cleaning', href: '#services' },
                { name: 'Plumbing', href: '#services' },
                { name: 'Electrician', href: '#services' },
                { name: 'Security Guard', href: '#services' },
                { name: 'Car Wash', href: '#services' },
                { name: 'Office Staff', href: '#services' }
              ] 
            },
            { 
              title: 'Company', 
              links: [
                { name: 'About Us', href: '#' },
                { name: 'How it Works', href: '#how' },
                { name: 'For Workers', href: '#workers' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Safety', href: '#' },
                { name: 'Support: laborgrow@gmail.com', href: 'mailto:laborgrow@gmail.com' }
              ] 
            },
            { 
              title: 'Legal', 
              links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Refund Policy', href: '#' },
                { name: 'Worker Agreement', href: '#' }
              ] 
            }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-4 text-[0.88rem]">{col.title}</h4>
              {col.links.map((link, j) => (
                <Link key={j} href={link.href} className="block text-white/50 no-underline text-[0.85rem] mb-2.25 transition-colors hover:text-white">{link.name}</Link>
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
