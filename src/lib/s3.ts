import AWS from 'aws-sdk';

export async function UploadPage(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_83_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_83_BUCKET_NAME,
        region: 'ap-southeast-1',
      },
    });

    const fileKey = `uploads/${Date.now().toString()}${file.name.replace(' ', '-')}`;

    const fileBuffer = await file.arrayBuffer();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_83_BUCKET_NAME,
      Key: fileKey,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
    };

    const upload = s3.putObject(params).on('httpUploadProgress', evt => {
      console.log('uploading to s3...', parseInt((evt.loaded * 100 / evt.total).toString()) * 4);
    }).promise();

    await upload.then(data => {
      console.log('successfully uploaded to s3!', fileKey);
    });

    return Promise.resolve({
      fileKey: fileKey,
      file_name: file.name,
    });

  } catch (error) {
    // Handle error
    console.error(error);
    return Promise.reject(error);
  }
}

export function get83Url(fileKey: string) {
  const url = `http://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${fileKey}`;
  return url;
}
