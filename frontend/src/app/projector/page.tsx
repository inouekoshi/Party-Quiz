"use client";
import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function ProjectorPage() {
  const { wsMessage } = useWebSocket("ws://127.0.0.1:8000/ws");
  const [gameState, setGameState] = useState<{ state: string, question_id: number | null }>({ 
    state: "waiting", 
    question_id: null 
  });
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [questionDetail, setQuestionDetail] = useState<any>(null);

  // 進行状態の変更を受け取る
  useEffect(() => {
    if (wsMessage) {
      if (wsMessage.event === "question_started") {
        setGameState({ state: "answering", question_id: wsMessage.data.question_id });
        setLeaderboard([]);
        fetchQuestion(wsMessage.data.question_id);
      } else if (wsMessage.event === "answer_revealed") {
        setGameState({ state: "revealed", question_id: wsMessage.data.question_id });
        setLeaderboard(wsMessage.data.leaderboard);
      }
    }
  }, [wsMessage]);

  const fetchQuestion = async (id: number) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/questions");
      const questions = await res.json();
      const target = questions.find((q: any) => q.id === id);
      setQuestionDetail(target);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-5xl font-extrabold mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 shadow-xl">
        Hobo Reunion Quiz
      </h1>

      <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 w-full max-w-5xl min-h-[600px] flex flex-col items-center justify-center border border-gray-700 relative overflow-hidden transition-all duration-500">
        
        {gameState.state === "waiting" && (
          <div className="text-center space-y-4">
             <div className="text-8xl mb-8 animate-pulse">⏰</div>
             <p className="text-5xl text-gray-400 animate-pulse font-bold tracking-widest">NEXT QUESTION...</p>
          </div>
        )}
        
        {gameState.state === "answering" && questionDetail && (
          <div className="space-y-12 animate-fade-in-up w-full text-center">
            <div className="bg-blue-900/40 p-10 rounded-xl inline-block border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-4xl">
              <span className="text-2xl text-blue-300 font-bold tracking-widest uppercase block mb-4">QUESTION {gameState.question_id}</span>
              <p className="text-5xl font-black text-white leading-relaxed">{questionDetail.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full px-12">
              {questionDetail.options.map((opt: any, i: number) => {
                const colors = ["border-red-500", "border-blue-500", "border-green-500", "border-yellow-500"];
                const color = colors[i % colors.length];
                return (
                  <div key={opt.id} className={`bg-gray-700 border-l-8 ${color} p-8 rounded-xl text-left shadow-2xl transform transition-transform hover:scale-105`}>
                    <div className="flex items-center">
                       <span className={`text-4xl font-black ${color.replace('border-', 'text-')} mr-6`}>
                         {String.fromCharCode(64 + opt.order)}.
                       </span>
                       <span className="text-3xl font-bold text-gray-100">{opt.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-3xl pt-8 text-yellow-400 font-bold animate-pulse tracking-wide">
              🕒 制限時間 {questionDetail.timeLimit}秒 - お手元の端末で解答してください！
            </p>
          </div>
        )}

        {gameState.state === "revealed" && leaderboard.length > 0 && (
          <div className="w-full animate-fade-in-up space-y-8 flex flex-col items-center">
            <h2 className="text-5xl font-black text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">🏆 LEADERBOARD</h2>
            
            <div className="w-full max-w-3xl flex flex-col gap-4 bg-gray-900/80 p-8 rounded-2xl border border-gray-700 shadow-2xl">
              {leaderboard.map((team, index) => (
                <div key={team.id} className="flex justify-between items-center text-3xl font-bold bg-gray-800 p-6 rounded-xl border-b border-gray-700 shadow-md">
                  <div className="flex items-center gap-6">
                    <span className={`w-14 h-14 flex items-center justify-center rounded-full text-2xl font-black shadow-lg ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                      index === 1 ? 'bg-gray-300 text-gray-800' : 
                      index === 2 ? 'bg-amber-600 text-orange-100' : 
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-gray-100">{team.name}</span>
                  </div>
                  <span className="text-green-400 px-6 py-2 bg-gray-900 rounded-lg font-mono border border-green-900/50">
                    {Math.round(team.score).toLocaleString()} pt
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xl text-gray-400 mt-4">Next question will start soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
