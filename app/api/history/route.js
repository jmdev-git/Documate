import connectDB from "@/lib/mongodb";
import { Response } from "@/models/response";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const promptHistory = await Response.find({ user_id: objectUserId });

    return NextResponse.json(
      {
        message: "Prompt History fetched successfully",
        count: promptHistory.length,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
      },
      { status: 500 }
    );
  }
}
