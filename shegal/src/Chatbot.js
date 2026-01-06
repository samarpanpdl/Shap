import React, { useEffect } from 'react'
import ChatbotIcon from './Components/ChatbotIcon'
import './Chatbot.css'
import CharForm from './Components/CharForm'
import { useState,useRef } from 'react'
import ChatMessage from './Components/ChatMessage'
import { companyInfo } from './companyInfo'
const Chatbot = () => {
    const [chatHistory,setChatHistory] = useState([{
        hideInChat : true,
        role: "model",
        text: companyInfo
    }]);
    const [showChatbot,setShowChatbot] = useState(false);
    const chatBodyRef = useRef();

    const API_KEY = process.env.REACT_APP_API_KEY;
    const generateBotResponse= async(history)=>{
        const updateHistory = (text, isError=false)=>{
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model",text, isError}])
        }

        history = history.map(({role,text}) => ({role, parts:[{text}]}));

        const requestOptions = {
            method: "POST",
            headers : { "Content-Type": "application/json"},
            body: JSON.stringify({contents: history})
        }
        try{
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, requestOptions );
            const data = await response.json();
            if(!response.ok) throw new Error(data.error.message || "Something went wrong.");
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
            updateHistory(apiResponseText);
        }catch(error){
            updateHistory(error.message,true);
        }
        
    }
    useEffect(()=>{
            chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behaviour: "smooth"})
        },[chatHistory])
  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ""}`}>
        <button onClick={()=>setShowChatbot(prev=>!prev)} id ="chatbot-toggler">
            <span className="material-symbols-rounded">mode_comment</span>
        
            <span className="material-symbols-outlined">close</span>
        </button> 
        <div className='chatbot-popup'>
            {/* Chatbot header */}
            <div className='chat-header'>
                <div className='header-info'>
                    <ChatbotIcon/>
                    <h2 className='logo-text'>Chatbot</h2>
                </div>
                <button onClick={()=>setShowChatbot(prev=>!prev)}><span className="material-symbols-rounded">keyboard_arrow_down</span></button>
            </div>
            {/* Chat bot body */}
            <div ref={chatBodyRef} className='chat-body'>
                <div className='message bot-message'>
                    <ChatbotIcon></ChatbotIcon>
                    <p className='message-text'>
                        Hey there. <br/> How can I help you today?
                    </p>
                </div>

                {chatHistory.map((chat,index)=>(
                    <ChatMessage key={index} chat={chat}/>
                ))}
                
            </div>
            {/* Chat footer */}
            <div className='chat-footer'>
                <CharForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
            </div>
        </div>
    </div>
  )
}

export default Chatbot