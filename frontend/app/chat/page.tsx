"use client";

import React, { useEffect, useRef, useState } from "react";

const page = () => {
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    socket.current = new WebSocket("ws://localhost:3001");

    // Listen for messages from the server
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Display different types of messages (user messages and status updates)
      if (data.type === "message" || data.type === "status") {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
      socket.current.send(JSON.stringify({ type: "new-user", username }));
    }
  };

  const sendMessage = () => {
    if (input.trim() && socket.current) {
      socket.current.send(JSON.stringify({ type: "message", message: input }));
      setInput("");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Chat Room</h1>

      {!isUsernameSet ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "80%", padding: "0.5rem" }}
          />
          <button
            onClick={handleUsernameSubmit}
            style={{ padding: "0.5rem 1rem" }}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              height: "300px",
              overflowY: "auto",
              marginBottom: "1rem",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.type === "status" ? (
                  <em>
                    {msg.message} - <small>{formatDate(msg.timestamp)}</small>
                  </em>
                ) : (
                  <div>
                    <strong>{msg.username}:</strong> {msg.message} -{" "}
                    <small>{formatDate(msg.timestamp)}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ width: "80%", padding: "0.5rem" }}
          />
          <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
