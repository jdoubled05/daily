import { Database } from "@/database.types";
import { createClient, PostgrestError } from "@supabase/supabase-js";

export type User = {
  name: string;
  email: string;
};

export type Song = {
  title: string;
  artist: string;
  album: string | null;
  spotify_url: string | null;
  album_cover_url: string | null;
};

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

type SongResponse =
  | { data: Song[]; error: null }
  | { data: null; error: PostgrestError };

export async function getSong(): Promise<SongResponse> {
  const { data, error } = await supabase
    .from("song_deck")
    .select("title, artist, album, spotify_url, album_cover_url")
    .order("id", { ascending: true })
    .limit(1);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

const getId = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    return undefined;
  }

  if (data.length > 0) {
    return data[0].id + 1;
  }

  return 1;
};

export async function addUser(values: User) {
  getId().then(async (res) => {
    const { error } = await supabase
      .from("users")
      .insert({ id: res, name: values.name, email: values.email });
    if (error) {
      throw error.message;
    }
  });
}
