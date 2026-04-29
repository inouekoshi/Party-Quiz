"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [teamName, setTeamName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLoginOrRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 本番ではログイン専用エンドポイントを分けますが、今回は簡易的に全チーム取得して照合か、なければ作成とします
      const res = await fetch("http://127.0.0.1:8000/api/teams");
      const teams = await res.json();
      
      const existingTeam = teams.find((t: any) => t.name === teamName);

      let teamId = null;

      if (existingTeam) {
        if (existingTeam.passcode === passcode) {
          teamId = existingTeam.id; // ログイン成功
        } else {
          setError("パスコードが間違っています。");
          return;
        }
      } else {
        // 新規登録
        const createRes = await fetch("http://127.0.0.1:8000/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: teamName, passcode }),
        });
        
        if (!createRes.ok) {
          setError("チーム登録に失敗しました。");
          return;
        }
        const createdTeam = await createRes.json();
        teamId = createdTeam.id;
      }

      // localStorageに保存して解答画面へ遷移
      localStorage.setItem("teamId", teamId.toString());
      localStorage.setItem("teamName", teamName);
      router.push("/play");

    } catch (err) {
      console.error(err);
      setError("サーバーに接続できません。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">Hobo Reunion Quiz</h1>
        <p className="text-center text-gray-500 mb-8">チーム名とパスコードを入力して参加してください</p>

        {error && <div className="text-red-500 bg-red-50 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLoginOrRegister} className="space-y-6">
          <div>
            <label className="block font-bold text-gray-700 mb-2">チーム名 (全8チーム)</label>
            <input 
              type="text" 
              required
              className="w-full border-2 border-gray-200 p-3 rounded text-black focus:border-blue-500 focus:outline-none"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="例: 1組テーブルA"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-2">パスコード (当日発表)</label>
            <input 
              type="password" 
              required
              className="w-full border-2 border-gray-200 p-3 rounded text-black focus:border-blue-500 focus:outline-none"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="4桁の数字など"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl shadow-md transition-colors"
          >
            入場する
          </button>
        </form>
      </div>
    </div>
  );
}
