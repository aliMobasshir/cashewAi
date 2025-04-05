// src/components/Chat.js
import React, { useState } from "react";
import service  from "../../gemini/service";
import { Logoimage,upArrow } from "../index";

const Chat = () => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleSend = async () => {
    if (!input.trim()) return; 
    const userMessage = { sender: "user", text: input };

    setMessages((prev) => [...prev, userMessage]); 
    setInput(""); 
    setLoading(true);

    const aiResponse = await service.generateContent(input);
    const aiMessage = { sender: "ai", text: aiResponse };

    setMessages((prev) => [...prev, aiMessage]); 
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto border pb-5 px-5 rounded-lg shadow-lg bg-zinc-800">
      
      <div className="h-100 overflow-y-auto border-b border-gray-200 mb-4 p-3 space-y-3 text-lg custom-scrollbar">
     {messages.length === 0 && (
       <h2 className="text-2xl font-mono font-bold mt-45  mb-4 text-center text-neutral-400">Got something on your mind ?</h2>
     )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-2xl max-w-lg ${
              msg.sender === "user" ? "ml-auto bg-neutral-500 text-white" : "mr-auto  text-white"
            }`}
          >
            <strong>{msg.sender === "user" ? "You" : "Cashew"}:</strong> {msg.text}
          </div>
        ))}
        
        {loading && (
  <div>
    <img
      src={Logoimage} 
      alt="Loading..."
      className="w-12 h-12 animate-spin"
    />
  </div>
)}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your thoughts go here..."
          className="flex-1 p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48726b] text-white bg-zinc-900 "
        />
        <button
          onClick={handleSend}
          className=" text-white p-3 rounded-4xl bg-[#48726b] hover:bg-[#3b5a4e] transition cursor-pointer"
        >
          <img src={upArrow} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
