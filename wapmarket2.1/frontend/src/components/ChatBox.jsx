import { useState } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    const res = await fetch("https://TU_BACKEND_URL/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    const reply = { role: "lea", text: data.reply };
    setMessages((prev) => [...prev, reply]);
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto mb-3 space-y-2 p-2 bg-gray-50 rounded-xl">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={\`p-2 rounded-lg max-w-[80%] \${msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
              }\`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-xl p-2 focus:outline-none"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
