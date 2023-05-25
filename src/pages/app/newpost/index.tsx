import { useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { FiX } from "react-icons/fi";
import AppLayout from "~/pages/app/AppLayout";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/router";

export default function NewPost(): JSX.Element {

  const user = useUser();
  const router = useRouter();


  const { mutateAsync: fetchPresignedUrl } = api.s3.getStandardUploadPresignedUrl.useMutation();
  const { mutateAsync: createPost } = api.posts.create.useMutation();




  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [caption, setCaption] = useState<string>("");

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageSelection = (files: File[]) => {
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageDeletion = (image: File) => {
    setSelectedImages(selectedImages.filter((selectedImage) => selectedImage !== image));
  };

  const dropzoneOptions: DropzoneOptions = {
    onDropAccepted: handleImageSelection,
  };

  const handlePost = async () => {
    //if there are no images, return
    if (selectedImages.length === 0&&caption.length===0) {
      return
    }

    setIsUploading(true)

    const uploadPromises: Promise<void>[] = [];
    const uploadedImageUrls: string[] = [];
    const uploadedKeys: string[] = [];

    for (const file of selectedImages) {
      const presignedUrlResponse = await fetchPresignedUrl({ key: file.name });


      if (presignedUrlResponse) {
        const presignedUrl = presignedUrlResponse.url;


        uploadPromises.push(
          axios
            .put(presignedUrl, file)
            .then(() => {
              console.log(
                `Successfully uploaded file ${file.name} to ${presignedUrl}`
              )
              if (presignedUrlResponse.url) {
                uploadedImageUrls.push(presignedUrlResponse.url);
                uploadedKeys.push(presignedUrlResponse.key);
              }
            })
            .catch((error) => {
              console.error(`Error uploading file ${file.name}: ${error}`);
            })
        );
      }
    }



    await Promise.all(uploadPromises);

    // Here, you can handle the uploaded image URLs and other post data

    await createPost({
      caption: caption,
      images: uploadedKeys,
    });

    router.push("/app");

    // Reset state after successful upload
    setSelectedImages([]);
    setCaption("");
  };

  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <AppLayout>

      <div
      className="
      w-full
      min-h-screen
      flex
      flex-col
      items-center
      justify-center

      "
      >
        <div className="md:w-1/3 min-h-screen md:min-h-fit md:w-1/2 md:m-4 flex flex-col pt-40 md:p-4 items-center md:justify-center md:rounded-md md:border border-neutral-800 bg-zinc-800/30 gap-4 p-5">

          <h1 className="text-2xl font-semibold">New Post</h1>
          <div className="w-full">
            <div
              {...getRootProps({
                className: "w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md",
              })}
            >
              <input {...getInputProps()} />
              <p className="text-gray-400">Drag and drop images here or click to select images.</p>
            </div>
            <div className="flex flex-wrap">
              {selectedImages.map((image) => (
                <div key={image.name} className="relative w-1/4 mx-2 my-4">
                  <button
                    onClick={() => handleImageDeletion(image)}
                    className="absolute top-0 left-0 z-10 p-2 m-2 text-white rounded-full hover:bg-gray-800"
                  >
                    <FiX />
                  </button>
                  <img src={URL.createObjectURL(image)} className="w-full h-40 object-cover rounded-md" />
                </div>
              ))}
            </div>
          </div>
          <input type={"text"} placeholder={"Caption"} value={caption} onChange={(e) => setCaption(e.target.value)}
                 className="w-full rounded-md border border-2 text-black px-2 p-1"/>
          <button className="px-4 py-2 text-white bg-blue-500 rounded-md" onClick={handlePost} disabled={isUploading}>
            {isUploading ? (
              <div className="flex items-center">
                <span className="mr-2">Uploading...</span>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : (
              "Post"
            )}
          </button>
        </div>

      </div>
       </AppLayout>
  );
}
