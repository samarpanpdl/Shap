
import React, { useEffect, useState, useRef } from 'react';
/* Importing specific symbols for a modern look */
import { MessageCircle, X, ChevronDown, SendHorizontal, Sparkles } from 'lucide-react';
import ChatbotIcon from './Components/ChatbotIcon';
import ChatMessage from './Components/ChatMessage';
import { companyInfo } from './companyInfo';

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState([{
        hideInChat: true,
        role: "model",
        text: companyInfo
    }]);
    const [showChatbot, setShowChatbot] = useState(false);
    const [input, setInput] = useState(""); // Managed state for the input
    const chatBodyRef = useRef();

    const API_KEY = process.env.REACT_APP_API_KEY;

    // Scroll to bottom whenever chat history changes
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({ 
                top: chatBodyRef.current.scrollHeight, 
                behavior: "smooth" 
            });
        }
    }, [chatHistory]);

    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), { role: "model", text, isError }]);
        };

        const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: formattedHistory })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error.message || "Something went wrong.");
            
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userText = input.trim();
        if (!userText) return;

        const newHistory = [...chatHistory, { role: "user", text: userText }];
        setChatHistory([...newHistory, { role: "model", text: "Thinking..." }]);
        setInput("");
        generateBotResponse(newHistory);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            
            {/* Toggler Button: Uses MessageCircle and X symbols */}
            <button 
                onClick={() => setShowChatbot(prev => !prev)} 
                className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            >
                {showChatbot ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Chat Window */}
            <div className={`
                fixed bottom-0 right-0 w-full h-[100dvh] sm:h-[600px] sm:w-[420px] sm:bottom-28 sm:right-10
                flex flex-col overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-bottom-right
                ${showChatbot ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
                sm:rounded-3xl border border-pink-100
            `}>
                
                {/* Header: Uses Sparkles and ChevronDown symbols */}
                <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-rose-400 p-5 text-white shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Pinky AI</h2>
                            <p className="text-[10px] uppercase tracking-wider opacity-80">Online</p>
                        </div>
                    </div>
                    <button onClick={() => setShowChatbot(false)} className="rounded-full p-2 hover:bg-white/10 transition-colors">
                        <ChevronDown size={24} />
                    </button>
                </div>

                {/* Chat Body */}
                <div ref={chatBodyRef} className="flex-1 overflow-y-auto bg-pink-50/30 p-4 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white shrink-0">
                           <ChatbotIcon />
                        </div>
                        <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white p-4 text-sm text-gray-700 shadow-sm border border-pink-100">
                            Hi! 🌸 How can I help you today?
                        </div>
                    </div>

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>

                {/* Footer: Uses SendHorizontal symbol */}
                <div className="border-t border-pink-100 bg-white p-4">
                    <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-4 py-3 text-sm outline-none focus:border-pink-500 transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim()}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white transition-all hover:bg-pink-600 disabled:bg-pink-200"
                        >
                            <SendHorizontal size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
