import React, { useState } from "react";

const conversations = [
  { id: 1, name: "Alice", lastMessage: "Salut, comment ça va ?" },
  { id: 2, name: "Bob", lastMessage: "On se voit demain ?" },
  { id: 3, name: "Charlie", lastMessage: "J'ai terminé le projet !" },
];

const MessengerPage = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState({
    1: [
      { sender: "Alice", text: "Salut, comment ça va ?" },
      { sender: "Me", text: "Très bien, et toi ?" },
    ],
    2: [{ sender: "Bob", text: "On se voit demain ?" }],
    3: [{ sender: "Charlie", text: "J'ai terminé le projet !" }],
  });

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [
        ...(prev[activeConversation] || []),
        { sender: "Me", text: newMessage.trim() },
      ],
    }));

    setNewMessage("");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar - Liste des conversations */}
      <div className="w-1/3 bg-gray-200 p-4 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Discussions</h2>
        <ul>
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                activeConversation === conversation.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <p className="font-medium">{conversation.name}</p>
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-gray-100 border-b border-gray-300">
              <h2 className="text-lg font-bold">
                {
                  conversations.find((conv) => conv.id === activeConversation)
                    ?.name
                }
              </h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {(messages[activeConversation] || []).map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "Me" ? "text-right" : "text-left"
                  }`}
                >
                  <p
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.sender === "Me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-gray-100 border-t border-gray-300">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Écrire un message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                  onClick={handleSendMessage}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            <p>Sélectionnez une discussion pour commencer à chatter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerPage;
