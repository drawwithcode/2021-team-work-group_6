// organic is used to store the list of instances of Organic objects that we will create
let blobs = [];
// Daniel Shiffman
// http://codingtra.in
// Attraction / Repulsion
// Video: https://youtu.be/OAcXnzRNiCY
let a0;
let a1;
let a2;

let sync = 0;
// The variable change stores the rate of rotation and the y coordinate for noise later
let change, colors;
let alpha = 50;

let arr = [];
let expressionObjects = [];
let nextColors = [];
let prevColors = [];
let currColors = [];
let currIntensity = [];
let currExp = [];
let prevExp = [];
let currX = [];
let blobs_creati = [];
let X;

let timeStamp = 0;

let expressions;

let transition = false;
let blobCreati = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  // noLoop();
  frameRate(30);
  change = 0;
  prevExp = ["neutral", "neutral"];
  currExp = ["neutral", "neutral"];
  prevColors = [color(89, 84, 87, alpha), color(65, 91, 82, alpha)];
  currColors = [color(89, 84, 87, alpha), color(65, 91, 82, alpha)];
  nextColors = [color(89, 84, 87, alpha), color(65, 91, 82, alpha)];
  colors = {
    happy: color(230, 13, 100, alpha),
    sad: color(77, 108, 250, alpha),
    angry: color(177, 15, 46, alpha),
    fearful: color(154, 72, 208, alpha),
    disgusted: color(125, 223, 100, alpha),
    surprised: color(255, 107, 46, alpha),
    neutral: color(89, 84, 87, alpha),
  };
  expressions = Object.keys(colors);
  for (let j = 0; j < 2; j++) {
    blobs[j] = new Blob((j + 1) * (width / 3), height / 2);
  }

  a0 = createVector(width / 2, height / 2);
  a1 = createVector(100, height / 2);
  a2 = createVector(width - 100, height / 2);
}

function draw() {
  background("black");
  strokeWeight(4);
  stroke(0, 255, 0);
  point(a0.x, a0.y);
  point(a1.x, a1.y);
  point(a2.x, a2.y);
  if (detections) {
    textSize(20);
    noStroke();
    text("Faces detected: " + detections.length, 100, 100);
    if (detections.length > 0) {
      getFaceElements();
      // for (let i = 0; i < detections.length; i++) {
      //   let rough = currIntensity[i] * 10;
      //   //  Intensity of central point (-2, 2) --> 0-100%
      //   let mappedI = map(sync, 0, 100, -2, 2);
      //   blobs[i].attracted(a0, mappedI);
      //   if (i == 0) blobs[i].attracted(a1, 1);
      //   else blobs[i].attracted(a2, 1);
      //   blobs[i].update();
      //   blobs[i].show(rough, nextColors[i], currExp[i]);
      // }

      blobs_creati.forEach((b, index) => {
        let rough = currIntensity[index] * 10;
        //  Intensity of central point (-2, 2) --> 0-100%
        let mappedI = map(sync, 0, 100, -2, 2);
        let mappedI_2 = map(sync, 0, 100, 0, 1);
        blobs[b].attracted(a0, mappedI);
        if (b == 0) blobs[b].attracted(a1, mappedI_2);
        else blobs[b].attracted(a2, mappedI_2);
        blobs[b].update();
        blobs[b].show(rough, currColors[index], currExp[index]);
      });

      //  Speed of change
      change += 0.03;

      let spacing = 30;

      //   arr.forEach((ex, index) => {
      //     ex.forEach((e, index) => {
      //       text("AAA" + e, X, height / 2 + spacing * (index + 30));
      //       console.log("e:", e);
      //     });
      //   });
    }
    if (detections.length == 2)
      text("Syinc rate: " + sync + "%", width / 2, 100);
    else text("Not enough faces!", width / 2, 100);
  }
}

function getFaceElements() {
  //  Per ogni faccia rilevata
  blobs_creati = [];
  detections.forEach((d, index) => {
    expressionObjects[index] = d.expressions;
    arr[index] = Object.values(d.expressions);
    // console.log("d.expressions:", d.expressions);
    let maxi = max(arr[index]);
    // console.log("maxi:", maxi);
    //  For magico per espressione corrente in testa
    for (const e in d.expressions) {
      if (maxi == d.expressions[e]) {
        prevExp[index] = currExp[index];
        currExp[index] = `${e}`;

        //  Fix: neutrale per troppo tempo
        //  Transizione fluida tra stati
        if (currExp[index] == "neutral") currIntensity[index] = 0.1;
        else currIntensity[index] = `${d.expressions[e]}`;
        //  Assegno colore di expression attuale
        //  Posizione X di blob
        currX[index] = d.detection._box._x;
        if (currX[index] < 200) {
          X = currX[index];
          blobs_creati[index] = 1;
        } else blobs_creati[index] = 0;

        if (prevExp[index] != currExp[index] && !transition) {
          console.log("TRANSITION");
          transition = true;
          timeStamp = Date.now();
          nextColors[index] = colors[currExp[index]];
          prevColors[index] = colors[prevExp[index]];

          console.log("Da Precedente:", prevExp[index]);
          console.log("a Corrente:", currExp[index]);
        }
        if (transition) {
          currColors[index] = colorTransition(
            prevColors[index],
            nextColors[index],
            timeStamp
          );
        } else if (!transition) {
          currColors[index] = nextColors[index];
        }
      }
    }

    // //  Per posizione dei punti della faccia
    // d.landmarks._positions.forEach((p) => {
    //   // let mappedX = map(p._x, 0, 640, 0, width);
    //   // let mappedY = map(p._y, 0, 480, 0, height);
    //   // point(p._x, p._y);
    // });
  });
  if (detections.length == 2) {
    sync = shallowEquity(expressionObjects);
    console.log("sync:", sync + "%");
  }
}

//  Sync in base a pesi di emozioni!!
// function getSync(cE) {
//   if (cE[0] == cE[1]) return 100;
//   else return 0;
// }

//  shallowEquity tra i due oggetti--> Misurare Delta per ogni espressione--> Sottrarre Delta da TOT--> Mapparlo al 100%
function shallowEquity(objects) {
  const keys = Object.keys(objects[0]);
  let diff = 0;
  for (let key of keys) {
    diff += abs(objects[0][key] - objects[1][key]);
  }

  let perc = map(diff, 0, 2, 100, 0);
  return round(perc);
}

function colorTransition(c1, c2, lastTimestamp) {
  console.log("c2:", c2);
  console.log("c1:", c1);
  const now = Date.now();
  const interval = 1000;
  const amt = (now - lastTimestamp) / interval;
  console.log("lastTimestamp:", lastTimestamp);
  console.log("amt:", amt);
  // let amt = 0; // da 0 a 1
  const lerped = lerpColor(c1, c2, amt);

  if (amt >= 1) transition = false;

  return lerped;
}
