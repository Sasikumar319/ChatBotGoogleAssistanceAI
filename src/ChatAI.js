import React, { useState, useRef } from "react";

const ChatAI = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const recognitionRef = useRef(null);

  const apiUrl = "http://localhost:8000/askChat";

  const sendQuestion = async (question) => {
    if (!question) return;
    setLoading(true); // ✅ Start loading
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setChat((prev) => [...prev, { question, answer: data.answer }]);
    } catch (error) {
      console.error("API error:", error);
      setChat((prev) => [...prev, { question, answer: "Error: Could not get response" }]);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleSendText = () => {
    if (!input.trim()) return;
    sendQuestion(input.trim());
    setInput("");
  };

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      sendQuestion(spokenText);
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>

<p style={{ 
  fontSize: 24, 
  fontWeight: 'bold', 
  textAlign: 'center' 
}}>
  Ask Something...Helps You 😁👍

</p>
      {/* Chat area */}
      <div style={{
        flex: 1,
        padding: 40,
        overflowY: "auto",
        borderBottom: "1px solid #ccc",
      }}>
        {chat.map((item, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: "bold", marginBottom: 5 }}>
              Q: {item.question}
            </div>
            <div style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 5,
              whiteSpace: "pre-wrap"
            }}>
              A: {item.answer}
            </div>
          </div>
        ))}
        {/* ✅ Loading spinner or message */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
            <span>⏳ Loading...</span>
          </div>
        )}
      </div>

      {/* Input + buttons at bottom */}
      <div style={{
        display: "flex",
        padding: 30,
        borderTop: "1px solid #ccc",
        backgroundColor: "#fafafa",
      }}>
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            width:20,
            padding: "10px",
            fontSize: "16px",
            border: "3px solid #ccc",
            borderRadius: "20px",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendText();
            }
          }}
        />
        <button
          onClick={handleSendText}
          style={{
            marginLeft: 8,
            padding: "10px 16px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          disabled={loading} // ✅ Disable during loading
        >
          OK
        </button>
        <button
          onClick={startVoiceRecognition}
          style={{
            marginLeft: 8,
            padding: "10px 16px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          disabled={loading} // ✅ Disable during loading
          title="Speak"
        >
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatAI;
