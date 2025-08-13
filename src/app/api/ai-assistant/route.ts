/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey || geminiApiKey === "") {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(geminiApiKey)

const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    tools: [{
        codeExecution: {}
    }]
})

export async function POST(request: NextRequest) {

    try {
        const input = await request.json();
        const prompt = input.prompt || "What's the different between you and Claude?";

        const response = await geminiModel.generateContent(prompt)

        if (!response) {
            return NextResponse.json({ message: "No response from Gemini model" }, { status: 500 });
        }

        return NextResponse.json(response);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }


}