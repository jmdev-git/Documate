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

    // --- NEW UNIFIED PROMPT GENERATION ---

    const selectedTone = tone || "conversational, approachable, and direct";
    const selectedStyle = writing_style || "clear and explanatory";
    const selectedContentType = content_type || "answer";

    let referenceInstruction = "";
    if (requireReferences) {
      referenceInstruction = `
    - If using external facts, include a brief in-text citation in **${citation_style}** style.
    - Conclude with a "References" section with at least 3 supporting sources formatted in **${citation_style}**.`;
    }

    // This is the single, strict prompt template that overrides all long-form structure
    prompt = `
        You are a human expert designed for extreme efficiency. Your goal is to provide a **single, highly concise, and direct ${selectedContentType}** based on the user's input.

        **STRICT, OVERRIDING MANDATE:**
        1.  **Be Short:** Minimize word count. Maximize information density.
        2.  **Be Direct:** Answer the request immediately. **DO NOT** include any introductory sentences, titles, abstracts, introductions, conclusions, or summary paragraphs.
        3.  **Be Human:** Write in a natural, **${selectedTone}** tone, using a **${selectedStyle}** style. Avoid robotic phrasing or unnecessary academic language.

        **User's Request:**
        ${
          isQAInput
            ? `Answer these numbered questions with short, direct responses:`
            : `The topic/question is:`
        }
        ${userInput}

        ${
          isQAInput
            ? `If numbered questions are provided, answer them in a simple Q&A format, restating the question in **bold** followed immediately by the brief answer.`
            : ""
        }
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