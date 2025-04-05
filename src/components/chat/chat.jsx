import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appwriteService } from "../../appwrite/config"; // update path as needed
import service from "../../gemini/service";
import { Logoimage, upArrow, Input } from "../index";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";



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

    // Save to Appwrite
    if (!chatId) {
      const response = await appwriteService.saveChat(null, userId, input.slice(0, 50), finalMessages);
      if (response && response.$id) {
        setChatId(response.$id);
        console.log("Navigating to:", `/${response.$id}`);
        navigate(`/${response.$id}`); // Route to this conversation
      }
    } else {
      await appwriteService.saveChat(chatId, null, null, finalMessages);
    }
  };

  return (
    <div className="max-w-3xl mx-auto border pb-5 px-5 rounded-lg shadow-lg bg-zinc-800">
      <div className="h-100 overflow-y-auto border-b border-gray-200 mb-4 p-3 space-y-3 text-lg custom-scrollbar">
        {messages.length === 0 && (
          <h2 className="text-2xl font-mono font-bold mt-45 mb-4 text-center text-neutral-400">
            Got something on your mind ?
          </h2>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-2xl leading-relaxed ${msg.sender === "user" ? "ml-auto bg-neutral-500 max-w-lg text-white" : "mr-auto max-w-full text-white "
              }`}
          >
            <strong>{msg.sender === "user" ? "You" : "Cashew"}:</strong> {msg.text}
          </div>
        ))}
        {loading && (
          <div>
            <img src={Logoimage} alt="Loading..." className="w-12 h-12 animate-spin" />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <TextareaAutosize
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your thoughts go here..."
          minRows={1}
          maxRows={3}
          className="flex-1 resize-none p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48726b] text-white bg-zinc-900 overflow-y-auto custom-scrollbar"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); 
              handleSend();       
            }
          }}
        />
        <button
          onClick={handleSend}
          className="text-white p-3 rounded-4xl bg-[#48726b] hover:bg-[#3b5a4e] transition cursor-pointer"
        >
          <img src={upArrow} alt="send" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
