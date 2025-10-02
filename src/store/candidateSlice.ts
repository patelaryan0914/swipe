import { Candidate, Interview, Message } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState: { candidates: Record<string, Candidate>; messages: Record<string, Message[]>; currentId: string, interviews: Record<string, Interview>, ongoingInterviewId: string | null, totalCandidates: number, totalInterviews: number } = {
    candidates: {},
    messages: {},
    currentId: "",
    interviews: {},
    ongoingInterviewId: null,
    totalCandidates: 0,
    totalInterviews: 0
};
function isValidField(value?: string | null): string | null {
    if (!value) return null;
    if (value.trim().toLowerCase() === "null") return null;
    return value;
}
export const candidateSlice = createSlice({
    name: "candidateDB",
    initialState,
    reducers: {
        addCandidate: (state, action) => {

            const id = uuidv4();

            const newCandidate: Candidate = {
                id,
                name: isValidField(action.payload.name),
                email: isValidField(action.payload.email),
                phone: isValidField(action.payload.phone),
                content: isValidField(action.payload.content),
                isProfileComplete: Boolean(
                    isValidField(action.payload.name) &&
                    isValidField(action.payload.email) &&
                    isValidField(action.payload.phone) &&
                    isValidField(action.payload.content)
                )
            };

            state.candidates[id] = newCandidate;
            state.messages[id] = [];
            state.currentId = id;
            state.totalCandidates += 1;
        },

        addMessage: (state, action) => {
            const { candidateId, role, content } = action.payload;
            const newMessage: Message = {
                id: uuidv4(),
                role,
                content,
                candidateId,
                interviewId: state.ongoingInterviewId!,
                timestamp: new Date().toISOString()
            };

            if (!state.messages[candidateId]) {
                state.messages[candidateId] = [];
            }
            state.messages[candidateId].push(newMessage);
        },

        startInterview: (state, action) => {
            const { candidateId } = action.payload;
            const uuid = uuidv4()
            state.interviews[uuid] = {
                id: uuid,
                candidateId,
                startedAt: new Date().toISOString(),
                status: "in-progress",
                questions: [],
                answers: [],
                currentQuestionIndex: 0,
                overAllScore: 0,
                overAllSummary: ""
            };
            state.ongoingInterviewId = uuid;
            state.totalInterviews += 1;
        },

        setCurrentId: (state, action) => {
            state.currentId = action.payload;
        },

        updateCandidateInfo: (state, action) => {
            if (state.candidates[state.currentId]) {
                state.candidates[state.currentId] = {
                    ...state.candidates[state.currentId],
                    name: isValidField(action.payload.name) ?? state.candidates[state.currentId].name,
                    email: isValidField(action.payload.email) ?? state.candidates[state.currentId].email,
                    phone: isValidField(action.payload.phone) ?? state.candidates[state.currentId].phone,
                    content: isValidField(action.payload.content) ?? state.candidates[state.currentId].content,
                    isProfileComplete: action.payload.isProfileComplete
                };
            }
        },

        addQuestion: (state, action) => {
            state.interviews[state.ongoingInterviewId!].questions.push(action.payload);
            state.interviews[state.ongoingInterviewId!].currentQuestionIndex += 1;
        },

        addAnswer: (state, action) => {
            state.interviews[state.ongoingInterviewId!].answers.push(action.payload);
        },

        startWithNewReumse: (state) => {
            state.currentId = ""
            state.ongoingInterviewId = null;

        },

        finishOngoingInterview: (state, actions) => {
            state.interviews[state.ongoingInterviewId!].overAllScore = actions.payload.overAllScore;
            state.interviews[state.ongoingInterviewId!].overAllSummary = actions.payload.overAllSummary;
            state.interviews[state.ongoingInterviewId!].status = "completed";
            state.ongoingInterviewId = null;
        }
    }
});

export const { addCandidate, setCurrentId, startInterview, addMessage, updateCandidateInfo, addQuestion, addAnswer, startWithNewReumse, finishOngoingInterview } = candidateSlice.actions;

export default candidateSlice.reducer;
