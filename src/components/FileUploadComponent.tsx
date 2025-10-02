"use client";

import { Loader2Icon, Upload, User, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { extractResumeFromFile } from "@/lib/ai";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCandidate } from "@/store/candidateSlice";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fileToBase64 } from "@/lib/helper";
export function FileUploadComponent({
  onStartInterview,
}: {
  onStartInterview?: () => void;
}) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [showInfo, setShowInfo] = React.useState(false);
  const { candidates, currentId } = useAppSelector((state) => state.candidate);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  const handleFileProcessing = React.useCallback(
    async (file: File) => {
      try {
        setLoading(true);
        const base64Content = await fileToBase64(file);
        if (base64Content) {
          const resumeData = await extractResumeFromFile(
            base64Content,
            file.name,
            file.type
          );
          dispatch(
            addCandidate({
              ...resumeData,
            })
          );
          setLoading(false);
          setShowInfo(true);
          return resumeData;
        }
      } catch (error) {
        setLoading(false);
        console.error("Error processing file:", error);
      }
    },
    [dispatch, files]
  );
  React.useEffect(() => {
    if (files.length > 0) {
      handleFileProcessing(files[0]);
    }
  }, [files, handleFileProcessing]);

  return (
    <>
      <FileUpload
        value={files}
        onValueChange={setFiles}
        onFileReject={onFileReject}
        accept=".pdf,.doc,.docx"
        maxFiles={1}
        className="w-full"
        disabled={loading}
      >
        <>
          <FileUploadDropzone>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <Upload className="size-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Drag & drop files here</p>
              <p className="text-muted-foreground text-xs">
                Or click to browse
              </p>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2 w-fit">
                Browse files
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file, index) => (
              <FileUploadItem key={index} value={file} className="flex-col">
                <div className="flex w-full items-center gap-2">
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => {
                        setShowInfo(false);
                      }}
                      disabled={loading}
                    >
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </div>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </>
      </FileUpload>
      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Alert variant="default">
            <Loader2Icon className="h-4 w-4 animate-spin" />
            <AlertTitle>Processing your resume.</AlertTitle>
            <AlertDescription>
              This may take a few moments. Please wait...
            </AlertDescription>
          </Alert>
        </div>
      )}
      {showInfo && (
        <div className="mt-2 w-full flex justify-center">
          <Alert variant="default" className="max-w-md mt-2 w-full">
            <User />
            <AlertTitle>Your Information</AlertTitle>
            <AlertDescription>
              Name: {candidates[currentId]?.name || "Not found"}
              <br />
              Email: {candidates[currentId]?.email || "Not found"}
              <br />
              Phone: {candidates[currentId]?.phone || "Not found"}
              <br />
              <p className="text-xs">
                *Information which is not found will be collected by the bot!
              </p>
            </AlertDescription>
            <Button className="mt-2 min-w-sm" onClick={onStartInterview}>
              Start Interview
            </Button>
          </Alert>
        </div>
      )}
    </>
  );
}
