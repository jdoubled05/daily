from apis import getRandomSong, findSongSpotify
from database import addSong, archiveSong
from emailTemplate import sendEmail

song = {
    "songTitle": None,
    "songArtist": None,
    "songAlbum": None,
    "songURLs": {"spotify": None, "appleMusic": None},
    "songCover": None,
}

def app():
    while song["songTitle"] is None or song["songArtist"] is None:
        song["songTitle"], song["songArtist"] = getRandomSong()
        song["songAlbum"], song["songURLs"]["spotify"], song["songCover"] = (
            findSongSpotify(song["songTitle"])
        )

    addSong(song)
    sendEmail(song)
    archiveSong(song)

# Only run the task if the script is executed directly (not imported)
if __name__ == "__main__":
    app()
