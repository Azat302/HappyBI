'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Game, GameState, Player, Question } from '@/lib/types';

export function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchData = async () => {
      setLoading(true);
      
      const [gameRes, gameStateRes, playersRes, questionsRes] = await Promise.all([
        supabase.from('games').select('*').eq('id', gameId).single(),
        supabase.from('game_state').select('*').eq('game_id', gameId).single(),
        supabase.from('players').select('*').eq('game_id', gameId).order('joined_at', { ascending: true }),
        supabase.from('questions').select('*').eq('game_id', gameId).order('index', { ascending: true }),
      ]);

      if (gameRes.data) setGame(gameRes.data);
      if (gameStateRes.data) setGameState(gameStateRes.data);
      if (playersRes.data) setPlayers(playersRes.data);
      if (questionsRes.data) setQuestions(questionsRes.data);
      
      setLoading(false);
    };

    fetchData();

    const gameChannel = supabase
      .channel(`game:${gameId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${gameId}` }, (payload) => {
        setGame(payload.new as Game);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state', filter: `game_id=eq.${gameId}` }, (payload) => {
        setGameState(payload.new as GameState);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `game_id=eq.${gameId}` }, () => {
        fetchPlayers();
      })
      .subscribe();

    const fetchPlayers = async () => {
      const { data } = await supabase.from('players').select('*').eq('game_id', gameId).order('joined_at', { ascending: true });
      if (data) setPlayers(data);
    };

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [gameId]);

  return { game, gameState, players, questions, loading };
}
