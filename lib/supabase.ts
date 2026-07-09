import { createClient } from '@supabase/supabase-js';

// Создаем заглушку для Supabase, если переменные не заданы
// Это позволяет деплоить на Vercel без настроенного Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем клиент только если есть переменные, иначе - заглушку
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : // Заглушка с пустыми методами
    {
      from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }), order: () => ({ data: [] }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({}) }),
        delete: () => ({ eq: () => ({}) }),
      }),
      channel: () => ({ on: () => ({}), subscribe: () => ({ unsubscribe: () => {} }) }),
      removeChannel: () => {},
    } as any;
