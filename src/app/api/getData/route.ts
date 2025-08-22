import { database } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(){
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