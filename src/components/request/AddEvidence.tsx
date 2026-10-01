"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UploadProgress } from "@/components/shared/UploadProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAddRequestAttachments } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { PhotoPicker } from "./PhotoPicker";

type Props = { requestId: string; remaining: number };

export function AddEvidence({ requestId, remaining }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const { mutate: upload, isPending } = useAddRequestAttachments();

  const submit = () => {
    const formData = new FormData();
    formData.append("type", "EVIDENCE");
    for (const file of files) formData.append("attachments", file);

    setProgress(0);
    upload(
      { id: requestId, formData, onProgress: setProgress },
      {
        onSuccess: () => {
          toast.success("Photos added");
          setFiles([]);
        },
        onError: (error) =>
          toast.error("Upload failed", {
            description: getApiErrorMessage(error),
          }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add more evidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <PhotoPicker
          files={files}
          onChange={setFiles}
          max={remaining}
          disabled={isPending}
        />
        {isPending && <UploadProgress percent={progress} />}
        <Button
          className="h-9 w-full gap-2"
          disabled={files.length === 0 || isPending}
          onClick={submit}
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="size-4" /> Upload {files.length || ""} photo
              {files.length === 1 ? "" : "s"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
