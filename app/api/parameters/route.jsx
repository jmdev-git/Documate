import connectDB from "@/lib/mongodb";
import { Parameter } from "@/models/parameter";
import { User } from "@/models/user";
import mongoose from "mongoose";
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

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const parameter = await Parameter.find({ user_id: objectUserId });

    return NextResponse.json(
      {
        message: "Parameter(s) count fetched successfully.",
        count: parameter.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
