import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type Score = {
  id: string;
  score: number;
  turns: number;
  time: number;
  created_at: string;
};

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen = (props: StartScreenProps) => {
  const { onStart } = props;

  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setScores(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-700 flex flex-col items-center justify-center">
      <div>
        <h1 className="text-white">神経衰弱ゲーム</h1>
        <button onClick={onStart} className="mt-4">
          スタート
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-white">保存した結果のログ</h2>

        {scores.map((s) => (
          <div key={s.id} className="text-white flex gap-1">
            <p>
              {new Date(s.created_at).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
              })}
            </p>
            <p>スコア: {s.score}</p>
            <p>回数: {s.turns}</p>
            <p>クリアタイム: {s.time}秒</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartScreen;
