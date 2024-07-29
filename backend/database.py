import os
import requests
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SECRET")
supabase: Client = create_client(url, key)


def getMaxId():
    response = (
        supabase.table("song_deck")
        .select("id")
        .order("id", desc=True)
        .limit(1)
        .execute()
    )

    if response.data:
        id = response.data[0]["id"]
        return id
    else:
        return 0


def addSong(song):
    id = getMaxId() + 1
    if song["songTitle"] and song["songArtist"]:
        try:
            response = (
                supabase.table("song_deck")
                .insert(
                    {
                        "id": id,
                        "title": song["songTitle"],
                        "artist": song["songArtist"],
                        "album": song["songAlbum"],
                        "spotify_url": song["songURLs"]["spotify"],
                        "apple_music_url": song["songURLs"]["appleMusic"],
                        "album_cover_url": song["songCover"],
                    }
                )
                .execute()
            )
            return response

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return None

    else:
        print("No track added.")
        return None


def archiveSong(song):
    id = getMaxId() + 1
    try:
        response = (
            supabase.table("song_archive")
            .insert(
                {
                    "id": id,
                    "title": song["songTitle"],
                    "artist": song["songArtist"],
                    "album": song["songAlbum"],
                    "spotify_url": song["songURLs"]["spotify"],
                    "apple_music_url": song["songURLs"]["appleMusic"],
                    "album_cover_url": song["songCover"],
                }
            )
            .execute()
        )
        return response

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
