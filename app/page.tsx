'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';

export default function Home() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addPlayer } = useGame('00000000-0000-0000-0000-000000000302');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (gameCode === '302302') {
        router.push('/admin');
        return;
      }

      if (gameCode !== '302') {
        throw new Error('Неверный код игры');
      }

      // Добавляем игрока в общий список
      const newPlayerId = Date.now().toString();
      addPlayer(playerName);
      
      // Для теста без Supabase: сохраняем имя и переходим
      localStorage.setItem('playerName', playerName);
      localStorage.setItem('playerId', newPlayerId);
      router.push('/player');
    } catch (err: any) {
      setError(err.message || 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2"
          >
            Quiz302
          </motion.h1>
          <p className="text-gray-400 text-lg">Многопользовательская онлайн-викторина</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700"
        >
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium text-gray-300 mb-2">
                Код игры
              </label>
              <input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                placeholder="Введите код игры"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
                Имя
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Введите имя"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Подключаемся...' : 'Войти'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
