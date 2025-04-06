import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appwriteService } from "../../appwrite/config";
import service from "../../gemini/service";
import { Logoimage, upArrow, Input } from "../index";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { marked } from "marked";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(id || null);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.$id;

  useEffect(() => {
    const fetchChat = async () => {
      if (id) {
        const existingChat = await appwriteService.getChat(id);
        if (existingChat) {
          setMessages(JSON.parse(existingChat.messages || "[]"));
        }
      }
    };
    fetchChat();
  }, [id]);

  useEffect(() => {
    if (!authStatus) {
      setMessages([]);
      setChatId(null);
    } else if (!id) {
      setMessages([]);
      setChatId(null);
    }
  }, [id, authStatus]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const aiResponse = await service.generateContent(input);
    const aiMessage = { sender: "ai", text: aiResponse };
    const finalMessages = [...updatedMessages, aiMessage];

    setMessages(finalMessages);
    setLoading(false);

   
    if (!chatId) {
      const response = await appwriteService.saveChat(null, userId, input.slice(0, 50), finalMessages);
      if (response && response.$id) {
        setChatId(response.$id);
        console.log("Navigating to:", `/${response.$id}`);
        navigate(`/${response.$id}`); 
      }
    } else {
      await appwriteService.saveChat(chatId, null, null, finalMessages);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto border rounded-xl shadow-lg bg-zinc-800 flex flex-col h-[80vh]  p-2">
      <div className="flex-grow overflow-y-auto mb-2 space-y-2 p-2 text-base custom-scrollbar border-b border-gray-200 relative">
        {messages.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-mono font-bold text-center text-neutral-400 px-2">
              Got something on your mind?
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.sender === "user" ? "flex justify-end" : ""}`}>
                <div
                  className={`p-2 rounded-xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-neutral-500 max-w-lg text-white rounded-tr-none"
                      : "mr-auto max-w-full text-neutral-300"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                  ) : (
                    <div>
                      <strong>You:</strong> {msg.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {loading && (
          <div>
            <img src={Logoimage} alt="Loading..." className="w-10 h-10 animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-2">
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your thoughts go here..."
            minRows={1}
            maxRows={4}
            className="flex-grow resize-none py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-[#48726b] text-white bg-zinc-900 overflow-y-auto custom-scrollbar"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-lg transition-all duration-200 w-9 h-9 flex items-center justify-center ${
              input.trim() 
                ? "bg-[#48726b] hover:bg-[#3b5a4e] text-white cursor-pointer" 
                : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <img src={upArrow} alt="send" className="w-4 h-4" />
          </button>
        </div>
        <p className="hidden md:block text-xs text-neutral-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Chat;