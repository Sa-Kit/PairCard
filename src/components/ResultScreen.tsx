import { useState } from "react";
import { supabase } from "../lib/supabase";

type ResultData = {
  turns: number;
  time: number;
  score: number;
};

type ResultScreenProps = {
  onRestart: () => void;
  result: ResultData | null;
};

const ResultScreen = (props: ResultScreenProps) => {
  const { onRestart, result } = props;

  const [message, setMessage] = useState<string | null>(null);

  //保存
  const handleSave = async () => {
    if (!result) return;

    await supabase.from("scores").insert([
      {
        score: result.score,
        turns: result.turns,
        time: result.time,
      },
    ]);

    //削除
    const { data } = await supabase
      .from("scores")
      .select("id")
      .order("created_at", { ascending: false });

    if (!data) return;

    if (data.length > 5) {
      const deleteIds = data.slice(5).map((d) => d.id);

      await supabase.from("scores").delete().in("id", deleteIds);
    }

    setMessage("保存しました！✅");
    setTimeout(() => {
      setMessage(null);
      onRestart();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-700 flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl mb-4">結果</h1>

      {result && (
        <>
          <p className="text-white">ターン数: {result.turns}</p>
          <p className="text-white">時間: {result.time}秒</p>
          <p className="text-white">スコア: {result.score}</p>
        </>
      )}

      <button onClick={onRestart} className="mt-6 bg-white px-4 py-2 rounded">
        もう一度
      </button>

      <button onClick={handleSave} className="mt-2 bg-white px-4 py-2 rounded">
        結果の保存
      </button>

      {message && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
