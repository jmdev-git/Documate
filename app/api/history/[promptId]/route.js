import connectDB from "@/lib/mongodb";
import { Response } from "@/models/response";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { promptId } = await params;

    const promptHistory = await Response.findById(promptId);

    return NextResponse.json(
      { message: "Prompt history fetched successfully", promptHistory },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { promptId } = await params;

    const deletedPrompt = await Response.findByIdAndUpdate(
      promptId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(
      { message: "Deleted successfully", deletedPrompt },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
