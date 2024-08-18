"use client";

import {
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Title,
  Container,
  BackgroundImage,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import Link from "next/link";
import backgroundImage from "../assets/backgroundImage.jpg";
import { notifications } from "@mantine/notifications";
import { getSong } from "./lib/supabaseClient";

type Song = {
  title: string;
  artist: string;
  album: string;
  spotify_url: string;
  album_cover_url: string;
};

export default function Home() {
  const [song, setSong] = useState<Song | null>({
    title: "",
    artist: "",
    album: "",
    spotify_url: "",
    album_cover_url: "",
  });

  useEffect(() => {
    getSong().then((res: any) => {
      if (res && res.data && res.data.length > 0) {
        setSong(res.data[0]);
      } else {
        // Handle the case where no song is found or there was an error
        console.error("No song data found or an error occurred", res.error);
        setSong(null);
      }
    });
  }, []);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const sendWelcomeEmail = async (values: typeof form.values) => {
    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const result = await response.json();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const addContact = async (values: typeof form.values) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const result = await response.json();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await addContact(values);
      await sendWelcomeEmail(values);
      form.reset();
      notifications.show({
        color: "green",
        title: "Oh! Well imagine..",
        message: "Check your inbox! You have successfully subscribed!",
      });
    } catch (error: any) {
      console.log(error.message);
      if (error.message.includes("duplicate key value")) {
        notifications.show({
          color: "red",
          title: "Somebody once told...",
          message: "You're already subscribed!",
        });
      } else {
        notifications.show({
          color: "red",
          title: "Hello darkness, my old friend...",
          message: "Something went wrong. Try again!",
        });
      }
    }
  };

  return (
    <Container h="100%" mih="100vh" w="100%" miw="100vw" p={0}>
      <BackgroundImage
        src={backgroundImage.src}
        w="100%"
        h="100%"
        style={{
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Group justify="space-around" w="100%">
          <Title
            order={1}
            c="#202020"
            style={{ fontFamily: "Inter, sans-serif" }}
            p="lg"
          >
            daily.
          </Title>
        </Group>

        <Stack align="center" gap="xl" p="lg">
          {/* Song Information */}
          <Card p="xl" radius="lg" bg="#00000099" w="80%">
            <Group w="100%" justify="space-around">
              {song && (
                <Stack gap="xs">
                  <Title order={3} c="#f5f5f5">
                    Today`&apos;`s Track!
                  </Title>
                  <Title order={2} style={{ lineHeight: 1 }} c="#f5f5f5">
                    {song.title}
                  </Title>
                  <Text size="lg" c="#f5f5f5" inline>
                    {song.artist}
                  </Text>
                  <Text inline size="lg" c="#f5f5f580">
                    {song.album}
                  </Text>
                  <Image
                    height={300}
                    width={300}
                    src={song.album_cover_url}
                    alt={song.album}
                    radius="lg"
                  />
                  <Button
                    color="linear-gradient(90deg, #1DB954 0%, #1ED760 100%)"
                    component={Link}
                    href={song.spotify_url}
                    target="_blank"
                  >
                    Listen on Spotify
                  </Button>
                </Stack>
              )}
              <Stack gap="sm">
                <Title order={3} c="#f5f5f5">
                  Join us and expand your music library!
                </Title>
                <Text c="#f5f5f580">
                  Enter your name and email to receive the daily track in your
                  inbox daily.
                </Text>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <TextInput
                    c="#f5f5f5"
                    withAsterisk
                    label="Name"
                    placeholder="Your name"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    c="#f5f5f5"
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    {...form.getInputProps("email")}
                  />
                  <Group justify="flex-end" mt="md">
                    <Button type="submit" color="#f5f5f5" c="#202020">
                      Submit
                    </Button>
                  </Group>
                </form>
              </Stack>
            </Group>
          </Card>
        </Stack>
      </BackgroundImage>
    </Container>
  );
}
