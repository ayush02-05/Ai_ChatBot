import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    socket.emit("ai-message", input);

    setInput("");
  };
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("ai-message-response", (response) => {
      const botMessage = { sender: "bot", text: response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    });
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b font-semibold text-lg bg-orange-700 text-white rounded-t-2xl">
          AI Chatbot
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow ${
                  msg.sender === "user"
                    ? "bg-orange-700 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t bg-white flex items-center gap-2 rounded-b-2xl">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleSend}
            className="px-5 py-2 bg-orange-700 text-white rounded-xl hover:bg-orange-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
