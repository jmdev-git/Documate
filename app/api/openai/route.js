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

    if (
      writing_style &&
      ["analytical", "critical review", "expository"].includes(
        writing_style.toLowerCase()
      )
    ) {
      if (isQAInput) {
        prompt = `Write a ${content_type} that answers the following questions:

      ${userInput}

      Use a ${tone || "academic"} style.  
      Provide the response strictly in a Q&A format:
      - Restate each question in **bold** (keep numbering).
      - Give clear, direct answers under each question.  
      ${
        requireReferences
          ? `- Use proper in-text citations in ${citation_style} style.\n- End with a "References" section with at least 3 credible sources formatted in ${citation_style}.`
          : ""
      }
      Do not add a title, abstract, or introduction — only the Q&A${
        requireReferences ? " and references" : ""
      }.`;
      } else {
        prompt = `Write a ${content_type} essay about "${userInput}".  

      Use a ${tone || "academic"} style.  
      - Organize the essay into sections with **bold headings** for each main point.  
      - Provide a clear, logical flow (introduction, body, conclusion).  
      ${
        requireReferences
          ? `- Use in-text citations in ${citation_style} style.\n- Include a "References" section with at least 3 credible sources formatted in ${citation_style}.`
          : ""
      }`;
      }
    } else if (
      writing_style &&
      [
        "narrative",
        "descriptive",
        "reflective",
        "comparative",
        "persuasive",
      ].includes(writing_style.toLowerCase())
    ) {
      if (isQAInput) {
        prompt = `Answer the following in a natural, human-like way:

      ${userInput}

      Format:
      - Restate each question in **bold** (keep numbering).  
      - Give your answer in the first person ("I"), sounding authentic.  
      ${
        requireReferences
          ? `- If you mention sources, cite briefly in ${citation_style} style.\n- At the end, add a "References" section with at least 2 supporting sources.`
          : ""
      }
      Respond only with the questions and answers${
        requireReferences ? " and references" : ""
      }.  
      Tone: ${tone || "authentic, conversational"}.`;
      } else {
        prompt = `Write a ${content_type} in a ${writing_style} style on "${userInput}".  

      Deliver it in a ${tone || "natural"} tone, human-like and engaging.  
      Use **bold subheadings** for clarity.  
      ${
        requireReferences
          ? `If references are used, cite them in ${citation_style} style.\nEnd with at least 2 references.`
          : ""
      }`;
      }
    } else {
      if (isQAInput) {
        prompt = `Write a ${content_type} based on the following questions:

      ${userInput}

      Provide the response in a Q&A format:
      - Restate each question in **bold** (keep numbering).  
      - Answer each directly and clearly.  
      ${
        requireReferences
          ? `- Use proper in-text citations in ${citation_style} style.\n- End with a "References" section containing at least 3 credible sources formatted in ${citation_style}.`
          : ""
      }
      Keep it ${tone || "clear and humanized"}.`;
      } else {
        prompt = `Write a ${content_type} essay based on: "${userInput}".  

      Keep the delivery ${tone || "clear and human-like"}.  
      Structure into paragraphs with **bold section headings**.  
      ${
        requireReferences
          ? `Include in-text citations in ${citation_style} style.\nEnd with at least 3 references formatted in ${citation_style}.`
          : ""
      }`;
      }
    }

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
