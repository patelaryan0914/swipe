export interface Candidate {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    content: string | null;
    isProfileComplete: boolean;
}

export interface Interview {
    id: string;
    candidateId: string;
    startedAt: string;
    status: 'completed' | 'in-progress';
    questions: Question[];
    answers: Answer[];
    currentQuestionIndex: number;
    overAllScore: number;
    overAllSummary: string;
}

export interface Message {
    id: string;
    interviewId?: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    responseTime?: number;
    candidateId: string;
}

export interface Question {
    id: string;
    text: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    timeLimit: number;
}

interface Answer {
    questionId: string;
    text: string;
    submittedAt: string;
    timeUsed: number;
}