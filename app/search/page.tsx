"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search as SearchIcon, MapPin, Star, MessageSquare, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  async function fetchWorkers() {
    setLoading(true);
    let query = supabase.from("employees").select("*");
    
    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,work_details.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query.limit(20);
    if (data) setWorkers(data);
    if (error) console.error("Workers search error:", error.message);
    setLoading(false);
  }

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers();
  };

  const handleHire = (worker: any) => {
    router.push(`/hire/${worker.id}`);
  };

  return (
    <div className="p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif">Search for Workers</h1>
        <p className="text-[#6b7f93] font-medium mt-1">Find skilled help in your neighborhood</p>
      </header>

      <form onSubmit={handleSearch} className="bg-[#eef5fb] border-[1.5px] border-[#dde9f3] rounded-3xl p-6 flex items-center gap-4 mb-10 shadow-sm relative group/search">
        <SearchIcon className="text-[#3d7ab5] w-6 h-6" />
        <div className="flex-1 flex items-center gap-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try 'Painter', 'Plumber' or a name..." 
              className="bg-transparent border-none flex-1 outline-none font-medium text-lg text-[#1a2533] placeholder:text-[#6b7f93]/50"
            />
            <button type="button" className="w-10 h-10 rounded-full flex items-center justify-center text-[#3d7ab5] hover:bg-white transition-all shadow-none hover:shadow-sm" title="Voice Search">
               <Mic className="w-5 h-5" />
            </button>
        </div>
        <button type="submit" className="bg-[#3d7ab5] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#2c5f8a] transition-all">Search</button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workers.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-40 italic font-medium">No nearby workers found. Try another search.</div>
          ) : (
            workers.map((worker) => (
              <div key={worker.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#eef5fb] flex items-center justify-center text-3xl shadow-inner group-hover:bg-[#3d7ab5] group-hover:text-white transition-all duration-300">
                    {worker.avatar_url || "👨🏾‍🔧"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-[#1a2533] truncate">{worker.full_name || 'Anonymous Worker'}</h3>
                      <div className="flex items-center gap-1 text-[#f59e0b] font-bold text-sm shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        {worker.rating || "4.5"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#6b7f93]">
                      <span>{worker.category || "General Worker"}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 text-[#3d7ab5]" /> {worker.city || 'Noida'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#6b7f93] uppercase tracking-widest block">Starts from</span>
                    <span className="font-serif font-extrabold text-[#3d7ab5] text-xl">₹{worker.hourly_rate || "499"}/day</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => router.push(`/messages?user_id=${worker.id}`)}
                      className="p-3 rounded-xl bg-[#eef5fb] text-[#3d7ab5] hover:bg-[#d9e8f5] transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleHire(worker)}
                      className="bg-[#3d7ab5] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#2c5f8a] transition-all"
                    >
                      Hire Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


