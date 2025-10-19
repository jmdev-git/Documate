import connectDB from "@/lib/mongodb";
import { Document } from "@/models/document";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { documentId } = await params;

    const document = await Document.findById(documentId);

    return NextResponse.json(
      { message: "Document fetched successfully.", document },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
