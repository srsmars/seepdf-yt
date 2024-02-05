// FileUploadClient.tsx

import { useCallback } from 'react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import AWS from 'aws-sdk';

const FileUploadClient = () => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    setUploading(true);

    try {
      const file = acceptedFiles[0];

      AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_83_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
      });

      const s3 = new AWS.S3();
      const fileKey = `uploads/${Date.now().toString()}${file.name.replace(' ', '-')}`;

      const fileBuffer = await file.arrayBuffer();
      const params = {
        Bucket: process.env.NEXT_PUBLIC_83_BUCKET_NAME,
        Key: fileKey,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
      };

      const upload = s3.putObject(params).on('httpUploadProgress', (evt) => {
        console.log(`Uploading to S3: ${parseInt((evt.loaded * 100 / evt.total).toString())}%`);
      }).promise();

      await upload;

      console.log('Successfully uploaded to S3!');
    } catch (error) {
      console.error('Error uploading to S3:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf',
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="p-2 bg-white rounded-xl">
      <input {...getInputProps()} />
      {uploading ? (
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
  );
};

export default FileUploadClient;