"use client";

import { Inbox, Loader } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
  const router = useRouter();
  
  const [uploading, setUploading] = useState(false);
  const { mutate, isLoading } = useMutation(async (file_key: string, file_name: string) => {
    const response = await axios.post("/api/create-chat", { file_key, file_name });
    return response.data;
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf',
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("file too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("something went wrong");
          return;
        }
        mutate(data {
          onSuccess: (h) => {
            console.log(chat_id);{
              toast.success("chat created!");
              router.push('/chat/${chat_id}')
            }
            
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className: 'border-ash border-2 rounded-xl cursor-pointer bg-gyre-30 py-8 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
        {(uploading || isLoading) ? (
          <>
            <Loader className="h-10 w-10 text-blue-500 animate-ping" />
            <p className="mt-2 text-sm text-slate-400">Spilling Tea to S3</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;