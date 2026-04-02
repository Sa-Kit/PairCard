import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scfwilfmcmrixrisfwvr.supabase.co';
const supabaseKey = 'sb_publishable_QdAr-w_U2LsvryySPSfTQQ_Aaph_zxM';

export const supabase = createClient(supabaseUrl, supabaseKey);