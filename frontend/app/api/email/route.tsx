import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC as string,
  process.env.MJ_APIKEY_PRIVATE as string
);

const senderEmail = process.env.SENDER_EMAIL;

const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: "daily.",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          TemplateID: 6205920,
          TemplateLanguage: true,
        },
      ],
    });

    const result = await request;
    return result.body;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const { email, name } = await request.json();

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        {
          error: "Missing required fields: type, email, and name are required.",
        },
        { status: 400 }
      );
    }

    let response;

    response = await sendWelcomeEmail(email, name);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error:", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
