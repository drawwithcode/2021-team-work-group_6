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
let change = [0, 0];
const alpha = 70;

let bg_color = 0;

let expressionObjects = [];
let properties = [];
let currIntensity = [];
let currX = [];
let blobs_creati = [];
let exp_perc = {};

let timeStamp = 0;

let expressions;
let expression = [];

let blob_distance = 1;

let screen_1 = false;
let screen_2 = true;
let screen_3 = false;
let transition = false;
let blobCreati = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bg_color);
  frameRate(24);
  textStyle(NORMAL);
  textFont("lores-12");

  textStyle(NORMAL);
  textFont("lores-12");

  expressions = {
    disgusted: {
      color: color(125, 223, 100),
      changeIncrement: 0.004,
      offset: 0.03,
    },
    happy: {
      color: color(230, 13, 100),
      changeIncrement: 0.03,
      offset: 0.1,
    },
    angry: {
      color: color(177, 15, 46),
      changeIncrement: 0.08,
      offset: 0.9,
    },
    surprised: {
      color: color(255, 107, 46),
      changeIncrement: 0.01,
      offset: 0.3,
    },
    sad: {
      color: color(77, 108, 250),
      changeIncrement: 0.01,
      offset: 0.1,
    },
    fearful: {
      color: color(154, 72, 208),
      changeIncrement: 0.04,
      offset: 0.3,
    },
    neutral: {
      color: color(89, 84, 87),
      changeIncrement: 0.01,
      offset: 0.001,
    },
  };
  // expressions = Object.keys(colors);

  //  Initializing objects and creating blobs
  for (let j = 0; j < 2; j++) {
    blobs[j] = new Blob((j + 1) * (width / 3), height / 2);
    expression[j] = {
      prevExp: "neutral",
      nextExp: "neutral",
    };
    properties[j] = {
      prev: {
        color: color(89, 84, 87),
        changeIncrement: 0,
        offset: 0,
      },
      curr: {
        color: color(89, 84, 87),
        changeIncrement: 0,
        offset: 0,
      },
      next: {
        color: color(89, 84, 87),
        changeIncrement: 0,
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
  else if (screen_3) drawScreen3();
}

let rileva = true;

function drawScreen2() {
  background(bg_color);
  strokeWeight(4);
  stroke(0, 255, 0);
  point(a0.x, a0.y);
  point(a1.x, a1.y);
  point(a2.x, a2.y);
  if (detections) {
    fill(255);
    textSize(20);
    noStroke();
    text("Faces detected: " + detections.length, 100, 100);
    if (detections.length == 2) {
      text("Syinc rate: " + sync + "%", width / 2, 100);
    } else text("Not enough faces!", width / 2, 100);
    if (detections.length > 0) {
      if (rileva) getFaceElements();
      blob_distance = checkDistance(blobs);
      blobs_creati.forEach((b, index) => {
        let rough = currIntensity[index] * 10;
        //  Intensity of central point (-2, 2) --> 0-100%
        let mappedI = map(sync, 0, 100, -2, 2);
        let mappedI_2 = map(sync, 0, 100, 1, -1);
        blobs[b].attracted(a0, mappedI);
        if (b == 0) blobs[b].attracted(a1, mappedI_2);
        else blobs[b].attracted(a2, mappedI_2);
        blobs[b].update();
        //  Speed of change
        change[index] += properties[index].curr.changeIncrement;
        blobs[b].show(
          rough,
          properties[index].curr.color,
          change[index],
          properties[index].curr.offset,
          expression[index].nextExp
        );
      });
    }
  }
}

let transition_bg = false;
function drawScreen3() {
  const final_exp = expression[0].nextExp;
  if (!transition_bg) bg_color = expressions[final_exp].color;

  push();
  background(bg_color);
  textSize(40);
  noStroke();
  textAlign(CENTER);
  fill(0);
  text(
    `Congratulations!
    You completed the experience!
    Your expression: ${final_exp}
    Your sync: ${sync}%`,
    width / 2 + 1,
    height / 4 + 1
  );
  fill(255);
  text(
    `Congratulations!
    You completed the experience!
    Your expression: ${final_exp}
    Your sync: ${sync}%`,
    width / 2,
    height / 4
  );

  pop();
  let i = 0;
  for (const e in exp_perc) {
    if (e != "neutral") {
      textSize(20);
      const fill_c = expressions[e].color;
      fill_c.setAlpha(255);
      const n = e.charAt(0).toUpperCase() + e.slice(1);
      fill(0);
      text(`${n}: ${exp_perc[e]}%`, width / 2 + 1, 25 * i + height / 2 + 1);
      e == expression[0].nextExp ? fill(255) : fill(fill_c);
      text(`${n}: ${exp_perc[e]}%`, width / 2, 25 * i + height / 2);
    }

    i++;
  }

  if (transition_bg) tansitionBG(bg_color, ts);
}
let ts;
function mouseClicked() {
  if (screen_3) {
    transition_bg = true;
    ts = Date.now();
  }
}

//  Background color transition
function tansitionBG(c1, timeStamp) {
  const now = Date.now();
  const interval = 1000;
  const amt = (now - timeStamp) / interval;
  const c2 = color(0);
  bg_color = lerpColor(c1, c2, amt);

  if (amt >= 1) {
    transition_bg = false;
    screen_3 = false;
    screen_1 = true;
  }
}

function checkDistance(_blobs) {
  const f = p5.Vector.sub(_blobs[0].pos, _blobs[1].pos);
  const d = f.mag();
  return d;
}

function getFaceElements() {
  //  Per ogni faccia rilevata
  blobs_creati = [];
  detections.forEach((d, index) => {
    expressionObjects[index] = d.expressions;

    //  let  expKeys[index] = Object.keys(d.expressions);

    // let expValue = 0;
    const valTreshold = 0.3;
    let i = 0;

    //  For magico per espressione corrente in testa
    for (const e in d.expressions) {
      //  Fix: neutrale per troppo tempo
      //  Problema: quando tutto sotto soglia, bug!!!
      const value = e === "neutral" ? d.expressions[e] * 0.4 : d.expressions[e];
      if (value > valTreshold) {
        expression[index].prevExp = expression[index].nextExp;
        expression[index].nextExp = `${e}`;
        const prev = expression[index].prevExp;
        const next = expression[index].nextExp;

        currIntensity[index] = value;
        // if (next === "neutral") currIntensity[index] = 0.1;
        // else currIntensity[index] = d.expressions[e];
        //  Assegno colore di expression attuale
        //  Posizione X di blob
        currX[index] = d.detection._box._x;
        if (currX[index] < 200) {
          blobs_creati[index] = 1;
        } else blobs_creati[index] = 0;

        //  Transizione fluida tra stati
        if (prev != next) {
          console.log("%cTRANSITION!", "font-weight:bold; color:red");
          console.log(`${prev} --> ${next}`);
          console.table(d.expressions);
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
        // expValue = value;
      }

      //  Display expressions values
      // if (detections.length == 2) {
      drawExpressionValues(e, d.expressions, index, i);
      i++;
      // }
    }
  });
  // if (detections.length == 2) {
  //   sync = shallowEquity(expressionObjects);
  //   // console.log("sync:", sync + "%");
  // }
}

//   Function to display the values of the expressions
function drawExpressionValues(e, expObj, index, i) {
  const spacing = 20;
  if (e != "asSortedArray") {
    push();
    let offX = 0;
    let offY = (height / 3) * 2;
    offX = currX[index] >= 200 ? width / 10 : width - width / 8;
    // if (currX[index] >= 200) offX = width / 10;
    // else offX = width - width / 8;

    if (currX[index] <= 200) {
      offX = width - width / 8;
    } else {
      offX = width / 100;
    }
    translate(offX, offY);
    const _color = expressions[e].color;
    let _value = round(expObj[e] * 10, 3);

    if (isNaN(_value)) _value = 0;

    _color.setAlpha(255);
    fill(_color);
    textSize(15);
    textAlign(LEFT);
    const nameExp = e.charAt(0).toUpperCase() + e.slice(1);
    if (e != "neutral") text(`${nameExp}: ` + _value, 0, spacing * i);
    // i++;
    _color.setAlpha(alpha);
    pop();
  }
}

//  shallowEquity tra i due oggetti--> Misurare Delta per ogni espressione--> Sottrarre Delta da TOT--> Mapparlo al 100%
function shallowEquity(objects) {
  const keys = Object.keys(objects[0]);
  let diff = 0;
  for (let key of keys) {
    const delta = abs(objects[0][key] - objects[1][key]);
    diff += delta;
    exp_perc[key] = round(map(delta, 0, 1, 100, 0), 1);
  }
  // Create object with % of every expression
  // map(delta, 0,1, 100, 0)
  let perc = map(diff, 0, 2, 100, 0);
  return round(perc);
}

function propertiesTransitions(o1, o2, lastTimestamp) {
  const now = Date.now();
  const interval = 1000;
  const amt = (now - lastTimestamp) / interval;
  // console.log("amt:", amt);

  const c1 = o1.color;
  const c2 = o2.color;

  // let amt = 0; // da 0 a 1
  const lerped_color = lerpColor(c1, c2, amt);
  const lerped_change = lerp(o1.changeIncrement, o2.changeIncrement, amt);
  const lerped_offset = lerp(o1.offset, o2.offset, amt);

  const obj = {
    color: lerped_color,
    changeIncrement: lerped_change,
    offset: lerped_offset,
  };

  if (amt >= 1) transition = false;

  return obj;
}
