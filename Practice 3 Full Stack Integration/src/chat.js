import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for messages from server
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      {!joined ? (
        <div style={styles.joinContainer}>
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <button onClick={joinChat} style={styles.button}>Join</button>
        </div>
      ) : (
        <div style={styles.chatBox}>
          <h2>Real-Time Chat</h2>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.user}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <form onSubmit={sendMessage} style={styles.form}>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

// Simple styles
const styles = {
  container: { textAlign: "center", padding: "30px", fontFamily: "Arial" },
  joinContainer: { marginTop: "100px" },
  chatBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    margin: "50px auto",
  },
  messages: {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #eee",
    marginBottom: "10px",
    padding: "10px",
    textAlign: "left",
  },
  form: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};

export default Chat;
