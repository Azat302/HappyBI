'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';

export default function HostPage() {
  const gameId = '00000000-0000-0000-0000-000000000302';
  const { gameState, players, questions } = useGame(gameId);
  const currentQuestion = questions[gameState?.current_question_index || 0];

  const renderContent = () => {
    switch (gameState?.status) {
      case 'waiting':
        return (
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-8"
            >
              Quiz302
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-12"
            >
              Ожидаем игроков
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
                >
                  <div className="text-2xl font-bold text-white mb-2">{player.name}</div>
                  <div className={`w-3 h-3 rounded-full mx-auto ${player.is_online ? 'bg-green-500' : 'bg-red-500'}`} />
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-gray-400 text-xl"
            >
              Игроков подключено: {players.length}
            </motion.div>
          </div>
        );

      case 'playing':
        return (
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-bold text-white mb-4"
            >
              Вопрос {gameState.current_question_index + 1}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mt-8 mb-12"
            >
              {currentQuestion?.text}
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {currentQuestion?.options?.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700"
                >
                  <div className="text-2xl font-semibold text-white">{option}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'leaderboard':
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        return (
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-8"
            >
              🏆 Лидеры
            </motion.h1>
            <div className="max-w-2xl mx-auto">
              {sortedPlayers.slice(0, 10).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                      {index + 1}
                    </span>
                    <span className="text-2xl font-semibold text-white">{player.name}</span>
                  </div>
                  <span className="text-3xl font-bold text-purple-400">{player.score}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'finished':
        const finalSortedPlayers = [...players].sort((a, b) => b.score - a.score);
        const winner = finalSortedPlayers[0];
        
        return (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <h1 className="text-6xl mb-4">🏆</h1>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                Победитель!
              </h2>
              {winner && (
                <div className="text-4xl font-bold text-white mb-12">
                  {winner.name}
                </div>
              )}
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-8">Топ-10</h3>
              {finalSortedPlayers.slice(0, 10).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 rounded-xl p-5 mb-3 border border-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                      {index + 1}
                    </span>
                    <span className="text-xl font-semibold text-white">{player.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-400">{player.score}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
}
