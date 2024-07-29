import base64
import os
from dotenv import load_dotenv
import requests
import random
from database import addSong

load_dotenv()

songTitle = None
songArtist = None
songAlbum = None
songURLs = None
songCover = None


def getRandomTag():
    baseUrl = "https://ws.audioscrobbler.com/2.0/"
    apiKey = os.environ.get("FM_API_KEY")
    method = "tag.getTopTags"

    url = f"{baseUrl}?method={method}&api_key={apiKey}&format=json"

    try:
        response = requests.get(url)
        response.raise_for_status()

        topTags = response.json()["toptags"]["tag"]

        randomTag = random.choice(topTags)

        tagName = randomTag["name"]

        return tagName

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None, None


def getRandomSong():
    baseUrl = "https://ws.audioscrobbler.com/2.0/"
    apiKey = os.environ.get("FM_API_KEY")
    method = "tag.getTopTracks"
    tagName = getRandomTag()
    limit = 1000

    url = f"{baseUrl}?method={method}&tag={tagName}&api_key={apiKey}&limit={limit}&format=json"

    try:
        response = requests.get(url)
        response.raise_for_status()

        topSongs = response.json()["tracks"]["track"]

        randomSong = random.choice(topSongs)

        songTitle = randomSong["name"]
        songArtist = randomSong["artist"]["name"]

        return songTitle, songArtist

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None, None


def getAccessToken():
    clientId = os.environ.get("SPOTIFY_CLIENT_ID")
    clientSecret = os.environ.get("SPOTIFY_CLIENT_SECRET")
    authUrl = "https://accounts.spotify.com/api/token"

    authStr = f"{clientId}:{clientSecret}"
    base64AuthStr = base64.b64encode(authStr.encode()).decode()

    headers = {"Authorization": f"Basic {base64AuthStr}"}
    data = {"grant_type": "client_credentials"}

    try:
        response = requests.post(authUrl, headers=headers, data=data)

        accessToken = response.json()["access_token"]

        return accessToken

    except requests.exceptions.RequestException as e:
        print(f"Error fetching access token: {e}")
        return None


def findSongSpotify(songTitle):
    accessToken = getAccessToken()
    baseUrl = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {accessToken}"}
    params = {"q": songTitle, "type": "track", "limit": 1}

    try:
        response = requests.get(baseUrl, headers=headers, params=params)
        response.raise_for_status()

        data = response.json()

        if data["tracks"]["items"]:
            track = data["tracks"]["items"][0]
            # title = track["name"]
            # artist = track["artists"][0]["name"]
            songAlbum = track["album"]["name"]
            spotifyURL = track["external_urls"]["spotify"]
            songCover = track["album"]["images"][0]["url"]
            return songAlbum, spotifyURL, songCover
        else:
            print("No tracks found matching the search criteria.")
            return None, None, None

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None, None, None
