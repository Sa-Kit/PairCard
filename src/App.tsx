import { useState } from "react";
import StartScreen from "./components/StartScreen";
import PlayScreen from "./components/PlayScreen";
import ResultScreen from "./components/ResultScreen";
import type { ScreenType } from "./types/Screen";

type ResultData = {
  turns: number;
  time: number;
  score: number;
};

const App = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [screen, setScreen] = useState<ScreenType>("start");

  return (
    <div>
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("play")} />
      )}

      {screen === "play" && (
        <PlayScreen
          onFinish={(data) => {
            setResult(data);
            setScreen("result");
          }}
        />
      )}

      {screen === "result" && result && (
        <ResultScreen
          result={result}
          onRestart={() => setScreen("start")}
        />
      )}
    </div>
  );
};

export default App;