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

if __name__ == "__main__":

    while song["songTitle"] == None or song["songArtist"] == None:
        song["songTitle"], song["songArtist"] = getRandomSong()
        song["songAlbum"], song["songURLs"]["spotify"], song["songCover"] = (
            findSongSpotify(song["songTitle"])
        )

    addSong(song)
    sendEmail(song)
    archiveSong(song)
