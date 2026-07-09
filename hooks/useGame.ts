'use client';

import { useEffect, useState } from 'react';
import { Game, GameState, Player, Question } from '@/lib/types';

// Тестовые данные
const mockQuestions: Question[] = [
  {
    id: '1',
    game_id: '00000000-0000-0000-0000-000000000302',
    index: 0,
    type: 'text',
    text: 'Столица Франции?',
    answer_type: 'single',
    options: ['Лондон', 'Париж', 'Берлин', 'Мадрид'],
    correct_answers: ['Париж'],
    timer_seconds: 30,
    points: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    game_id: '00000000-0000-0000-0000-000000000302',
    index: 1,
    type: 'text',
    text: 'Сколько планет в Солнечной системе?',
    answer_type: 'single',
    options: ['7', '8', '9', '10'],
    correct_answers: ['8'],
    timer_seconds: 30,
    points: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    game_id: '00000000-0000-0000-0000-000000000302',
    index: 2,
    type: 'text',
    text: 'Самое большое животное на Земле?',
    answer_type: 'single',
    options: ['Слон', 'Жираф', 'Синий кит', 'Белый медведь'],
    correct_answers: ['Синий кит'],
    timer_seconds: 30,
    points: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockPlayers: Player[] = []; // Пустой массив - без тестовых игроков

const mockGame: Game = {
  id: '00000000-0000-0000-0000-000000000302',
  code: '302',
  status: 'waiting',
  current_question_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockGameState: GameState = {
  id: '1',
  game_id: '00000000-0000-0000-0000-000000000302',
  current_question_index: 0,
  status: 'waiting',
  updated_at: new Date().toISOString()
};

// Глобальное состояние для эмуляции realtime
let globalGameState = { ...mockGameState };
let globalPlayers = [...mockPlayers];

export function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(mockGame);
  const [gameState, setGameState] = useState<GameState | null>(globalGameState);
  const [players, setPlayers] = useState<Player[]>(globalPlayers);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [loading, setLoading] = useState(false);

  // Функции для управления состоянием игры
  const updateGameStatus = (status: GameState['status']) => {
    globalGameState = { ...globalGameState, status, updated_at: new Date().toISOString() };
    setGameState({ ...globalGameState });
  };

  const nextQuestion = () => {
    const newIndex = (globalGameState.current_question_index + 1) % questions.length;
    globalGameState = { ...globalGameState, current_question_index: newIndex, status: 'playing', updated_at: new Date().toISOString() };
    setGameState({ ...globalGameState });
  };

  const prevQuestion = () => {
    const newIndex = Math.max(0, globalGameState.current_question_index - 1);
    globalGameState = { ...globalGameState, current_question_index: newIndex, updated_at: new Date().toISOString() };
    setGameState({ ...globalGameState });
  };

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      game_id: gameId,
      name,
      score: 0,
      is_online: true,
      joined_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      is_admin: false
    };
    globalPlayers = [...globalPlayers, newPlayer];
    setPlayers([...globalPlayers]);
  };

  const removePlayer = (playerId: string) => {
    globalPlayers = globalPlayers.filter(p => p.id !== playerId);
    setPlayers([...globalPlayers]);
  };

  const resetGame = () => {
    globalGameState = { ...mockGameState };
    globalPlayers = [...mockPlayers];
    setGameState({ ...globalGameState });
    setPlayers([...globalPlayers]);
  };

  const showLeaderboard = () => {
    globalGameState = { ...globalGameState, status: 'leaderboard', updated_at: new Date().toISOString() };
    setGameState({ ...globalGameState });
  };

  const finishGame = () => {
    globalGameState = { ...globalGameState, status: 'finished', updated_at: new Date().toISOString() };
    setGameState({ ...globalGameState });
  };

  return { 
    game, 
    gameState, 
    players, 
    questions, 
    loading,
    updateGameStatus,
    nextQuestion,
    prevQuestion,
    addPlayer,
    removePlayer,
    resetGame,
    showLeaderboard,
    finishGame
  };
}
