import connectDB from "@/lib/mongodb";
import { Response } from "@/models/response";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    await connectDB();
    const token = process.env.GITHUB_TOKEN;
    const endpoint = "https://models.inference.ai.azure.com";
    const model = "gpt-4o";

    const { userInput, preference, email } = await req.json();

    let prompt = "";

    const { content_type, citation_style, writing_style, tone } =
      preference?.[0] || {};

    const requireReferences = citation_style && citation_style.trim() !== "";
    const isQAInput = /^\s*\d+\./m.test(userInput);

    const selectedTone =
      tone ||
      "friendly, conversational, and approachable, like talking to a colleague or friend";
    const selectedStyle =
      writing_style ||
      "natural, flowing sentences with varied structure, just like a human would speak";
    const selectedContentType = content_type || "answer";

    let referenceInstruction = "";
    if (requireReferences) {
      referenceInstruction = `
      - If using external facts, drop a quick in-text citation in **${citation_style}** style.
      - Wrap up with a "References" section listing at least 3 sources in **${citation_style}**.`;
    }

    prompt = `
      You are a seasoned expert, giving **one short, snappy, human-like ${selectedContentType}**.  

      **MANDATES (Human Style Overrides Everything):**  
      1. **Keep it Short & Smooth:** Use contractions (it's, don't, you'll), natural flow, and varied sentences.  
      2. **Be Direct:** Answer straight away—no intros, conclusions, or summaries.  
      3. **Sound Human:** Write **${selectedTone}**, in **${selectedStyle}**. Use casual transitions like "So," "But," "Actually," "Well," where a real person would. Avoid stiff or robotic phrasing.

      **User Request:**  
    ${
      isQAInput
        ? `Answer the numbered questions below in a simple Q&A format, restating the question in **bold** followed by a short answer:`
        : `Topic/question:`
    }
    ${userInput}

    ${isQAInput ? `Keep Q&A tight, friendly, and to the point.` : ""}
    ${referenceInstruction}
    `;

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model,
    });

    const generatedText = response.choices[0]?.message?.content ?? "";

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await Response.create({
      user_text: userInput,
      ai_response: generatedText,
      user_id: user._id,
    });

    return NextResponse.json(
      { message: "Generated Successfully.", generatedText },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
