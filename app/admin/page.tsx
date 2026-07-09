'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { Play, SkipBack, SkipForward, Trophy, RotateCcw, UserMinus, ExternalLink, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const gameId = '00000000-0000-0000-0000-000000000302';
  const { 
    gameState, 
    players, 
    loading, 
    updateGameStatus, 
    nextQuestion, 
    prevQuestion, 
    resetGame, 
    removePlayer,
    showLeaderboard,
    finishGame
  } = useGame(gameId);

  const openHostScreen = () => {
    window.open('/host', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Кнопка назад */}
      <div className="max-w-7xl mx-auto mb-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all"
        >
          <ArrowLeft size={20} />
          Назад
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Игроки ({players.length})</h2>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-700 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{player.name}</span>
                        <span className={`w-2 h-2 rounded-full ${player.is_online ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        Баллы: {player.score}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all"
                        title="Удалить игрока"
                      >
                        <UserMinus size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Панель управления</h2>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400">Статус игры:</span>
                  <span className={`font-semibold ${gameState?.status === 'waiting' ? 'text-yellow-400' : gameState?.status === 'playing' ? 'text-green-400' : 'text-purple-400'}`}>
                    {gameState?.status === 'waiting' ? 'Ожидание' : gameState?.status === 'playing' ? 'Игра' : gameState?.status === 'leaderboard' ? 'Лидеры' : 'Завершено'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Текущий вопрос:</span>
                  <span className="text-white font-semibold">{(gameState?.current_question_index || 0) + 1}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  onClick={() => updateGameStatus('playing')}
                  className="flex flex-col items-center gap-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  <Play size={24} />
                  <span className="font-semibold">Начать игру</span>
                </button>

                <button
                  onClick={prevQuestion}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  <SkipBack size={24} />
                  <span className="font-semibold">Назад</span>
                </button>

                <button
                  onClick={nextQuestion}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  <SkipForward size={24} />
                  <span className="font-semibold">Вперед</span>
                </button>

                <button
                  onClick={showLeaderboard}
                  className="flex flex-col items-center gap-2 p-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  <Trophy size={24} />
                  <span className="font-semibold">Лидеры</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-2 p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all"
                >
                  <RotateCcw size={20} />
                  <span className="font-semibold">Сбросить</span>
                </button>

                <button
                  onClick={openHostScreen}
                  className="flex items-center justify-center gap-2 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
                >
                  <ExternalLink size={20} />
                  <span className="font-semibold">Экран ведущего</span>
                </button>

                <button
                  onClick={finishGame}
                  className="flex items-center justify-center gap-2 p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                >
                  <Trophy size={20} />
                  <span className="font-semibold">Завершить</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
