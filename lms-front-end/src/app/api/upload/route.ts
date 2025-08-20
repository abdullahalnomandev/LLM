import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (preferably use environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dzghsspe7",
  api_key: process.env.CLOUDINARY_API_KEY || "311451141827357",
  api_secret: process.env.CLOUDINARY_API_SECRET || "TE4QfJp3B-XCoORgNHD4ecw27rw",
});

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    
    // Get all files from the form data
    const files = formData.getAll('file') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedFiles: string[] = [];

    // Process each file
    for (const file of files) {
      if (file.size === 0) {
        continue; // Skip empty files
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "uploads"
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      uploadedFiles.push((result as any).secure_url);
    }

    return NextResponse.json({ 
      success: true,
      urls: uploadedFiles,
      count: uploadedFiles.length 
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload files",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
