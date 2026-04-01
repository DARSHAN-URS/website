"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Send, 
  MapPin, 
  Phone, 
  MoreVertical, 
  Search, 
  User as UserIcon,
  Check,
  CheckCheck,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export default function MessagesPage() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No messages session: Redirecting to login...");
        router.replace('/login');
        return;
      }
      setUser(session.user);
      
      const partnerId = searchParams.get('user_id');
      await fetchChats(session.user.id, partnerId);
    }
    initCheck();
  }, [router, searchParams, setUser]);

  useEffect(() => {
    if (activeChat && user) {
      fetchMessages(activeChat.id);
      
      // Subscribe to real-time updates for messages
      const channel = supabase
        .channel(`chat-${activeChat.id}`)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'chat_messages'
          }, (payload) => {
            const newMsg = payload.new as Message;
            if ((newMsg.sender_id === user.id && newMsg.receiver_id === activeChat.id) ||
                (newMsg.sender_id === activeChat.id && newMsg.receiver_id === user.id)) {
              setMessages(prev => [...prev, newMsg]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchChats(userId: string, newPartnerId?: string | null) {
    setLoading(true);
    try {
      const { data: msgs, error } = await supabase
        .from('chat_messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error) throw error;

      const partnerIds = new Set<string>();
      if (newPartnerId && newPartnerId !== userId) partnerIds.add(newPartnerId);
      
      msgs?.forEach(m => {
        if (m.sender_id !== userId) partnerIds.add(m.sender_id);
        if (m.receiver_id !== userId) partnerIds.add(m.receiver_id);
      });

      if (partnerIds.size === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const partnerIdArr = Array.from(partnerIds);
      
      // Fetch details from employees and employers instead of 'profiles'
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, avatar_url')
        .in('id', partnerIdArr);

      const { data: employers } = await supabase
        .from('employers')
        .select('id, company_name, avatar_url')
        .in('id', partnerIdArr);

      const allUsers = [
        ...(employees || []).map(e => ({ id: e.id, name: e.full_name, avatar: e.avatar_url, role: "Worker" })),
        ...(employers || []).map(e => ({ id: e.id, name: e.company_name, avatar: e.avatar_url, role: "Employer" }))
      ];

      const formattedChats = allUsers.map(p => ({
        id: p.id,
        name: p.name || "Service Professional",
        avatar: p.avatar || "👨🏾",
        role: p.role, 
        lastMsg: "Click to chat", 
        status: "online"
      }));

      console.log("Formatted Chats:", formattedChats);
      setChats(formattedChats);
      
      if (newPartnerId) {
        let target = formattedChats.find(c => c.id === newPartnerId);
        
        // If not found in the list, try fetching it specifically (robust fallback)
        if (!target) {
          console.log("Target not in initial list, fetching specifically for:", newPartnerId);
          const { data: eData } = await supabase.from('employees').select('full_name, avatar_url').eq('id', newPartnerId).maybeSingle();
          if (eData) {
            target = { id: newPartnerId, name: eData.full_name, avatar: eData.avatar_url || "👨🏾‍🔧", role: "Worker", lastMsg: "Starting conversation...", status: "online" };
          } else {
            const { data: emData } = await supabase.from('employers').select('company_name, avatar_url').eq('id', newPartnerId).maybeSingle();
            if (emData) {
              target = { id: newPartnerId, name: emData.company_name, avatar: emData.avatar_url || "🏢", role: "Employer", lastMsg: "Starting conversation...", status: "online" };
            }
          }
          
          if (target) {
            console.log("Found targeted profile:", target);
            setChats(prev => [target, ...prev]);
          }
        }

        if (target) {
          setActiveChat(target);
        } else if (partnerIds.has(newPartnerId)) {
           const placeholder = { id: newPartnerId, name: "Staff User", avatar: "👤", role: "Contact", lastMsg: "Starting conversation...", status: "online" };
           setActiveChat(placeholder);
        }
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
    setLoading(false);
  }

  async function fetchMessages(partnerId: string) {
    if (!user) return;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
    if (error) console.error("Msg fetch error:", error);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    const msgData = {
      sender_id: user.id,
      receiver_id: activeChat.id,
      content: newMessage,
    };

    const { error } = await supabase.from('chat_messages').insert([msgData]);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setNewMessage("");
    }
  }

  return (
    <div className="flex h-[calc(100vh-84px)] overflow-hidden">
      {/* Left Sidebar: Conversations */}
        <div className="w-[380px] bg-white border-r border-[#dde9f3] flex flex-col h-full">
           <div className="p-6 border-b border-[#dde9f3]">
              <h1 className="text-2xl font-extrabold text-[#1a2533] font-serif mb-5">Messages</h1>
              <div className="relative">
                 <Search className="w-4 h-4 text-[#6b7f93] absolute left-4 top-1/2 -translate-y-1/2" />
                 <input type="text" placeholder="Search conversations..." className="w-full pl-11 pr-4 py-3 bg-[#eef5fb] rounded-xl border-none text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#3d7ab5]/10"/>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChat(chat)}
                  className={`p-5 flex items-center gap-4 cursor-pointer transition-all border-b border-[#f8fafd] ${activeChat?.id === chat.id ? 'bg-[#eef5fb] border-l-4 border-l-[#3d7ab5]' : 'hover:bg-gray-50'}`}
                >
                   <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center text-xl shadow-inner border border-white">
                        {chat.avatar}
                      </div>
                      {chat.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1a8c4e] border-2 border-white rounded-full"></div>}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                         <h3 className="font-bold text-[#1a2533] text-sm truncate">{chat.name}</h3>
                         <span className="text-[10px] font-bold text-[#6b7f93] uppercase tracking-wider">{chat.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-hidden">
                         <span className="text-[10px] font-extrabold text-[#3d7ab5] tracking-widest uppercase shrink-0">{chat.role}</span>
                         <span className="text-xs text-[#6b7f93] font-medium truncate shrink">{chat.lastMsg}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Main Content: Chat Window */}
        <div className="flex-1 bg-[#fdfdfd] flex flex-col h-full">
           {activeChat ? (
             <>
               {/* Chat Header */}
               <div className="p-5 bg-white border-b border-[#dde9f3] flex items-center justify-between shadow-sm relative z-10">
                  <div className="flex items-center gap-3.5">
                     <div className="w-10 h-10 rounded-full bg-[#eef5fb] flex items-center justify-center text-lg shrink-0">
                        {activeChat.avatar}
                     </div>
                     <div>
                        <h2 className="text-[15px] font-bold text-[#1a2533]">{activeChat.name}</h2>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1a8c4e] uppercase tracking-widest mt-0.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-[#1a8c4e]"></span> {activeChat.status === 'online' ? 'Active Now' : 'Away'}
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2.5 rounded-xl hover:bg-gray-50 text-[#3d7ab5] transition-all"><Phone className="w-5 h-5" /></button>
                     <button className="p-2.5 rounded-xl hover:bg-gray-50 text-[#6b7f93] transition-all"><MoreVertical className="w-5 h-5" /></button>
                  </div>
               </div>

               {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-white to-[#f8fafd]">
                  {messages.map((msg, i) => {
                    const isUser = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] ${isUser ? 'order-1' : 'order-2'}`}>
                            <div className={`px-5 py-3.5 rounded-[20px] text-sm font-medium shadow-sm transition-all relative ${isUser ? 'bg-[#3d7ab5] text-white rounded-tr-none' : 'bg-white text-[#1a2533] rounded-tl-none border border-[#dde9f3]'}`}>
                               {msg.content}
                               <div className={`flex items-center gap-1 mt-1 text-[9px] ${isUser ? 'justify-end text-white/70' : 'justify-start text-[#6b7f93]'}`}>
                                  {format(new Date(msg.created_at), 'hh:mm a')}
                                  {isUser && <CheckCheck className="w-3 h-3" />}
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
               </div>

               {/* Chat Input */}
               <div className="p-6 bg-white border-t border-[#dde9f3]">
                  <form onSubmit={sendMessage} className="flex items-center gap-4 bg-[#eef5fb] rounded-2xl px-5 py-2.5 border border-[#dde9f3]/50 focus-within:ring-2 focus-within:ring-[#3d7ab5]/10 focus-within:bg-white transition-all">
                     <input 
                       type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
                       placeholder="Typing a message..." 
                       className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-2"
                     />
                     <button type="submit" className="bg-[#3d7ab5] text-white p-3 rounded-xl shadow-lg hover:bg-[#2c5f8a] transition-all active:scale-90">
                        <Send className="w-4 h-4" />
                     </button>
                  </form>
                  <p className="text-[10px] text-center text-[#6b7f93] font-bold mt-4 uppercase tracking-[2px]">Encrypted & Private · Laborgro Secure Chat</p>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-40">
                <div className="w-24 h-24 rounded-full bg-[#eef5fb] flex items-center justify-center mb-6">
                   <MessageSquare className="w-10 h-10 text-[#3d7ab5]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#1a2533] font-serif mb-2">Your Conversations</h3>
                <p className="text-[#6b7f93] font-bold text-center max-w-[280px] uppercase text-[10px] tracking-widest leading-loose">Select a chat to view messages or start hiring to interact with workers.</p>
             </div>
           )}
        </div>
    </div>
  );
}
