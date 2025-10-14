import connectDB from "@/lib/mongodb";
import { Parameter } from "@/models/parameter";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { parameterId } = await params;
    const parameter = await Parameter.findById(parameterId);

    return NextResponse.json(
      { message: "Parameter fetch succesfully.", parameters: parameter },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
