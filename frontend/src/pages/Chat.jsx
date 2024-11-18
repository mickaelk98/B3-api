import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Update with your server's URL

function ChatWithMessengerUI() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("anonymous");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [clientsTotal, setClientsTotal] = useState(0);
  const [users, setUsers] = useState({});
  const [recipientId, setRecipientId] = useState("All");
  const [conversations, setConversations] = useState({ All: [] });

  useEffect(() => {
    socket.emit("setUsername", name);

    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setConversations((prevConversations) => ({
        ...prevConversations,
        All: [...prevConversations.All, newMessage],
      }));
    });

    socket.on("privateMessage", (newMessage) => {
      const recipientKey =
        newMessage.senderId === socket.id
          ? newMessage.recipientId
          : newMessage.senderId;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setConversations((prevConversations) => ({
        ...prevConversations,
        [recipientKey]: [
          ...(prevConversations[recipientKey] || []),
          newMessage,
        ],
      }));
    });

    socket.on("typing", ({ recipientId: typingRecipientId, feedback }) => {
      if (typingRecipientId === recipientId) {
        setFeedback(feedback);
      }
    });

    socket.on("clientsTotal", (totalClients) => {
      setClientsTotal(totalClients);
    });

    socket.on("updateUserList", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("message");
      socket.off("privateMessage");
      socket.off("typing");
      socket.off("clientsTotal");
      socket.off("updateUserList");
    };
  }, [name, recipientId]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    socket.emit("setUsername", e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const newMessage = {
        text: message,
        author: name,
        date: new Date().toLocaleString(),
        senderId: socket.id,
        recipientId: recipientId === "All" ? "All" : recipientId,
      };
      if (recipientId === "All") {
        socket.emit("message", newMessage);
      } else {
        socket.emit("privateMessage", { recipientId, message });
      }
      setMessage("");
      setFeedback("");
      socket.emit("stopTyping", recipientId);
    }
  };

  const handleTyping = (e) => {
    socket.emit("typing", {
      recipientId,
      feedback: `${name} is typing a message...`,
    });

    if (e.key === "Enter" || e.target.value === "") {
      socket.emit("stopTyping", recipientId);
    }
  };

  const handleRecipientClick = (id) => {
    setRecipientId(id);
    setFeedback("");
  };

  const currentMessages = conversations[recipientId] || [];

  return (
    <>
      {!user ? (
        <Navigate to="/signup" />
      ) : (
        <div className="flex h-screen w-full">
          {/* Sidebar - Liste des conversations */}
          <div className="w-1/3 bg-gray-200 p-4 border-r border-gray-300">
            <h2 className="text-xl font-bold mb-4">Discussions</h2>
            <ul>
              <li
                key="All"
                className={`p-3 mb-2 rounded-lg cursor-pointer ${
                  recipientId === "All"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
                onClick={() => handleRecipientClick("All")}
              >
                <p className="font-medium">All</p>
              </li>
              {Object.keys(users).map(
                (id) =>
                  id !== socket.id && (
                    <li
                      key={id}
                      className={`p-3 mb-2 rounded-lg cursor-pointer ${
                        recipientId === id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-300"
                      }`}
                      onClick={() => handleRecipientClick(id)}
                    >
                      <p className="font-medium">{users[id]}</p>
                    </li>
                  )
              )}
            </ul>
          </div>

          {/* Main Chat Window */}
          <div className="flex-1 flex flex-col">
            {recipientId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-gray-100 border-b border-gray-300">
                  <h2 className="text-lg font-bold">
                    {recipientId === "All"
                      ? "All"
                      : users[recipientId] || "Unknown"}
                  </h2>
                  {recipientId === "All" && (
                    <div>
                      {clientsTotal > 1 ? (
                        <p>{clientsTotal} personnes connectées</p>
                      ) : (
                        <p>{clientsTotal} personne connectée</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {currentMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        msg.senderId === socket.id ? "text-right" : "text-left"
                      }`}
                    >
                      <p
                        className={`inline-block px-4 py-2 rounded-lg ${
                          msg.senderId === socket.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </p>
                      <span className="block text-xs mt-1">
                        {msg.author} - {msg.date}
                      </span>
                    </div>
                  ))}
                  {feedback && (
                    <div className="italic text-gray-500 text-center">
                      {feedback}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-gray-100 border-t border-gray-300">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Écrire un message..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={message}
                      onChange={handleMessageChange}
                      onKeyUp={handleTyping}
                    />
                    <button
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                      onClick={handleSubmit}
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
      )}
    </>
  );
}

export default ChatWithMessengerUI;
