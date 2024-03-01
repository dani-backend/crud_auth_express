import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabseKey);

export default supabase;
