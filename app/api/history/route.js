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

    const monthlyData = await Response.aggregate([
      { $match: { user_id: objectUserId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formatted = monthlyData.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1],
      count: item.count,
    }));

    return NextResponse.json(
      {
        message: "Prompt History fetched successfully",
        count: promptHistory.length,
        formatted,
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
