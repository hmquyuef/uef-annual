"use client";

import { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FromUploadProps {
  onSubmit: (fileParticipant: File, fileAttackment: File) => void;
}

const FromUpload: FC<FromUploadProps> = ({ onSubmit }) => {
  const [selectedFileParticipant, setSelectedFileParticipant] =
    useState<File | null>(null);
  const [selectedFileAttackment, setSelectedFileAttackment] =
    useState<File | null>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFileParticipant(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const handleSubmitUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedFileParticipant && selectedFileAttackment) {
      onSubmit(selectedFileParticipant, selectedFileAttackment);
    }
    setSelectedFileParticipant(null);
    setSelectedFileAttackment(null);
  };
  useEffect(() => {
    setSelectedFileParticipant(null);
    setSelectedFileAttackment(null);
  }, []);
  return (
    <form onSubmit={handleSubmitUpload}>
      <hr className="mt-1 mb-2" />
      <div className="flex flex-col gap-1 mb-4">
        <span className="font-medium text-neutral-600">
          Danh sách nhân sự tham gia
        </span>
        <div
          {...getRootProps()}
          className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
        >
          <input {...getInputProps()} />
          {selectedFileParticipant ? (
            <p className="text-sm mt-2">
              Tập tin đã chọn: {selectedFileParticipant.name}
            </p>
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
      <div className="flex flex-col gap-1 mb-4">
        <span className="font-medium text-neutral-600">Tài liệu đính kèm</span>
        <div
          {...getRootProps()}
          className="w-full min-h-20 h-fit border-2 border-dashed border-neutral-300 cursor-pointer flex justify-center items-center gap-3 rounded-xl"
        >
          <input {...getInputProps()} />
          {selectedFileAttackment ? (
            <p className="text-sm mt-2">
              Tập tin đã chọn: {selectedFileAttackment.name}
            </p>
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
