const videoElement = document.getElementById("video");
const button = document.getElementById("button");
let isSharing = false;
let mediaStream = null;

async function selectMediaStream() {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  } catch (error) {
    console.log(error);
  }
}

button.addEventListener("click", async () => {
  if (isSharing) {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }
    mediaStream.getTracks().forEach((track) => track.stop());
    button.innerText = "START";
    isSharing = false;
  } else {
    button.disabled = true;
    button.innerText = "LOADING";
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia();
      videoElement.srcObject = mediaStream;
      videoElement.onloadedmetadata = async () => {
        videoElement.play();
        await videoElement.requestPictureInPicture();
        isSharing = true;
      };

      button.disabled = false;
      button.innerText = "STOP";
    } catch (e) {
      button.disabled = false;
      button.innerText = "START";
      isSharing = false;
    }
  }
});
