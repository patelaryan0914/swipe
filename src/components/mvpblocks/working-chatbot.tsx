"use client";

import { Bot, Clock, CornerRightUp, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  aiGenerateQuestion,
  aiGenerateSummary,
  askForInformation,
} from "@/lib/ai";
import {
  addAnswer,
  addMessage,
  addQuestion,
  finishOngoingInterview,
  updateCandidateInfo,
} from "@/store/candidateSlice";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { Message } from "@/lib/types";

function AiInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 50,
    maxHeight: 200,
  });

  return (
    <div className="w-full">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-start gap-2">
        <div className="relative mx-auto w-full max-w-4xl">
          <Textarea
            ref={textareaRef}
            id="ai-input-06"
            placeholder="Ask me anything!"
            className={cn(
              "bg-muted/50 text-foreground ring-primary/20 placeholder:text-muted-foreground/70 w-full max-w-4xl resize-none rounded-3xl border-none py-4 pr-12 pl-6 leading-[1.2] text-wrap",
              "focus:ring-primary/30 min-h-[56px] transition-all duration-200 focus:ring-2"
            )}
            value={value}
            onKeyDown={onKeyDown}
            onChange={(e) => {
              onChange(e);
              adjustHeight();
            }}
            disabled={disabled}
          />
          <button
            onClick={onSubmit}
            className={cn(
              "bg-primary/10 hover:bg-primary/20 absolute top-1/2 right-3 -translate-y-1/2 rounded-xl p-2 transition-all duration-200",
              value.trim() ? "opacity-100" : "cursor-not-allowed opacity-50"
            )}
            type="button"
            disabled={!value.trim()}
          >
            <CornerRightUp
              className={cn(
                "text-primary h-4 w-4 transition-opacity",
                value ? "opacity-100" : "opacity-50"
              )}
            />
          </button>
        </div>
        <p className="text-muted-foreground ml-4 text-xs">
          {value.length}/2000 characters
        </p>
      </div>
    </div>
  );
}
function BotLoadingIndicator() {
  return (
    <div className="relative mb-4 flex rounded-xl bg-neutral-50 px-2 py-6 sm:px-4 dark:bg-neutral-900">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot className="text-primary mr-2 flex size-8 rounded-full p-1 sm:mr-4" />
      </motion.div>
      <div className="flex items-center gap-2">
        <motion.div
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
        <span className="text-muted-foreground ml-2 text-sm">
          Generating question...
        </span>
      </div>
    </div>
  );
}
export default function WorkingChatbot() {
  const [input, setInput] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [initialTime, setInitialTime] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { candidates, messages, currentId, interviews, ongoingInterviewId } =
    useAppSelector((state) => state.candidate);
  const displayMessages = messages[currentId].filter(
    (m) => m.candidateId === currentId && m.interviewId === ongoingInterviewId
  );
  const dispatch = useAppDispatch();
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [interviewResult, setInterviewResult] = useState<{
    overAllScore: number;
    overAllSummary: string;
  }>({ overAllScore: 0, overAllSummary: "" });
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, isGenerating]);
  useEffect(() => {
    if (isTimerActive && timeRemaining !== null && timeRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setIsTimerActive(false);
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerActive, timeRemaining]);

  const startTimer = (seconds: number) => {
    setInitialTime(seconds);
    setTimeRemaining(seconds);
    setIsTimerActive(true);
  };

  const stopTimer = (): number => {
    setIsTimerActive(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    // Calculate time used
    const timeUsed = initialTime - (timeRemaining || 0);
    return timeUsed;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle auto-submit when timer runs out
  const handleAutoSubmit = useCallback(async () => {
    const answerText = input.trim() || "No answer provided";
    const timeUsed = initialTime;

    toast.error("Time's up!", {
      description: "Your answer has been automatically submitted.",
    });

    setDisableInput(true);

    dispatch(
      addMessage({
        role: "user",
        content: answerText,
        candidateId: currentId,
      })
    );

    if (candidates[currentId].isProfileComplete) {
      // const evaluation = await aiEvaluateAnswer(
      //   interviews[ongoingInterviewId!].questions[
      //     interviews[ongoingInterviewId!].currentQuestionIndex - 1
      //   ],
      //   answerText,
      //   candidates[currentId]
      // );
      dispatch(
        addAnswer({
          questionId:
            interviews[ongoingInterviewId!].questions[
              interviews[ongoingInterviewId!].currentQuestionIndex - 1
            ].id,
          text: answerText,
          submittedAt: new Date().toISOString(),
          timeUsed: timeUsed,
        })
      );
      if (interviews[ongoingInterviewId!].currentQuestionIndex - 1 >= 5) {
        setDisableInput(true);
        const overallResult = await aiGenerateSummary(
          candidates[currentId],
          interviews[ongoingInterviewId!]
        );
        dispatch(finishOngoingInterview(overallResult));
        setInterviewResult({ ...interviewResult, ...overallResult });
        setShowResultDialog(true);
        toast.success("Your Interview is Finished");
        return;
      }
    }
    setIsGenerating(true);
    // Generate next question
    const generateQuestion = await aiGenerateQuestion(
      interviews[ongoingInterviewId!].questions.length,
      candidates[currentId],
      interviews[ongoingInterviewId!].questions
    );
    dispatch(addQuestion(generateQuestion));
    dispatch(
      addMessage({
        role: "bot",
        content: generateQuestion.text,
        candidateId: candidates[currentId].id,
      })
    );
    setIsGenerating(false);
    const timeLimit = generateQuestion.timeLimit || 300;
    startTimer(timeLimit);
    setInput("");
    setDisableInput(false);
  }, [
    input,
    candidates,
    currentId,
    interviews,
    ongoingInterviewId,
    dispatch,
    initialTime,
    timeRemaining,
    interviewResult,
  ]);
  useEffect(() => {
    if (timeRemaining === 0) {
      setIsTimerActive(false);
      handleAutoSubmit();
    }
  }, [timeRemaining]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;
      setDisableInput(true);

      const timeUsed = stopTimer();

      dispatch(
        addMessage({
          role: "user",
          content: input,
          candidateId: currentId,
        })
      );

      if (candidates[currentId].isProfileComplete) {
        // const evaluation = await aiEvaluateAnswer(
        //   interviews[ongoingInterviewId!].questions[
        //     interviews[ongoingInterviewId!].currentQuestionIndex - 1
        //   ],
        //   input,
        //   candidates[currentId]
        // );
        dispatch(
          addAnswer({
            questionId:
              interviews[ongoingInterviewId!].questions[
                interviews[ongoingInterviewId!].currentQuestionIndex - 1
              ].id,
            text: input,
            submittedAt: new Date().toISOString(),
            timeUsed: timeUsed,
          })
        );
        toast.success("Answer submitted!", {
          description: `Time taken: ${formatTime(timeUsed)}`,
        });
        if (interviews[ongoingInterviewId!].currentQuestionIndex - 1 >= 5) {
          setDisableInput(true);
          const overallResult = await aiGenerateSummary(
            candidates[currentId],
            interviews[ongoingInterviewId!]
          );
          setInterviewResult({ ...interviewResult, ...overallResult });
          setShowResultDialog(true);
          dispatch(finishOngoingInterview(overallResult));
          toast.success("Your Interview is Finished");
          return;
        }
      }

      if (!candidates[currentId].isProfileComplete) {
        const info = await askForInformation(candidates[currentId], input);
        dispatch(
          updateCandidateInfo({
            ...info,
          })
        );
        if (!info.isProfileComplete) {
          dispatch(
            addMessage({
              role: "bot",
              content: info.question || "Can you please provide your details?",
              candidateId: candidates[currentId].id,
            })
          );
          setInput("");
          setDisableInput(false);
          return;
        }
      }
      setIsGenerating(true);

      const generateQuestion = await aiGenerateQuestion(
        interviews[ongoingInterviewId!].questions.length,
        candidates[currentId],
        interviews[ongoingInterviewId!].questions
      );
      dispatch(addQuestion(generateQuestion));
      dispatch(
        addMessage({
          role: "bot",
          content: generateQuestion.text,
          candidateId: candidates[currentId].id,
        })
      );
      setIsGenerating(false);
      const timeLimit = generateQuestion.timeLimit || 300;
      startTimer(timeLimit);
      setInput("");
      setDisableInput(false);
    },
    [
      input,
      candidates,
      currentId,
      interviews,
      ongoingInterviewId,
      dispatch,
      initialTime,
      timeRemaining,
      interviewResult,
      stopTimer,
    ]
  );
  const askQuestion = async () => {
    setIsGenerating(true);
    const generateQuestion = await aiGenerateQuestion(
      interviews[ongoingInterviewId!].questions.length,
      candidates[currentId],
      interviews[ongoingInterviewId!].questions
    );
    dispatch(addQuestion(generateQuestion));
    dispatch(
      addMessage({
        role: "bot",
        content: generateQuestion.text,
        candidateId: candidates[currentId].id,
      })
    );
    setIsGenerating(false);
    const timeLimit = generateQuestion.timeLimit || 300;
    startTimer(timeLimit);
  };

  const askForInfo = async () => {
    setIsGenerating(true);

    const info = await askForInformation(candidates[currentId], "");
    dispatch(
      updateCandidateInfo({
        ...candidates[currentId],
        ...info,
      })
    );
    dispatch(
      addMessage({
        role: "bot",
        content: info.question || "Can you please provide your details?",
        candidateId: candidates[currentId].id,
      })
    );
    setIsGenerating(false);
  };

  const askedStateRef = useRef<"idle" | "info" | "question">("idle");

  useEffect(() => {
    if (askedStateRef.current !== "idle") return;

    if (
      !candidates[currentId].isProfileComplete &&
      messages[currentId].filter((m) => m.interviewId == ongoingInterviewId)
        .length === 0
    ) {
      askedStateRef.current = "info";
      askForInfo();
    } else if (
      messages[currentId].filter((m) => m.interviewId == ongoingInterviewId)
        .length === 0 ||
      interviews[ongoingInterviewId!].answers.length >=
        interviews[ongoingInterviewId!].questions.length
    ) {
      askedStateRef.current = "question";
      askQuestion();
    }
  }, [
    askForInfo,
    askQuestion,
    candidates,
    currentId,
    messages,
    ongoingInterviewId,
    interviews,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="mx-auto flex h-svh w-full max-w-4xl flex-col pb-0.5">
      <AlertDialog open={showResultDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-center">
              Interview Completed! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-4">
                {interviewResult && (
                  <>
                    <div className="rounded-lg bg-primary/10 p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Overall Score
                      </p>
                      <p className="text-5xl font-bold text-primary">
                        {interviewResult.overAllScore}
                        <span className="text-2xl">/100</span>
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <h4 className="font-semibold mb-2 text-foreground">
                        Summary
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {interviewResult.overAllSummary}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Link href={`interview-info/${ongoingInterviewId}`}>
            <Button className="w-full flex justify-center mt-2">
              Check Scores From Interview Info
            </Button>
          </Link>
        </AlertDialogContent>
      </AlertDialog>

      {!showResultDialog && (
        <>
          <div className="border-primary/20 bg-card/40 text-card-foreground h-full flex-1 overflow-y-auto rounded-xl border p-4 text-sm leading-6 shadow-md sm:text-base sm:leading-7">
            {displayMessages.length > 0 ? (
              <>
                {displayMessages.map((m: Message) => {
                  return (
                    <div key={m.id} className="mb-4 whitespace-pre-wrap">
                      {m.role === "user" ? (
                        <div className="flex flex-row px-2 py-4 sm:px-4">
                          <User className="text-primary mr-2 flex size-8 rounded-full p-1 sm:mr-4" />
                          <div className="flex max-w-3xl items-center">
                            <p>{m.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative mb-4 flex rounded-xl bg-neutral-50 px-2 py-6 sm:px-4 dark:bg-neutral-900">
                          <Bot className=" text-primary mr-2 flex size-8 rounded-full p-1 sm:mr-4" />
                          <div className="markdown-body w-full max-w-3xl overflow-x-auto rounded-xl">
                            <Markdown>{m.content}</Markdown>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {isGenerating && <BotLoadingIndicator />}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <motion.div
                  className="relative z-10 w-full max-w-2xl space-y-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="space-y-3 text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="inline-block"
                    >
                      <h1 className="pb-1 text-3xl font-medium tracking-tight">
                        Lets Start With the Interview!!
                      </h1>
                      <motion.div
                        className="via-primary/50 h-px bg-gradient-to-r from-transparent to-transparent"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </motion.div>
                    <motion.p
                      className="text-muted-foreground text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Question&apos;s will appear with the timer on the screen.
                    </motion.p>
                    <motion.p
                      className="text-muted-foreground text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      *Complete your profile first to get start!
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="mt-2">
            {isTimerActive && timeRemaining !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 flex items-center justify-center"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 shadow-sm transition-colors",
                    timeRemaining <= 30
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : timeRemaining <= 60
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      : "bg-green-500/10 text-green-600 dark:text-green-400"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <form className="mt-2" onSubmit={handleSubmit}>
            <div className="relative">
              <AiInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                disabled={disableInput}
              />
            </div>
          </form>
        </>
      )}
    </div>
  );
}
