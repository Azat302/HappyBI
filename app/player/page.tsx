'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { supabase } from '@/lib/supabase';
import { GameStatus } from '@/lib/types';

export default function PlayerPage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const gameId = '00000000-0000-0000-0000-000000000302';
  const { game, gameState, players, loading } = useGame(gameId);

  useEffect(() => {
    const id = localStorage.getItem('playerId');
    if (!id) {
      router.push('/');
      return;
    }
    setPlayerId(id);

    const updateLastSeen = setInterval(async () => {
      await supabase.from('players').update({ last_seen_at: new Date().toISOString() }).eq('id', id);
    }, 30000);

    return () => clearInterval(updateLastSeen);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (gameState?.status) {
      case 'waiting':
        return (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
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
              <p className="text-gray-400 mt-8">Игроков подключено: {players.length}</p>
            </motion.div>
          </div>
        );
      case 'playing':
        return (
          <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Игра началась!</h2>
          <p className="text-gray-400">Здесь будет вопрос</p>
        </div>
        );
      case 'leaderboard':
        return (
          <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Таблица лидеров</h2>
        </div>
        );
      case 'finished':
        return (
          <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">🏆 Игра завершена!</h2>
        </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-2xl">
        {renderContent()}
      </div>
    </div>
  );
}
