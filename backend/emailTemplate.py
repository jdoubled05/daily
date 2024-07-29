from mailjet_rest import Client
import os
from dotenv import load_dotenv

load_dotenv()


def sendEmail(song):
    # Define your variables
    song_name = song["songTitle"]
    artist_name = song["songArtist"]
    image_src = song["songCover"]
    image_alt = song["songAlbum"]
    spotify_link = song["songURLs"]["spotify"]

    # Create the modern HTML email template with the Python variables
    html_template = f"""
  <html>
    <head>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
      <link
        href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
        rel='stylesheet'
      />
      <style>
        body {{
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          font-family: 'Roboto', sans-serif;
        }}

        .email-container {{
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }}

        .header {{
          background-color: #4CAF50;
          padding: 20px;
          color: white;
          text-align: center;
        }}

        .content {{
          padding: 20px;
          text-align: center;
        }}

        .song-title {{
          font-size: 24px;
          font-weight: 500;
          margin: 10px 0;
        }}

        .artist-name {{
          font-size: 18px;
          font-weight: 400;
          margin: 8px 0;
        }}

        .song-container {{
          margin: 20px 0;
        }}

        #album_cover {{
          width: 100%;
          max-width: 300px;
          border-radius: 8px;
          margin: 1rem 0;
        }}

        .link-container {{
          margin: 20px 0;
        }}

        .unsubscribe {{
          font-size: 12px;
          color: #777;
          margin-top: 20px;
        }}

        .unsubscribe a {{
          color: #4CAF50;
          text-decoration: none;
        }}
      </style>
    </head>
    <body>
      <div class='email-container'>
        <div class='header'>
          <h1>Today's Track</h1>
        </div>
        <div class='content'>
          <p>Here is today's track! Take a listen!</p>
          <p class='song-title'>{song_name}</p>
          <p class='artist-name'>{artist_name}</p>
          <div class='song-container'>
            <img src='{image_src}' alt='{image_alt}' id='album_cover' />
            <div class='link-container'>
              <a href='{spotify_link}' target='_blank'>
                <img src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Green.png' alt='Spotify' style='width: 120px; border-radius: 8px;'>
              </a>
            </div>
          </div>
          <p class='unsubscribe'>
            To stop receiving these emails, <a href='[[UNSUB_LINK_EN]]'>unsubscribe.</a>
          </p>
        </div>
      </div>
    </body>
  </html>
  """

    # Mailjet API credentials
    api_key = os.environ.get("MAILJET_API_KEY")
    api_secret = os.environ.get("MAILJET_API_SECRET")
    mailjet = Client(auth=(api_key, api_secret), version="v3.1")

    # Define the email parameters
    data = {
        "Messages": [
            {
                "From": {
                    "Email": os.environ.get("MAILJET_SENDER_EMAIL"),
                    "Name": "daily.",
                },
                "To": [
                    {"Email": "jdoubled05@gmail.com", "Name": "Jordan"},
                    {"Email": "jameswarren20@gmail.com", "Name": "James"},
                ],
                "Subject": "Check out this song!",
                "HTMLPart": html_template,
            }
        ]
    }

    # Send the email
    response = mailjet.send.create(data=data)

    # Print the response
    print(response.status_code)
    print(response.json())
