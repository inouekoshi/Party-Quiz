"use client";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function AdminPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const { wsMessage } = useWebSocket("ws://127.0.0.1:8000/ws");
  
  // スマホやプロジェクタと同じように進行状況を把握する
  const [gameState, setGameState] = useState<{ state: string, question_id: number | null }>({ 
    state: "waiting", 
    question_id: null 
  });

  useEffect(() => {
    fetchQuestions();
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/state");
      const data = await res.json();
      setGameState({ state: data.status, question_id: data.current_question_id });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (wsMessage) {
      if (wsMessage.event === "question_started") {
        setGameState({ state: "answering", question_id: wsMessage.data.question_id });
      } else if (wsMessage.event === "answer_revealed") {
        setGameState({ state: "revealed", question_id: wsMessage.data.question_id });
      } else if (wsMessage.event === "question_closed") {
        setGameState({ state: "closed", question_id: wsMessage.data.question_id });
      }
    }
  }, [wsMessage]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const startQuestion = async (questionId: number) => {
    if (!confirm(`本当に「第${questionId}問」を出題しますか？`)) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/start/${questionId}`, { method: "POST" });
    } catch (e) {
      alert("Failed to start question");
    }
  };

  const revealAnswer = async (questionId: number) => {
    if (!confirm(`解答を締め切り、「第${questionId}問」の結果を発表しますか？`)) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/admin/reveal/${questionId}`, { method: "POST" });
    } catch (e) {
      alert("Failed to reveal answer");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-extrabold text-blue-600">進行管理 (Admin)</h1>
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-600">現在のステータス:</span>
            <span className={`px-4 py-2 rounded-full font-bold text-white ${
              gameState.state === "answering" ? "bg-red-500 animate-pulse" : 
              gameState.state === "closed" ? "bg-yellow-500" : 
              gameState.state === "revealed" ? "bg-green-500" : "bg-gray-400"
            }`}>
              {gameState.state === "answering" ? `第${gameState.question_id}問 解答受付中` : 
               gameState.state === "closed" ? `第${gameState.question_id}問 解答締め切り済み` : 
               gameState.state === "revealed" ? `第${gameState.question_id}問 結果発表済み` : "待機中"}
            </span>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b font-bold">ID</th>
                <th className="p-4 border-b font-bold">問題文</th>
                <th className="p-4 border-b font-bold">種類</th>
                <th className="p-4 border-b font-bold">制限時間</th>
                <th className="p-4 border-b font-bold">正解</th>
                <th className="p-4 border-b font-bold text-center">アクション</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className={`border-b hover:bg-blue-50 transition-colors ${gameState.question_id === q.id ? 'bg-blue-50' : ''}`}>
                  <td className="p-4 font-bold text-gray-600">{q.id}</td>
                  <td className="p-4 w-1/3">
                    <div className="font-bold mb-2">{q.text}</div>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {q.options.map((opt: any) => (
                        <li key={opt.id}>
                          {String.fromCharCode(64 + opt.order)}. {opt.text}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${q.type === 'majority' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>
                      {q.type === 'majority' ? 'マジョリティ' : '通常'}
                    </span>
                  </td>
                  <td className="p-4">{q.timeLimit} 秒</td>
                  <td className="p-4 font-bold text-green-600">
                    {q.type === 'normal' ? String.fromCharCode(64 + (q.correctOption || 1)) : '正解なし'}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button 
                      onClick={() => startQuestion(q.id)}
                      disabled={gameState.state === "answering"}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded shadow transition-colors"
                    >
                      出題
                    </button>
                    <button 
                      onClick={async () => {
                        if (!confirm(`解答受付を強制打ち切りしますか？`)) return;
                        await fetch(`http://127.0.0.1:8000/api/admin/close/${q.id}`, { method: "POST" });
                      }}
                      disabled={gameState.state !== "answering" || gameState.question_id !== q.id}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded shadow transition-colors"
                    >
                      強制打ち切り
                    </button>
                    <button 
                      onClick={() => revealAnswer(q.id)}
                      disabled={(gameState.state !== "answering" && gameState.state !== "closed") || gameState.question_id !== q.id}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded shadow transition-colors"
                    >
                      結果発表
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
