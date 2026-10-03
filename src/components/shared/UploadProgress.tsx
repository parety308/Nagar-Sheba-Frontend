export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className="space-y-1">
      <progress
        value={percent}
        max={100}
        className="h-1.5 w-full accent-primary"
      />
      <p className="text-xs text-muted-foreground">
        {percent < 100 ? `Uploading ${percent}%` : "Processing..."}
      </p>
    </div>
  );
}
