import React from 'react'
import { useRef } from 'react';
const CharForm = ({chatHistory,setChatHistory,generateBotResponse}) => {
    const inputRef = useRef();
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const query = inputRef.current.value.trim();
        if(!query) return;
        console.log(query)
        inputRef.current.value = ""
        setChatHistory((history)=>[...history,{role:"user",text:query}]);

        setTimeout(()=>{ 
            
        setChatHistory((history)=>[...history,{role:"model",text:"Thinking..."}]) 
        generateBotResponse([...chatHistory,{role:"user",text:`Using the details provided above, please address this query: ${query}`}]);},600);
    };
  return (
    <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
                    <input ref = {inputRef} type='text' placeholder='Message...' className='message-input' required/>
                    <button><span className="material-symbols-outlined">arrow_upward</span></button>

                </form>
  )
}

export default CharForm