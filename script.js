// Tutorial: https://www.youtube.com/watch?v=CVClHLwv-4I&t=183s&ab_channel=WebDevSimplified

const video = document.getElementById("video");
const URL_MODELS = "/models";

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(URL_MODELS),
  faceapi.nets.faceLandmark68Net.loadFromUri(URL_MODELS),
  faceapi.nets.faceRecognitionNet.loadFromUri(URL_MODELS),
  faceapi.nets.faceExpressionNet.loadFromUri(URL_MODELS),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    {
      video: {},
    },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

let detections;
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const displaySize = { width: windowWidth, height: windowHeight };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    detections = await faceapi
      .detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416 })
      )
      .withFaceExpressions();
    // console.log("detections:", detections);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }, 1000);
});
