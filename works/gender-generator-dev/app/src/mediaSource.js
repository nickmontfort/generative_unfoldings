export async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
      },
    });
    const video = document.createElement("video");
    // TODO: Reject on timeout
    await new Promise((resolve, reject) => {
      video.addEventListener("loadedmetadata", async () => {
        await video.play();
        resolve();
      });
      video.srcObject = stream;
    });

    return video;
  } catch (error) {
    console.error("Cannot access a webcam: ", error);
    // Re-raise the error
    throw error;
  }
}
