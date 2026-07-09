export type GameStatus = 'waiting' | 'playing' | 'leaderboard' | 'finished';

export interface Game {
  id: string;
  code: string;
  status: GameStatus;
  current_question_index: number;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  game_id: string;
  name: string;
  score: number;
  is_online: boolean;
  joined_at: string;
  last_seen_at: string;
  is_admin: boolean;
}

export type QuestionType = 'text' | 'photo' | 'video' | 'multiple_photos' | 'video_text' | 'photo_text' | 'no_media';

export type AnswerType = 'single' | 'multiple' | 'text';

export interface Question {
  id: string;
  game_id: string;
  index: number;
  type: QuestionType;
  text: string;
  answer_type: AnswerType;
  options?: string[];
  correct_answers?: string[];
  correct_text_answer?: string;
  timer_seconds: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  question_id: string;
  type: 'image' | 'video';
  url: string;
  order: number;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  player_id: string;
  answer: string | string[];
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

export interface LeaderboardEntry {
  id: string;
  game_id: string;
  player_id: string;
  rank: number;
  score: number;
  created_at: string;
}

export interface GameState {
  id: string;
  game_id: string;
  current_question_index: number;
  timer_started_at?: string;
  status: GameStatus;
  updated_at: string;
}

export interface GameWithRelations extends Game {
  players: Player[];
  questions: Question[];
  game_state: GameState;
}
