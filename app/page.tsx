'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        throw new Error('Invalid game code');
      }

      const gameId = '00000000-0000-0000-0000-000000000302';
      const { data: existingGame } = await supabase.from('games').select('*').eq('id', gameId).single();

      if (!existingGame) {
        const { error: gameError } = await supabase.from('games').insert([
          { id: gameId, code: '302', status: 'waiting', current_question_index: 0 }
        ]);
        if (gameError) throw gameError;

        const { error: stateError } = await supabase.from('game_state').insert([
          { game_id: gameId, current_question_index: 0, status: 'waiting' }
        ]);
        if (stateError) throw stateError;
      }

      const { data: player, error: playerError } = await supabase.from('players').insert([
        {
          game_id: gameId,
          name: playerName,
          score: 0,
          is_online: true,
          is_admin: false
        }
      ]).select().single();

      if (playerError) throw playerError;

      localStorage.setItem('playerId', player.id);
      router.push('/player');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
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
