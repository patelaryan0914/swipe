"use server"
import { GoogleGenAI } from '@google/genai';
import { Candidate, Interview, Question } from './types';
import { v4 as uuidv4 } from 'uuid';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!;
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export async function extractResumeFromFile(
    base64Content: string,
    fileName: string,
    fileType: string
): Promise<{ content: string; name?: string; email?: string; phone?: string }> {
    const mimeType = fileType;

    const prompt = `
    Analyze this resume file (File name: ${fileName}, Type: ${fileType}). 
    1. Extract the full text content of the resume.
    2. Identify the candidate's full name, email, and phone number.
    Return only a valid JSON object strictly matching the schema.
  `;

    const requestPayload = {
        model: "gemini-2.5-flash",
        contents: [
            { role: 'user', parts: [{ text: prompt }] },
            { role: 'user', parts: [{ inlineData: { data: base64Content, mimeType: mimeType } }] }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    content: { type: "STRING", description: "The full text content of the resume." },
                    name: { type: "STRING", description: "Full name of the person, or null if not found." },
                    email: { type: "STRING", description: "Email address, or null if not found." },
                    phone: { type: "STRING", description: "Phone number, or null if not found." }
                },
                required: ["content", "name", "email", "phone"]
            }
        }
    };

    try {
        const response = await genAI.models.generateContent(requestPayload);

        if (!response.text) {
            throw new Error('Empty response from AI model');
        }
        const jsonText = JSON.parse(response.text);

        return {
            content: jsonText.content || '',
            name: jsonText.name ?? null,
            email: jsonText.email ?? null,
            phone: jsonText.phone ?? null,
        };
    } catch (error) {
        console.error('Error extracting resume from file:', error);
        throw new Error('Failed to process resume file with AI');
    }
}

export async function askForInformation(
    candidateInfo: Candidate,
    answer?: string,
): Promise<{ question: string | null, name?: string | null; email?: string | null; phone?: string | null, isProfileComplete?: boolean }> {

    const prompt = `The candidate Info is ${JSON.stringify(candidateInfo)}.
    Given the candidate's answer: "${answer}", determine if any essential information (name, email, phone) is missing.
    1. Ask questions to fill in any missing information (name, email, phone).
    2. If all information is present, confirm that no further information is needed.
    3. If you have all the Information, set isProfileComplete to true.
    4. Pass every details if you have in candidateInfo.
    Return only a valid JSON object strictly matching the schema.
  `;

    const requestPayload = {
        model: "gemini-2.5-flash",
        contents: [
            { role: 'model', parts: [{ text: prompt }] },
            { role: 'user', parts: [{ text: "What information do you need from the candidate?" }] }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The question to ask the candidate." },
                    name: { type: "STRING", description: "Full name of the person, or null if not found." },
                    email: { type: "STRING", description: "Email address, or null if not found." },
                    phone: { type: "STRING", description: "Phone number, or null if not found." },
                    isProfileComplete: { type: "BOOLEAN", description: "True if all the information is present, otherwise false." }
                },
                required: ["question", "name", "email", "phone", "isProfileComplete"]
            }
        }
    };

    try {
        const response = await genAI.models.generateContent(requestPayload);

        if (!response.text) {
            throw new Error('Empty response from AI model');
        }
        const jsonText = JSON.parse(response.text);

        return {
            question: jsonText.question || null,
            name: jsonText.name ?? null,
            email: jsonText.email ?? null,
            phone: jsonText.phone ?? null,
            isProfileComplete: jsonText.isProfileComplete ?? false,
        };
    } catch (error) {
        console.error('Error extracting resume from file:', error);
        throw new Error('Failed to process resume file with AI');
    }
}

