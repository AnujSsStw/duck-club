"use client";

import { Button } from "@/components/ui/button";
import { JSX, SVGProps, useState } from "react";

export function DropZone() {
  const [files, setFiles] = useState<File[]>([]);
  const handleDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Files</h2>
        <p className="text-muted-foreground">
          Drag and drop files or click to select from your local file system.
        </p>
      </div>
      <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed border-primary transition-colors hover:border-primary-foreground focus-within:border-primary-foreground focus-within:ring-1 focus-within:ring-primary">
        <div className="text-center space-y-1">
          <CloudUploadIcon className="h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here or click to upload
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-md bg-muted px-4 py-2"
              >
                <div className="truncate">{file.name}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CloudUploadIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
