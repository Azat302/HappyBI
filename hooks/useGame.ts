'use client';

import { useEffect, useState, useCallback } from 'react';
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

// Ключи для хранения в localStorage
const STORAGE_KEYS = {
  PLAYERS: 'quiz302_players',
  GAME_STATE: 'quiz302_game_state'
};

// BroadcastChannel для синхронизации между вкладками
const channel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('quiz302_updates')
  : null;

// Функции для работы с localStorage
const getStoredPlayers = (): Player[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredGameState = (): GameState => {
  if (typeof window === 'undefined') return mockGameState;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return stored ? JSON.parse(stored) : mockGameState;
  } catch {
    return mockGameState;
  }
};

const savePlayers = (players: Player[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  channel?.postMessage({ type: 'players_updated', players });
};

const saveGameState = (gameState: GameState) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  channel?.postMessage({ type: 'game_state_updated', gameState });
};

export function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(mockGame);
  const [gameState, setGameState] = useState<GameState>(() => getStoredGameState());
  const [players, setPlayers] = useState<Player[]>(() => getStoredPlayers());
  const [questions] = useState<Question[]>(mockQuestions);
  const [loading, setLoading] = useState(false);

  // Синхронизация состояния при изменениях в других вкладках
  useEffect(() => {
    if (!channel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'players_updated') {
        setPlayers(event.data.players);
      } else if (event.data.type === 'game_state_updated') {
        setGameState(event.data.gameState);
      }
    };

    channel.addEventListener('message', handleMessage);

    // Также слушаем изменения в localStorage для более надежной синхронизации
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PLAYERS && e.newValue) {
        setPlayers(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.GAME_STATE && e.newValue) {
        setGameState(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateGameStatus = useCallback((status: GameState['status']) => {
    const newState: GameState = { ...gameState, status, updated_at: new Date().toISOString() };
    setGameState(newState);
    saveGameState(newState);
  }, [gameState]);

  const nextQuestion = useCallback(() => {
    const newIndex = (gameState.current_question_index + 1) % questions.length;
    const newState: GameState = { 
      ...gameState, 
      current_question_index: newIndex, 
      status: 'playing', 
      updated_at: new Date().toISOString() 
    };
    setGameState(newState);
    saveGameState(newState);
  }, [gameState, questions.length]);

  const prevQuestion = useCallback(() => {
    const newIndex = Math.max(0, gameState.current_question_index - 1);
    const newState: GameState = { 
      ...gameState, 
      current_question_index: newIndex, 
      updated_at: new Date().toISOString() 
    };
    setGameState(newState);
    saveGameState(newState);
  }, [gameState]);

  const addPlayer = useCallback((name: string) => {
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
    const newPlayers = [...players, newPlayer];
    setPlayers(newPlayers);
    savePlayers(newPlayers);
  }, [players, gameId]);

  const removePlayer = useCallback((playerId: string) => {
    const newPlayers = players.filter(p => p.id !== playerId);
    setPlayers(newPlayers);
    savePlayers(newPlayers);
  }, [players]);

  const resetGame = useCallback(() => {
    saveGameState(mockGameState);
    savePlayers([]);
    setGameState(mockGameState);
    setPlayers([]);
  }, []);

  const showLeaderboard = useCallback(() => {
    const newState: GameState = { ...gameState, status: 'leaderboard', updated_at: new Date().toISOString() };
    setGameState(newState);
    saveGameState(newState);
  }, [gameState]);

  const finishGame = useCallback(() => {
    const newState: GameState = { ...gameState, status: 'finished', updated_at: new Date().toISOString() };
    setGameState(newState);
    saveGameState(newState);
  }, [gameState]);

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
