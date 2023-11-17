"use client";
import { useState } from "react";
import Game from "./Game";

const Start = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="h-full flex flex-col justify-center">
      {gameStarted ? (
        <Game />
      ) : (
        <div className="text-gray-700">
          <h1 className="bg-white text-base font-size: 1rem max-w-xl m-[auto] p-4 mb-1.5 shadow-md rounded-t-md text-center">
            Игра в города на время
          </h1>
          <div className="bg-white max-w-xl m-[auto] p-6 px-6 prose shadow-md rounded-b-md">
            <div className="mb-6">
              Цель: Назвать как можно больше реальных городов.
            </div>
            <ul className="list-disc list-outside ml-6">
              <li>Запрещается повторение городов.</li>
              <li>
                Названий городов на твердый “ъ” и мягкий “ь” знак нет. Из-за
                этого пропускаем эту букву и игрок должен назвать город на
                букву стоящую перед ъ или ь знаком.
              </li>
              <li>
                Каждому игроку дается 2 минуты на размышления, если спустя это
                время игрок не вводит слово он считается проигравшим
              </li>
            </ul>
            <button
              className="bg-purple-600 hover:bg-purple-700 mt-6 text-white py-2 px-4 rounded-md mx-auto block"
              onClick={handleStartGame}
            >
              Начать игру
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
