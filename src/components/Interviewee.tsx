import React, { useEffect, useState } from "react";
import { FileUploadComponent } from "./FileUploadComponent";
import WorkingChatbot from "./mvpblocks/working-chatbot";
import {
  setCurrentId,
  startInterview,
  startWithNewReumse,
} from "@/store/candidateSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Interviewee() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useAppDispatch();
  const { currentId, ongoingInterviewId, interviews } = useAppSelector(
    (state) => state.candidate
  );

  useEffect(() => {
    if (ongoingInterviewId && !showChatbot) {
      setShowDialog(true);
    }
  }, [ongoingInterviewId, showChatbot]);

  const handleContinue = () => {
    setShowChatbot(true);
    setShowDialog(false);
    dispatch(setCurrentId(interviews[ongoingInterviewId!].candidateId));
  };

  const handleStartNew = () => {
    setShowChatbot(false);
    setShowDialog(false);
    dispatch(startInterview({ candidateId: currentId }));
    setShowChatbot(true);
  };

  const cancel = () => {
    setShowChatbot(false);
    setShowDialog(false);
    dispatch(startWithNewReumse());
  };

  return (
    <div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an ongoing interview. Would you like to continue it or
              start a new one?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStartNew}>
              Start New
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>
              Resume Interview
            </AlertDialogAction>
            <AlertDialogAction onClick={cancel}>Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {!showChatbot && !showDialog && (
        <>
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Start By Uploading Your Resume!
            </h1>
          </div>
          <FileUploadComponent
            onStartInterview={() => {
              setShowChatbot(true);
              dispatch(startInterview({ candidateId: currentId }));
            }}
          />
        </>
      )}
      {showChatbot && <WorkingChatbot />}
    </div>
  );
}
