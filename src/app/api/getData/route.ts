import { database } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    const authHeader = req.headers.get('authorization');
    if (authHeader !== process.env.NEXT_PUBLIC_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const db = await database();
        const collection = await db.collection('flames');
        const data = await collection.find({}).toArray();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }

}