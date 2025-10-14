import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exist." },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Registration successfully.", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create an account: ", error },
      { status: 500 }
    );
  }
}
