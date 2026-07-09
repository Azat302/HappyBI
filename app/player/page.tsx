'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '@/hooks/useGame';

export default function PlayerPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const gameId = '00000000-0000-0000-0000-000000000302';
  const { gameState, questions } = useGame(gameId);

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      router.push('/');
      return;
    }
    setPlayerName(name);
  }, [router]);

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswered(false);
  }, [gameState?.current_question_index]);

  const currentQuestion = questions[gameState?.current_question_index || 0];

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
  };

  const renderContent = () => {
    switch (gameState?.status) {
      case 'waiting':
        return (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Ожидайте начала игры</h2>
              <div className="flex justify-center gap-2 mt-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-3 h-3 bg-purple-500 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        );

      case 'playing':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <span className="text-gray-400 text-lg">Вопрос {gameState.current_question_index + 1}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              {currentQuestion?.text}
            </h2>

            <div className="grid gap-4">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = currentQuestion.correct_answers?.includes(option);
                let buttonClass = 'w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all';
                
                if (answered) {
                  if (isCorrect) {
                    buttonClass += ' bg-green-600 text-white';
                  } else if (isSelected) {
                    buttonClass += ' bg-red-600 text-white';
                  } else {
                    buttonClass += ' bg-gray-700 text-gray-400';
                  }
                } else {
                  buttonClass += isSelected 
                    ? ' bg-purple-600 text-white transform scale-[1.02]' 
                    : ' bg-gray-700 text-white hover:bg-gray-600';
                }

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={buttonClass}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 'leaderboard':
        return (
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-8"
            >
              🏆 Лидеры
            </motion.h2>
            <p className="text-gray-400">Таблица лидеров</p>
          </div>
        );

      case 'finished':
        return (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl mb-4">🎉</h1>
              <h2 className="text-3xl font-bold text-white mb-4">Игра завершена!</h2>
              <p className="text-gray-400">Спасибо за игру!</p>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!playerName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Кнопка назад */}
      <div className="w-full max-w-xl mb-4">
        <button
          onClick={() => {
            localStorage.removeItem('playerName');
            localStorage.removeItem('playerId');
            router.push('/');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
          Назад
        </button>
      </div>

      <div className="w-full max-w-xl flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <span className="text-gray-400">Привет, {playerName}!</span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
