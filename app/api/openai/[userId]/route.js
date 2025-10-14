import connectDB from "@/lib/mongodb";
import { Response } from "@/models/response";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    const responseData = await Response.find({
      user_id: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Fetched ai response", responseData },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
