import { useEffect, useState } from "react";
import cardBack from "../assets/bgCard/bg.png";
const allCards = import.meta.glob("../assets/cards/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const cardList = Object.values(allCards);

const getRandomCards = (count: number) => {
  const shuffled = [...cardList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

type PlayScreenProps = {
  onFinish: (result: ResultData) => void;
};

type Card = {
  id: number;
  src: string;
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

  // 初期化
  useEffect(() => {
    const initCards = () => {
      const selectedImages = getRandomCards(4); //カード枚数

      const duplicated = [...selectedImages, ...selectedImages];

      const shuffled = duplicated
        .sort(() => Math.random() - 0.5)
        .map((src, index) => ({
          id: index,
          src,
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

    if (a.src === b.src) {
      setCards((prev) =>
        prev.map((c) => (c.src === a.src ? { ...c, isMatched: true } : c)),
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
      <p className="text-white text-2xl mb-2">同じ絵柄のカードをそろえよう！</p>

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
                src={card.src}
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
