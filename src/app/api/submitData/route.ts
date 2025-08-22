import { database } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const db = await database()
        const { name1, name2, result } = await req.json()
        if (!name1 || !name2 || !result) {
            return new NextResponse("Missing data", { status: 400 });
        }
        const collection = await db.collection('flames')
        await collection.insertOne({
            name1,
            name2,
            result,
            createdAt: new Date(),
        })
        return new NextResponse("Data submitted successfully", { status: 200 });
    } catch (error) {
        console.error("Error submitting data:", error)
        return new NextResponse("Internal Server Error")
    }
}