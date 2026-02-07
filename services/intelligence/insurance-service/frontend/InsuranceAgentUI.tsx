import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Bot, 
    User, 
    ShieldCheck, 
    TrendingUp, 
    FileText, 
    Activity,
    Cpu,
    ExternalLink
} from 'lucide-react';

const InsuranceAgentUI = () => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: 'Bienvenue sur votre portail Agri-Insurance intelligent. Je suis prêt à analyser vos risques et sécuriser vos récoltes. Comment puis-je vous aider aujourd\'hui ? 🌾' 
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [riskProfile, setRiskProfile] = useState({ 
        score: 12, 
        status: 'Analyse initiale...',
        level: 'low',
        trend: 'stable'
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulation d'intelligence LangGraph
        setTimeout(() => {
            const assistantMsg = { 
                role: 'assistant', 
                content: "Analyse en cours via Ollama/Mistral... J'ai détecté des anomalies météorologiques mineures dans votre région. Votre score de risque a été mis à jour à 34%. Souhaitez-vous voir le détail des protections disponibles ?" 
            };
            setMessages(prev => [...prev, assistantMsg]);
            setRiskProfile({ 
                score: 34, 
                status: 'Attention Requise (Météo)', 
                level: 'moderate',
                trend: 'up'
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-[#050508] text-slate-100 font-sans p-4 md:p-8 gap-6 overflow-hidden">
            {/* Left Panel: Risk Intelligence Dashboard */}
            <aside className="hidden lg:flex w-[380px] flex-col gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <ShieldCheck className="text-emerald-400 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">AGRI-INSURANCE</h2>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">GenAI Ecosystem</p>
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-2">
                                <Activity className="w-3 h-3" /> SCORE DE RISQUE
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                riskProfile.level === 'low' ? 'bg-emerald-500/20 text-emerald-400' : 
                                riskProfile.level === 'moderate' ? 'bg-orange-500/20 text-orange-400' : 
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {riskProfile.status}
                            </span>
                        </div>
                        
                        <div className="relative pt-2">
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-black font-mono tracking-tighter tabular-nums">{riskProfile.score}</span>
                                <span className="text-xl text-slate-500 font-bold">%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${riskProfile.score}%` }}
                                    className={`h-full rounded-full bg-gradient-to-r ${
                                        riskProfile.score < 25 ? 'from-emerald-500 to-cyan-500' :
                                        riskProfile.score < 50 ? 'from-emerald-400 to-orange-400' :
                                        'from-orange-400 to-red-500'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                            <span className="text-[10px] text-slate-500 block mb-1">TENDANCE</span>
                            <div className="flex items-center gap-2">
                                <TrendingUp className={`w-4 h-4 ${riskProfile.trend === 'up' ? 'text-orange-400' : 'text-emerald-400'}`} />
                                <span className="text-sm font-bold">{riskProfile.trend === 'up' ? '+5.2%' : 'STABLE'}</span>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                            <span className="text-[10px] text-slate-500 block mb-1">CAPACITE AI</span>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-bold">Mistral</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <button className="w-full group py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl font-bold transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                            Signer Smart Contract
                        </button>
                        <p className="text-[10px] text-center text-slate-500 font-mono tracking-widest uppercase flex items-center justify-center gap-2 opacity-60">
                            Secured by Solana Devnet <ExternalLink className="w-2 h-2" />
                        </p>
                    </div>
                </motion.div>

                {/* System Notifications Bottom */}
                <div className="mt-auto bg-slate-900/20 rounded-2xl p-4 border border-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                    <span className="text-[10px] text-slate-400 font-mono">INFRASTRUCTURE STATUS: OPTIMAL</span>
                </div>
            </aside>

            {/* Main Chat Interface */}
            <main className="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Bot className="text-white w-7 h-7" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#050508] rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white leading-tight">Agri-Insurance Bot</h3>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Neural Agent #42</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-slate-400">
                            AES-256 ENCRYPTED
                        </div>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {messages.map((m, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-4 max-w-[85%] sm:max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                                        m.role === 'user' ? 'bg-emerald-500/10' : 'bg-slate-800'
                                    }`}>
                                        {m.role === 'user' ? <User className="w-5 h-5 text-emerald-400" /> : <Bot className="w-5 h-5 text-slate-300" />}
                                    </div>
                                    
                                    <div className={`p-5 rounded-3xl relative ${
                                        m.role === 'user' 
                                        ? 'bg-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.15)] rounded-tr-none text-white' 
                                        : 'bg-slate-800/80 border border-white/5 rounded-tl-none text-slate-200'
                                    }`}>
                                        <p className="text-sm md:text-base leading-relaxed tracking-tight">{m.content}</p>
                                        <span className={`text-[9px] mt-2 block opacity-40 font-mono ${m.role === 'user' ? 'text-right' : ''}`}>
                                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pl-14">
                            <div className="bg-slate-800/40 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:800ms]" />
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:200ms]" />
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:400ms]" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={scrollRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-8 pb-10 bg-slate-900/80 border-t border-white/5 backdrop-blur-3xl">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                        <div className="relative flex items-center gap-4 bg-[#0d0d12] border border-white/10 rounded-[1.5rem] p-2 pr-4 transition-all focus-within:border-emerald-500/30">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Posez une question à l'expert IA..." 
                                className="flex-1 bg-transparent border-none py-4 px-6 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0 text-sm md:text-base"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="w-12 h-12 bg-emerald-600 disabled:opacity-50 disabled:grayscale hover:bg-emerald-500 active:scale-90 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/20"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InsuranceAgentUI;
