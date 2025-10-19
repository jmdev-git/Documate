import connectDB from "@/lib/mongodb";
import { Document } from "@/models/document";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { generatedText, email } = await req.json();

    const user = await User.findOne({ email });

    const document = await Document.create({
      content: generatedText,
      user_id: user._id,
    });

    return NextResponse.json(
      { message: "Document inserted successfully.", document },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