export async function aiGenerateQuestion(index: number, candidateInfo: Candidate, previousQuestions: Question[]): Promise<Question> {

    let difficulty: "easy" | "medium" | "hard" = "easy";
    let timeLimit = 30;
    if (index < 2) { difficulty = "easy"; timeLimit = 20; }
    else if (index < 4) { difficulty = "medium"; timeLimit = 60; }
    else { difficulty = "hard"; timeLimit = 120; };

    const userQuery = `
      Generate a technical interview question for a Full Stack Developer position (React/Node.js).
      Difficulty: ${difficulty}. 
      Focus on React, Node.js, JavaScript, or full-stack concepts.
      The question should be specific, actionable, and suitable for a candidate named ${candidateInfo.name || 'Unknown'}.
      The expected time to answer is ${timeLimit} seconds.
      ${previousQuestions.length ? `Avoid generating questions similar to these: ${previousQuestions.map((q: Question) => q.text).join(', ')}` : ''}
      Return only a valid JSON object strictly matching the schema.
    `;

    const requestPayload = {
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: userQuery }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    text: { type: "STRING", description: "The complete question text." },
                    category: { type: "STRING", description: "Technical category (e.g., React, Node.js, Database, etc.)." }
                },
                required: ["text", "category"]
            }
        }
    };

    try {
        const questionData = await genAI.models.generateContent(requestPayload);

        if (!questionData.text) {
            throw new Error('No question text generated');
        }

        const jsonText = JSON.parse(questionData.text);
        return {
            id: uuidv4(),
            text: jsonText.text,
            difficulty,
            timeLimit,
            category: jsonText.category,
        };
    } catch (error) {
        console.error('AI Question Generation Failed:', error);
        throw new Error('AI Question Generation Failed:');
    }
}

export async function aiEvaluateAnswer(question: Question, answerText: string, candidate: Candidate): Promise<{ score: number; feedback: string }> {
    const userQuery = `
        Evaluate this interview answer for a Full Stack Developer role.
        
        Question: ${question.text} (Difficulty: ${question.difficulty}, Category: ${question.category})
        Candidate: ${candidate.name || 'Unknown'}
        Answer: ${answerText}
        
        Evaluation criteria:
        - Technical accuracy (40%)
        - Completeness (30%)
        - Clarity and communication (20%)
        - Problem-solving approach (10%)
        
        Scoring scale (0-100) based on difficulty:
        - Easy: 70-100: Excellent, 0-29: Poor
        - Medium: 60-100: Excellent, 0-19: Poor
        - Hard: 50-100: Excellent, 0-14: Poor
        
        Provide the final score and detailed feedback in the specified JSON format.
    `;

    const requestPayload = {
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: userQuery }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    score: { type: "NUMBER", description: "Final numerical score between 0 and 100." },
                    feedback: { type: "STRING", description: "Detailed feedback on the answer, including specific technical strengths and weaknesses." }
                },
                required: ["score", "feedback"]
            }
        }
    };

    try {
        const ansData = await genAI.models.generateContent(requestPayload);
        if (!ansData.text) {
            throw new Error('No question text generated');
        }
        const jsonText = JSON.parse(ansData.text);
        return {
            score: jsonText.score,
            feedback: jsonText.feedback
        };
    } catch (error) {
        console.error('AI Evaluation Failed:', error);
        throw new Error('AI Evaluation Failed:');
    }
}
export async function aiGenerateSummary(candidate: Candidate, interview: Interview): Promise<{ overAllScore: number; overAllSummary: string }> {
    const userQuery = `
        Generate a comprehensive interview summary for this candidate.
        Candidate: ${candidate.name} (${candidate.email})
        
        Questions and answers:
        ${interview.answers.map((answer, index) =>
        `Q${index + 1}: ${interview.questions[index]?.text || 'Unknown question'}
            Answer: ${answer.text}
            `).join('\n\n')}
        
        Provide a summary (2 paragraphs) including: Overall performance, technical strengths and weaknesses, areas for improvement and overall score out of 100.
        Provide the final score(overAllScore) and detailed feedback(overAllSummary) in the specified JSON format.   
    `;
    const requestPayload = {
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: userQuery }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    overAllScore: { type: "NUMBER", description: "Final numerical score between 0 and 100." },
                    overAllSummary: { type: "STRING", description: "Detailed feedback on the answer, including specific technical strengths and weaknesses." }
                },
                required: ["overAllScore", "overAllSummary"]
            }
        }
    };
    try {
        const ansData = await genAI.models.generateContent(requestPayload);
        if (!ansData.text) {
            throw new Error('No question text generated');
        }
        const jsonText = JSON.parse(ansData.text);

        return {
            overAllScore: jsonText.overAllScore,
            overAllSummary: jsonText.overAllSummary
        };
    } catch (error) {
        console.error('AI Evaluation Failed:', error);
        throw new Error('AI Evaluation Failed:');
    }
}