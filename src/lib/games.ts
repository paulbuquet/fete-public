import { supabase } from "@/lib/supabase";

export interface GameRow {
  name: string;
  enabled: boolean;
}

export async function fetchAllGames(): Promise<GameRow[]> {
  const { data, error } = await supabase
    .from("games")
    .select("name, enabled");
  if (error) throw error;
  return data ?? [];
}