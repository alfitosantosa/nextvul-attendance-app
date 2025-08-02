export const uploadPhoto = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${process.env.PUBLIC_FILESERVER_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload photo");
    }

    const data = await response.json();
    return data.photoUrl; // Assuming the API returns the URL of the uploaded photo
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};
