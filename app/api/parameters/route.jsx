import connectDB from "@/lib/mongodb";
import { Parameter } from "@/models/parameter";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { parameter, email } = await req.json();

    const { content_type, citation_style, writing_style, tone } = parameter;

    const user = await User.findOne({ email });

    const param = await Parameter.create({
      content_type,
      citation_style,
      writing_style,
      tone,
      user_id: user._id,
    });

    const parameterCount = await Parameter.countDocuments({
      user_id: user._id,
    });

    return NextResponse.json(
      { message: "Parameters received", id: param._id, parameterCount },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

