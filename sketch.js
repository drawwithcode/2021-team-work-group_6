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
const alpha = 50;

let arr = [];
let expressionObjects = [];
let properties = [];
let currIntensity = [];
let currExp = [];
let prevExp = [];
let currX = [];
let blobs_creati = [];
let X;

let timeStamp = 0;

let expressions;
let expression = [];

let screen_1 = false;
let screen_2 = true;
let screen_3 = false;
let transition = false;
let blobCreati = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  frameRate(24);
  change = 0;

  expressions = {
    disgusted: {
      color: color(125, 223, 100, alpha),
      change: 0.004,
      offset: 0.03,
    },

    happy: {
      color: color(230, 13, 100, alpha),
      change: 0.03,
      offset: 0.1,
    },

    angry: {
      color: color(177, 15, 46, alpha),
      change: 0.08,
      offset: 0.9,
    },

    surprised: {
      color: color(255, 107, 46, alpha),
      change: 0.01,
      offset: 0.3,
    },

    sad: {
      color: color(77, 108, 250, alpha),
      change: 0.01,
      offset: 0.1,
    },

    fearful: {
      color: color(154, 72, 208, alpha),
      change: 0.04,
      offset: 0.3,
    },
    neutral: {
      color: color(89, 84, 87, alpha),
      change: 0.0,
      offset: 0.0,
    },
  };
  // expressions = Object.keys(colors);

  // expression = [
  //   {
  //     prevExp: "neutral",
  //     nextExp: "neutral",
  //   },
  //   {
  //     prevExp: "neutral",
  //     nextExp: "neutral",
  //   },
  // ];

  for (let j = 0; j < 2; j++) {
    blobs[j] = new Blob((j + 1) * (width / 3), height / 2);
    expression[j] = {
      prevExp: "neutral",
      nextExp: "neutral",
    };
    properties[j] = {
      prev: {
        color: color(89, 84, 87, alpha),
        change: 0,
        offset: 0,
      },
      curr: {
        color: color(89, 84, 87, alpha),
        change: 0,
        offset: 0,
      },
      next: {
        color: color(89, 84, 87, alpha),
        change: 0,
        offset: 0,
      },
    };
  }

  a0 = createVector(width / 2, height / 2);
  a1 = createVector(100, height / 2);
  a2 = createVector(width - 100, height / 2);
}

function draw() {
  if (screen_2) drawScreen2();
}

function drawScreen2() {
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
      blobs_creati.forEach((b, index) => {
        let rough = currIntensity[index] * 10;
        //  Intensity of central point (-2, 2) --> 0-100%
        let mappedI = map(sync, 0, 100, -2, 2);
        let mappedI_2 = map(sync, 0, 100, 1, -1);
        blobs[b].attracted(a0, mappedI);
        if (b == 0) blobs[b].attracted(a1, mappedI_2);
        else blobs[b].attracted(a2, mappedI_2);
        blobs[b].update();
        blobs[b].show(
          rough,
          properties[index].curr.color,
          properties[index].curr.change + change,
          properties[index].curr.offset,
          expression[index].nextExp
        );
      });

      //  Speed of change
      change += 0.03;

      let spacing = 30;

      // expressionObjects.forEach((ex, index) => {
      //   fill(colors[Object.key(ex[index])]);
      //   text("AAA" + e, X, height / 2 + spacing * (index + 30));
      //   console.log("e:", e);
      // });
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
    let maxi = max(arr[index]);
    //  For magico per espressione corrente in testa
    for (const e in d.expressions) {
      if (maxi == d.expressions[e]) {
        expression[index].prevExp = expression[index].nextExp;
        expression[index].nextExp = `${e}`;
        const prev = expression[index].prevExp;
        const next = expression[index].nextExp;

        //  Fix: neutrale per troppo tempo
        if (next == "neutral") currIntensity[index] = 0.1;
        else currIntensity[index] = `${d.expressions[e]}`;
        //  Assegno colore di expression attuale
        //  Posizione X di blob
        currX[index] = d.detection._box._x;
        if (currX[index] < 200) {
          X = currX[index];
          blobs_creati[index] = 1;
        } else blobs_creati[index] = 0;

        //  Transizione fluida tra stati
        if (prev != next) {
          console.log("TRANSITION");
          transition = true;
          timeStamp = Date.now();
          properties[index].prev = expressions[prev];
          properties[index].next = expressions[next];
        }

        if (transition) {
          properties[index].curr = propertiesTransitions(
            properties[index].prev,
            properties[index].next,
            timeStamp
          );
        } else if (!transition) {
          properties[index].curr.color = expressions[next].color;
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
    // console.log("sync:", sync + "%");
  }
}

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

function propertiesTransitions(o1, o2, lastTimestamp) {
  const now = Date.now();
  const interval = 1000;
  const amt = (now - lastTimestamp) / interval;
  console.log("amt:", amt);

  const c1 = o1.color;
  console.log("c1:", c1);
  const c2 = o2.color;
  console.log("c2:", c2);

  // let amt = 0; // da 0 a 1
  const lerped_color = lerpColor(c1, c2, amt);
  const lerped_change = lerp(o1.change, o2.change, amt);
  const lerped_offset = lerp(o1.offset, o2.offset, amt);
  console.log("lerped_color:", lerped_color);

  const obj = {
    color: lerped_color,
    change: lerped_change,
    offset: lerped_offset,
  };

  if (amt >= 1) transition = false;

  return obj;
}
