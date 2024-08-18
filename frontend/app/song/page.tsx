import { getSong } from "../supabase/supabaseClient";
import React from "react";

export default async function SongPage() {
  const { data, error } = await getSong();

  if (error) {
    // Handle the error case
    return <div>Error fetching song: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    // Handle the case where no song is found
    return <div>No song found</div>;
  }

  const song = data[0];

  return (
    <div>
      <h1>{song.title}</h1>
      <p>{song.artist}</p>
      <p>{song.album}</p>
      {song.spotify_url && <a href={song.spotify_url}>Listen on Spotify</a>}
      {song.album_cover_url && (
        <img src={song.album_cover_url} alt={song.album || "Album cover"} />
      )}
    </div>
  );
}

// import { Database } from "@/database.types";
// import { createClient } from "@supabase/supabase-js";

// export type User = {
//   name: string;
//   email: string;
// };

// const supabase = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL as string,
//   process.env.NEXT_PUBLIC_SUPABASE_KEY as string
// );

// export async function getSong() {
//   const { data, error } = await supabase
//     .from("song_deck")
//     .select("title, artist, album, spotify_url, album_cover_url")
//     .order("id", { ascending: true })
//     .limit(1);

//   if (error) {
//     return error;
//   }

//   return data;
// }

// const getId = async () => {
//   const { data, error } = await supabase
//     .from("users")
//     .select("id")
//     .order("id", { ascending: false })
//     .limit(1);

//   if (error) {
//     return undefined;
//   }

//   if (data.length > 0) {
//     return data[0].id + 1;
//   }

//   return 1;
// };

// export async function addUser(values: User) {
//   getId().then(async (res) => {
//     console.log(res);
//     const { error } = await supabase
//       .from("users")
//       .insert({ id: res, name: values.name, email: values.email });
//     if (error) {
//       throw error.message;
//     }
//     console.log(error);
//   });
// }
