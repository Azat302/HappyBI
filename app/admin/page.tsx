'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { supabase } from '@/lib/supabase';
import { GameStatus } from '@/lib/types';
import { Play, SkipBack, SkipForward, Trophy, RotateCcw, UserMinus, PowerOff, ExternalLink } from 'lucide-react';

export default function AdminPage() {
  const gameId = '00000000-0000-0000-0000-000000000302';
  const { game, gameState, players, loading } = useGame(gameId);

  const ensureGameExists = async () => {
    const { data: existingGame } = await supabase.from('games').select('*').eq('id', gameId).single();
    
    if (!existingGame) {
      await supabase.from('games').insert([
        { id: gameId, code: '302', status: 'waiting', current_question_index: 0 }
      ]);
      await supabase.from('game_state').insert([
        { game_id: gameId, current_question_index: 0, status: 'waiting' }
      ]);
    }
  };

  const updateGameStatus = async (status: GameStatus) => {
    await ensureGameExists();
    await supabase.from('game_state').update({ status, updated_at: new Date().toISOString() }).eq('game_id', gameId);
    await supabase.from('games').update({ status, updated_at: new Date().toISOString() }).eq('id', gameId);
  };

  const nextQuestion = async () => {
    if (!gameState) return;
    const newIndex = gameState.current_question_index + 1;
    await supabase.from('game_state').update({ 
      current_question_index: newIndex, 
      status: 'playing', 
      updated_at: new Date().toISOString() 
    }).eq('game_id', gameId);
  };

  const prevQuestion = async () => {
    if (!gameState) return;
    const newIndex = Math.max(0, gameState.current_question_index - 1);
    await supabase.from('game_state').update({ 
      current_question_index: newIndex, 
      updated_at: new Date().toISOString() 
    }).eq('game_id', gameId);
  };

  const resetGame = async () => {
    await ensureGameExists();
    await supabase.from('players').delete().eq('game_id', gameId);
    await supabase.from('game_state').update({ 
      current_question_index: 0, 
      status: 'waiting', 
      updated_at: new Date().toISOString() 
    }).eq('game_id', gameId);
    await supabase.from('games').update({ 
      status: 'waiting', 
      current_question_index: 0, 
      updated_at: new Date().toISOString() 
    }).eq('id', gameId);
  };

  const removePlayer = async (playerId: string) => {
    await supabase.from('players').delete().eq('id', playerId);
  };

  const openHostScreen = () => {
    window.open('/host', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
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
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(player.joined_at).toLocaleTimeString()}
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
                  <span className="text-white font-semibold">{(gameState?.current_question_index ?? 0) + 1}</span>
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
                  onClick={() => updateGameStatus('finished')}
                  className="flex flex-col items-center gap-2 p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all transform hover:scale-[1.02]"
                >
                  <Trophy size={24} />
                  <span className="font-semibold">Завершить</span>
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
