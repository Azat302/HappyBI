-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    current_question_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    is_online BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_admin BOOLEAN NOT NULL DEFAULT false
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    index INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'text',
    text TEXT NOT NULL,
    answer_type VARCHAR(20) NOT NULL DEFAULT 'single',
    options TEXT[],
    correct_answers TEXT[],
    correct_text_answer TEXT,
    timer_seconds INTEGER NOT NULL DEFAULT 30,
    points INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(game_id, index)
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_earned INTEGER NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(question_id, player_id)
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create game_state table
CREATE TABLE IF NOT EXISTS game_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE UNIQUE,
    current_question_index INTEGER NOT NULL DEFAULT 0,
    timer_started_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_questions_game_id ON questions(game_id);
CREATE INDEX IF NOT EXISTS idx_media_question_id ON media(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_player_id ON answers(player_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_game_id ON leaderboard(game_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE questions;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;
