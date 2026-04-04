import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_APP_supabaseUrl;
const supabaseKey = import.meta.env.VITE_APP_supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
