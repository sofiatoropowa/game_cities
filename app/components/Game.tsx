"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import TimeoutModal from "./TimeoutModal";
import sendPic from "./../assets/images/send.svg";

let citiesList: string[] = [];

const Game = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [currentCity, setCurrentCity] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("player");
  const [countdown, setCountdown] = useState(120);
  const [timeoutModalVisible, setTimeoutModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const citiesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (citiesContainerRef.current) {
      citiesContainerRef.current.scrollTop = citiesContainerRef.current.scrollHeight;
    }
  }, [cities]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/cities.txt");
        const data = await response.text();
        citiesList = data.split("\n").map((city) => city.trim().toLowerCase());
      } catch (error) {
        console.error("Ошибка открытия файла .txt:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (
      currentPlayer === "player" &&
      !submitted &&
      countdown > 0 &&
      !timeoutModalVisible
    ) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [currentPlayer, submitted, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      handleTimeout();
    }
  }, [countdown]);

  const handleTimeout = () => {
    setCountdown(120);
    setTimeoutModalVisible(true);
  };

  const handleCitySubmit = (city: string) => {
    city = city.trim().toLowerCase();

    let lastLetter =
      cities.length > 0
        ? cities[cities.length - 1].slice(-1).toLowerCase()
        : "";

    if (lastLetter === "ь" || lastLetter === "ъ" || lastLetter === "ы") {
      lastLetter = cities[cities.length - 1].slice(-2, -1).toLowerCase();
    }

    if (!cities.includes(city)) {
      if (citiesList.includes(city)) {
        if (city.startsWith(lastLetter)) {
          setCities((prevCities) => [...prevCities, city]);
          setSubmitted(true);
          setCurrentPlayer("computer");
          setCountdown(120);
          setErrorMessage(null);
        } else {
          setErrorMessage(
            "Город должен начинаться на последнюю букву предыдщего"
          );
        }
      } else {
        setErrorMessage("Город не существует");
      }
    } else {
      setErrorMessage("Этот город уже был");
    }
  };

  useEffect(() => {
    setPlaceholder("Напишите любой город, например: Где вы живете?");
  }, []);

  useEffect(() => {
    if (submitted) {
      setCurrentCity("");
      getCityFromList();
    }
  }, [submitted]);

  const getCityFromList = () => {
    let lastLetter =
      cities.length > 0
        ? cities[cities.length - 1].slice(-1).toLowerCase()
        : "";
    
    if (lastLetter === "ь" || lastLetter === "ъ" || lastLetter === "ы") {
      lastLetter = cities[cities.length - 1].slice(-2, -1).toLowerCase();
    }

    const computerCity = getCityStart(lastLetter).filter(
      (city) => !cities.includes(city)
    );

    if (computerCity.length > 0) {
      const selectedCity =
        computerCity[Math.floor(Math.random() * computerCity.length)];
      setCities((prevCities) => [...prevCities, selectedCity]);
      setCurrentPlayer("player");
      setSubmitted(false);
      setPlaceholder(
        `Знаете город на букву “${selectedCity.slice(-1).toUpperCase()}”?`
      );
    } else {
      setCountdown(0);
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      handleTimeout();
    }
  }, [countdown]);

  const getCityStart = (letter: string) => {
    const filteredCities = citiesList.filter((city) => city.startsWith(letter));
    return filteredCities;
  };

  return (
    <div>
      {!timeoutModalVisible && (
        <div>
          <div className="bg-white text-base font-size: 1rem max-w-xl m-[auto] p-4 mb-1.5 flex justify-between shadow-base rounded-t-md text-center relative">
            <div>Сейчас ваша очередь</div>
            <div>
              {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, "0")}
            </div>
            <div
              className="bg-purple-300 h-1.5 absolute top-14 left-0"
              style={{ width: `${(countdown / 120) * 100}%` }}
            ></div>
          </div>
          <div className="bg-white max-w-xl m-[auto] p-6 px-6 prose shadow-md rounded-b-md">
            {cities.length === 0 && (
              <div className="h-80 flex justify-center items-center text-gray-400">
                Первый участник вспоминает города...
              </div>
            )}
            {cities.length !== 0 && (
              <div 
              ref={citiesContainerRef}
              className="h-80 overflow-y-auto">
                {cities.map((city, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      index % 2 === 0
                        ? "text-right bg-purple-500 text-white rounded-l-md rounded-tr-md max-w-fit ml-auto"
                        : "text-left bg-purple-50 text-gray-700 rounded-r-md rounded-tl-md max-w-fit mr-auto"
                    } py-2 px-4 w-fit`}
                  >
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </div>
                ))}
              </div>
            )}
            {cities.length !== 0 && (
              <div className="text-center text-gray-400">
                Всего перечислено городов: {cities.length}
              </div>
            )}
            <div className="relative">
              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}
              <form
                action="#"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCitySubmit(currentCity);
                }}
              >
                <input
                  className="w-full h-12 px-4 mt-6 bg-gray-100 rounded-md"
                  type="text"
                  value={currentCity}
                  placeholder={placeholder}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  autoFocus={true}
                  disabled={submitted}
                />
                <button
                  className={`${
                    submitted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600"
                  } text-white py-1.5 px-1.5 absolute right-2 bottom-2 rounded-md`}
                  onClick={() => handleCitySubmit(currentCity)}
                  disabled={submitted}
                >
                  <Image className="w-5 h-5" src={sendPic} alt="send" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {timeoutModalVisible && (
        <TimeoutModal
          currentPlayer={currentPlayer}
          countdown={countdown}
          cities={cities}
        />
      )}
    </div>
  );
};

export default Game;
