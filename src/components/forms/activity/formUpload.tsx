"use client";

import { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FromUploadProps {
  onSubmit: (file: File) => void;
}

const FromUpload: FC<FromUploadProps> = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const handleSubmitUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
    }
    setSelectedFile(null);
  };
  useEffect(() => {
    return () => {
      setSelectedFile(null);
    };
  }, []);
  return (
    <form onSubmit={handleSubmitUpload}>
      <div className="flex flex-col gap-1 my-5">
        <div
          {...getRootProps()}
          className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <p className="text-sm mt-2">Tập tin đã chọn: {selectedFile.name}</p>
          ) : (
            <>
              <img
                src="/upload.svg"
                width={40}
                height={40}
                loading="lazy"
                alt="upload"
              />
              <p className="text-sm">
                Kéo và thả một tập tin vào đây hoặc nhấp để chọn một tập tin
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default FromUpload;
