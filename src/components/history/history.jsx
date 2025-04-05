import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appwriteService } from "../../appwrite/config";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [chats, setChats] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status); 
  const userId = userData?.$id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      if (userId) {
        const userChats = await appwriteService.getAllChats(userId);
        setChats(
          userChats.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        
      }
    };
    fetchChats();
  }, [userId]);

  const handleOpenChat = (chatId) => {
    navigate(`/${chatId}`);
  };

  if (!authStatus) {
    return (
      <div className="max-w-3xl mx-auto p-5 bg-zinc-800 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold  text-neutral-400 mb-4">Your Conversations</h2>
        <p className="text-red-500">Please login to see your conversation history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-5 bg-zinc-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white mb-4">Your Conversations</h2>
      {chats.length === 0 ? (
        <p className="text-neutral-400">No conversations yet.</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li
              key={chat.$id}
              onClick={() => handleOpenChat(chat.$id)}
              className="cursor-pointer p-4 bg-zinc-700 text-white rounded-xl hover:bg-zinc-600 transition"
            >
              {chat.title || "Untitled Conversation"}
              <span className="block text-sm text-gray-400">
                {new Date(chat.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
