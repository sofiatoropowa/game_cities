"use client";
import React, { useState } from "react";
import Game from "./Game";

interface TimeoutModalProps {
  currentPlayer: string;
  countdown: number;
  cities: string[];
}

const TimeoutModal: React.FC<TimeoutModalProps> = ({
  currentPlayer,
  countdown,
  cities,
}) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      {gameStarted ? (
        <Game />
      ) : (
        <div className="bg-white text-center py-10 shadow-base rounded-md max-w-xl m-[auto]">
          {currentPlayer === "player" && countdown === 120 ? (
            <div className="mb-8">
              К сожалению твое время вышло!
              <br />
              Твой противник победил!
            </div>
          ) : (
            <div className="mb-8">
              Поздравляем тебя с победой!
              <br />
              Твой противник не вспомнил нужный город!
            </div>
          )}
          <div
            className={`mb-8 text-3xl font-size: 1.875rem ${
              currentPlayer === "player" && countdown === 120
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            00:00
          </div>
          <div className="mb-8">
            Всего было перечислено городов: {cities.length}
            <br />
            Очень не плохой результат!
          </div>
          <div className="mb-1.5">Последний город названный победителем</div>
          <div className="mb-8 text-2xl	font-size: 1.5rem">
            {cities[cities.length - 1]}
          </div>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md"
            onClick={handleStartGame}
          >
            Начать новую игру
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeoutModal;
