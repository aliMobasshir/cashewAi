import React, { useEffect, useState } from "react";
import { appwriteService } from "../../appwrite/config";
import { Link } from "react-router-dom";

const ChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const allChats = await appwriteService.getAllChats();
      setChats(allChats);
    };
    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {showHistory ? "Hide Chat History" : "View Chat History"}
      </button>

      {showHistory && (
        <div className="mt-4 p-4 border rounded shadow">
          <h2 className="text-lg font-bold">Chat History</h2>
          <ul className="mt-2">
            {chats.map((chat) => (
              <li key={chat.$id} className="border-b py-2">
                <Link to={`/chat/${chat.$id}`} className="text-blue-500">
                  {chat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
