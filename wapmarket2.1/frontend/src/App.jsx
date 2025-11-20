import { useState } from "react";
import ChatBox from "./components/ChatBox";
import leaImg from "./assets/lea.png";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center mb-4">
          <img src={leaImg} alt="LEA" className="w-12 h-12 rounded-full mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">LEA</h1>
        </div>
        <ChatBox />
      </div>
      <p className="text-gray-400 text-xs mt-6">© 2025 LEA — Asistente educativo</p>
    </div>
  );
}
