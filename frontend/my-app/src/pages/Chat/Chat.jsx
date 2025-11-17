import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // connect to backend WebSocket (same port as API: 5000)
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? `wss://${window.location.host}`
        : "ws://localhost:5000";

    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      setMessages((prev) => [
        ...prev.filter((m) => m.text !== "Typing..."),
        { sender: "bot", text: event.data },
      ]);
    };

    return () => ws.current.close();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
  if (!input.trim()) return;

  // Only send if WebSocket is open
  if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: "Typing..." },
    ]);
    ws.current.send(input);
    setInput("");
  } else {
    console.warn("WebSocket not open. Cannot send message.");
  }
};


  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Auction Buddy 🤖</h1>
      <div className="w-full max-w-md h-96 border rounded-xl p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 my-1 rounded-2xl max-w-[75%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto text-right"
                : "bg-gray-200 text-black mr-auto text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex w-full max-w-md mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-xl focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-xl hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
