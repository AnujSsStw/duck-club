export async function uploadImages(
  data: { pictures: FileList | undefined },
  generateUploadUrl: () => Promise<string>
) {
  let successfulImageIds;
  if (data.pictures !== undefined) {
    const imageIds = await Promise.all(
      Array.from(data.pictures).map(async (selectedImage) => {
        try {
          const postUrl = await generateUploadUrl();

          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": selectedImage.type },
            body: selectedImage,
          });

          if (!result.ok) {
            throw new Error(`Failed to upload file: ${selectedImage.name}`);
          }

          const { storageId } = await result.json();
          return storageId; // Return the storage ID to collect it
        } catch (error) {
          console.error(`Error uploading ${selectedImage.name}:`, error);
          return null; // Optionally return null or handle the error
        }
      })
    );

    // Filter out any null values (in case of errors)
    successfulImageIds = imageIds.filter((id) => id !== null);
  }
  return successfulImageIds;
}
