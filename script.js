// Tutorial: https://www.youtube.com/watch?v=CVClHLwv-4I&t=183s&ab_channel=WebDevSimplified

const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
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

// startVideo();
let detections;
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  // document.body.append(canvas);
  const displaySize = { width: windowWidth, height: windowHeight };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    // detections = await faceapi
    //   .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    //   .withFaceLandmarks()
    //   .withFaceExpressions();
    console.log("detections:", detections);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    // const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // detections.faceExpressionPrediction.expression
  }, 50);
});
