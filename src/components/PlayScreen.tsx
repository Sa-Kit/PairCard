import { useEffect, useState } from "react";
import cardBack from "../assets/cards/bg.png";

type PlayScreenProps = {
  onFinish: (result: ResultData) => void;
};

type Card = {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type ResultData = {
  turns: number;
  time: number;
  score: number;
};

const PlayScreen = ({ onFinish }: PlayScreenProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [turns, setTurns] = useState(0);

  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  // 初期化
  useEffect(() => {
    const initCards = () => {
      const values = [1, 5, 7, 14]; //カード配列
      const duplicated = [...values, ...values];

      const shuffled = duplicated
        .sort(() => Math.random() - 0.5)
        .map((value, index) => ({
          id: index,
          value,
          isFlipped: false,
          isMatched: false,
        }));

      setCards(shuffled); //カード配布

      setStartTime(Date.now()); //時間計測開始
    };

    initCards();
  }, []);

  // クリア判定
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      const end = Date.now();
      setEndTime(end);

      const timeSec = Math.floor((end - startTime) / 1000);

      const score = 1000 - turns * 10 - timeSec * 2; //スコア計算
      setTimeout(() => {
        onFinish({ turns, time: timeSec, score });
      }, 1000);
    }
  }, [cards, onFinish]);

  // カードクリック
  const handleClick = (card: Card) => {
    if (isChecking) return;
    if (card.isFlipped || card.isMatched) return;

    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c,
    );

    const newSelected = [...selected, card];

    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      setTurns((prev) => prev + 1);

      setTimeout(() => {
        checkMatch(newSelected);
      }, 800);
    }
  };

  // 正誤判定
  const checkMatch = (selectedCards: Card[]) => {
    const [a, b] = selectedCards;

    if (a.value === b.value) {
      setCards((prev) =>
        prev.map((c) => (c.value === a.value ? { ...c, isMatched: true } : c)),
      );
    } else {
      setCards((prev) =>
        prev.map((c) =>
          c.id === a.id || c.id === b.id ? { ...c, isFlipped: false } : c,
        ),
      );
    }

    setSelected([]);
    setIsChecking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-700 flex flex-col items-center justify-center">
      <p className="text-white text-2xl mb-2">
        同じ絵柄のカードをそろえよう！
      </p>

      {/* ターン数表示 */}
      <p className="text-white mb-4">ターン数: {turns}</p>

      {/* カードグリッド */}
      <div className="grid grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card)}
            className="w-16 h-20 bg-white rounded flex items-center justify-center text-xl cursor-pointer"
          >
            {card.isFlipped || card.isMatched ? (
              <img
                src={`/src/assets/cards/${card.value}.png`}
                className="w-auto h-auto object-cover rounded"
              />
            ) : (
              <img
                src={cardBack}
                alt="card back"
                className="w-auto h-auto object-cover rounded"
              />
            )}
          </div>
        ))}
        {/* デバッグ用ボタン
        <button onClick={onFinish} className="mt-6 bg-white px-4 py-2 rounded">
          結果へ
        </button> */}
      </div>
    </div>
  );
};

export default PlayScreen;
