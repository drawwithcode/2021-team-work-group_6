/**
 * Daniel Shiffman
 * http://codingtra.in
 * Attraction / Repulsion
 * Video: https://youtu.be/OAcXnzRNiCY
 */
// organic is used to store the list of instances of Organic objects that we will create
let blobs = [];
let a0;
let a1;
let a2;
// let sync = 0;
let sync = {
  prev: 0,
  curr: 0,
  next: 1,
};
const alpha = 50;
let bg_color = 0;
let startPositions = [];
// let exp_perc = {};
let timeStamp = 0;
let expressions_properties;

let blob_distance = 1;
let same_exp = false;

let screen_1 = true;
let screen_2 = false;
let screen_3 = false;
let sync_transition = false;
let blobCreati = false;
let grow = false;
let expansion = false;

//  HTML Elements
let div_scroll = [];
let div_text_1;

//  For Music
let song;
let amplitude;

// function preload() {
//   // img = loadImage("./assets/img/img.jpg");
//   song = loadSound("./assets/sound/sound.mp3");
// }

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bg_color);
  frameRate(24);
  textStyle(NORMAL);
  textFont("lores-12");
  // amplitude = new p5.Amplitude();
  // amplitude.setInput(song);

  startPositions = [width / 3, (width / 3) * 2];

  expressions_properties = {
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
      offset: 0.005,
    },
  };
  //// expressions = Object.keys(colors);

  setInitialState();

  a0 = createVector(width / 2, height / 2);
  a1 = createVector(100, height / 2);
  a2 = createVector(width - 100, height / 2);

  //HTML
  div_text_1 = select("#scritte-spiegazione");
  div_text_1.hide();
  div_scroll = [select("#top"), select("#bottom")];
}

function setInitialState() {
  //  Initializing objects and creating blobs
  blobs = [];
  for (let j = 0; j < 2; j++) {
    blobs[j] = new Blob(j, (j + 1) * (width / 3), height / 2);
  }
}

let m = 0;

/**
 * Screen 1 => {@link drawScreen1()}
 * Screen 2 => {@link drawScreen2()}
 * Screen 3 => {@link drawScreen3()}
 */

// function musicPlay() {
//   if (mouseMoved) {
//     mySong.play();
//   } else {
//     if (mySong.isPlaying() === false) {
//       mySong.play();
//     }
//   }
// }
function draw() {
  m = millis();
  if (screen_1) drawScreen1();
  else if (screen_2) drawScreen2();
  else if (screen_3) drawScreen3();
}

let rileva = true;
let text_animation = false;
let start;
let duration;
/**
 * Linked to {@link manageBlobs()}
 */
function drawScreen1() {
  const animation_time = 5000 * 5;
  background(bg_color);
  div_scroll.forEach((d) => {
    d.show();
  });

  if (detections) {
    manageBlobs();
    if (detections.length == 2) {
      //  *Faccio partire le azimazioni
      if (!text_animation) {
        start = m;
        div_text_1.show();
        text_animation = true;
      }
      if (text_animation) {
        duration = m - start;

        if (duration >= animation_time) {
          console.log("Animazione finita");
          text_animation = false;
          screen_1 = false;
          screen_2 = true;
        }
      }
    }
  } else {
    fill(255);
    textAlign(CENTER);
    textSize(25);
    const load_text = "Loading the face recognition...";
    text(load_text.toUpperCase(), width / 2, height / 2);
  }
}

let logout = false;
let start_logout = 0;
let duration_logout = 0;
function drawScreen2() {
  const logout_time = 10000;
  div_scroll.forEach((d) => {
    d.hide();
  });

  div_text_1.hide();
  background(bg_color);
  // strokeWeight(4);
  // stroke(0, 255, 0);
  // point(a0.x, a0.y);
  // point(a1.x, a1.y);
  // point(a2.x, a2.y);
  if (detections) {
    fill(255);
    textSize(20);
    noStroke();
    text("Faces detected: " + detections.length, 100, 100);
    if (detections.length == 2) {
      logout = false;
      text("Syinc rate: " + sync.curr + "%", width / 2, 100);
    } else if (detections.length < 2) {
      if (!logout) {
        start_logout = m;
        logout = true;
      }

      if (logout) {
        // *Start timer
        duration_logout = m - start_logout;
        const countdown = round((logout_time - duration_logout) / 1000);
        push();
        textAlign(CENTER);
        text(
          `Not enough faces!
        Returning home in: ${countdown}s`,
          width / 2,
          100
        );
        pop();
        if (duration_logout >= logout_time) {
          console.log("Going home...");
          logout = false;
          screen_1 = true;
          screen_2 = false;
        }
      } else if (detections.length > 2) {
        //! Cosa fare quando ci sono più di 2 facce
        text(
          `Too much faces!
       Make sure you are on an empty background`,
          100,
          100
        );
      }
    }
    manageBlobs();
  }
}

/**
 * *Function to manage the behaveiour of the blobs
 * Check face parameters => {@link getFaceElements()}
 * Measure distance between blobs => {@link checkDistance()}
 */
function manageBlobs() {
  if ((detections.length > 0 && detections.length < 3) || expansion) {
    if (rileva) getFaceElements();
    blob_distance = checkDistance(blobs);

    blobs.forEach((b) => {
      b.neutral = false;

      //  If there's one detection, draw a Neutral in the empty side
      if (detections.length == 1 && !expansion) {
        blobs[1].pos.x =
          blobs[0].pos.x < width / 2 ? startPositions[1] : startPositions[0];
        // console.log("blobs[1].pos.x:", blobs[1].pos.x);
        blobs[1].neutral = true;
      }

      if (screen_2) {
        //* Intensity of central point (-2, 2) --> 0-100%
        let mappedI = map(sync.curr, 0, 100, -2, 2);
        let mappedI_2 = map(sync.curr, 0, 100, 1, -1);
        b.attracted(a0, mappedI);
        b.pos.x < width / 2
          ? b.attracted(a1, mappedI_2)
          : b.attracted(a2, mappedI_2);
        b.update(); //* Update blobs' postition
      }
      //* Speed of change
      b.change += !b.neutral
        ? b.properties.changeIncrement
        : expressions_properties.neutral.changeIncrement;
      b.showBlobs();
    });
  } else if (!expansion) {
    // blobs.forEach((b) => {
    //   b.neutral = true;
    //   b.change += expressions_properties.neutral.changeIncrement;
    //   b.showBlobs();
    // });
    for (let i = 0; i < 2; i++) {
      blobs[i].neutral = true;
      blobs[i].change += expressions_properties.neutral.changeIncrement;
      blobs[i].showBlobs();
    }
  }
}

let transition_bg = false;
let sync_printed = 0;
function drawScreen3() {
  const final_exp = blobs[0].expressions.next;

  if (!transition_bg) bg_color = expressions_properties[final_exp].color;
  background(bg_color);

  if (!transition_bg) {
    for (let i = 0; i < 10; i++)
      if (sync_printed <= sync.curr) sync_printed += 0.1;
    const rounded_sync = floor(sync_printed, 1);
    const phrase1 = `Congratulations!
    You completed the experience!
    Your expression: ${final_exp.toUpperCase()}
    Your sync: ${rounded_sync}%`;
    push();
    textSize(40);
    noStroke();
    textAlign(CENTER);
    fill(0);
    text(phrase1, width / 2 + 1, height / 4 + 1);
    fill(255);
    text(phrase1, width / 2, height / 4);

    if (sync_printed >= sync.curr) {
      const phrase2 = `CLICK TO RESTART THE EXPERIENCE`;
      const spaceY = 200;
      textSize(30);
      fill(0);
      text(phrase2, width / 2 + 1, height / 2 + 1 + spaceY);
      fill(255);
      text(phrase2, width / 2, height / 2 + spaceY);
    }
    pop();
    // let i = 0;
    // for (const e in exp_perc) {
    //   if (e != "neutral") {
    //     textSize(20);
    //     const fill_c = expressions_properties[e].color;
    //     const n = e.charAt(0).toUpperCase() + e.slice(1);
    //     fill_c.setAlpha(255);
    //     fill(0);
    //     text(
    //       `${n}: ${exp_perc[e]}%`,
    //       width / 2 + 1,
    //       25 * i + height / 2 + 1 + spaceY
    //     );
    //     e == blobs[0].expressions.next ? fill(255) : fill(fill_c);
    //     text(`${n}: ${exp_perc[e]}%`, width / 2, 25 * i + height / 2 + spaceY);
    //   }

    //   i++;
    // }
  }

  if (transition_bg) transitionBG(bg_color, ts);
}

let ts;
function mouseClicked() {
  if (screen_3 && sync_printed >= sync.curr) {
    transition_bg = true;
    sync_printed = 0;
    ts = Date.now();
    setInitialState();
  }

    lerpColor(colors.prevExp, colors.currExp, 0.5);

//* Background color transition
function transitionBG(c1, timeStamp) {
  console.log("BG TRANSITION");
  const now = Date.now();
  const interval = 1000;
  const amt = (now - timeStamp) / interval;
  const c2 = color(0);
  bg_color = lerpColor(c1, c2, amt);
  console.log("lerped", bg_color);

  if (amt >= 1) {
    transition_bg = false;
    screen_3 = false;
    screen_1 = true;
    rileva = true;
  }
}

function checkDistance(_blobs) {
  same_exp =
    _blobs[0].expressions.next == _blobs[1].expressions.next ? true : false;

  const f = p5.Vector.sub(_blobs[0].pos, _blobs[1].pos);
  const d = f.mag();
  return d;
}

let sPrev, sNext;

function getFaceElements() {
  //* Per ogni faccia rilevata
  blobs_creati = [];
  detections.forEach((d, index) => {
    if (screen_1)
      blobs[index].pos.x =
        d.detection._box._x > 200 ? startPositions[0] : startPositions[1];

    blobs[index].expressionList = d.expressions;

    let expValue = 0;
    const valTreshold = 0.05;
    let i = 0;

    //*  For magico per espressione corrente in testa
    for (const e in d.expressions) {
      //  ! Problema: quando tutto sotto soglia, non appaiono le facce
      const value = e === "neutral" ? d.expressions[e] * 0.1 : d.expressions[e];
      if (value > valTreshold) {
        blobs[index].expressions.prev = blobs[index].expressions.next;
        blobs[index].expressions.next = e;
        const prev = blobs[index].expressions.prev;
        const next = blobs[index].expressions.next;

        // expValue = value;
        blobs[index].intensity = d.expressions[e];

        //*  Transizione fluida tra stati
        if (prev != next) {
          console.log("%cTRANSITION!", "font-weight:bold; color:red");
          // console.log(`${prev} --> ${next}`);
          console.table(d.expressions);
          blobs[index].transition = true;
          timeStamp = Date.now();
          blobs[index].prevProp = expressions_properties[prev];
          blobs[index].nextProp = expressions_properties[next];
        }

        if (blobs[index].transition) {
          blobs[index].propertiesTransitions(timeStamp);
        } else if (!blobs[index].transition) {
          blobs[index].properties.color = expressions_properties[next].color;
          // blobs[index].properties.color.setAlpha(alpha);
        }
      }

      //  Display expressions values
      if (screen_2) {
        drawExpressionValues(e, d.expressions, index, i);
        i++;
      }
    }
  });

  if (detections.length == 2) {
    sync.prev = sync.next;
    sync.next = shallowEquity(blobs[0].expressionList, blobs[1].expressionList);
    if (sync.prev != sync.next) {
      // console.log(`Sync: ${sync.prev} --> ${sync.next}`);
      sync_transition = true;
      timeStamp = Date.now();
      sPrev = sync.prev;
      sNext = sync.next;
    }
    if (sync_transition) {
      sync.curr = lerpSync(sPrev, sNext, timeStamp);
    } else {
      sync.curr = sync.next;
    }
  }
}

/**
 * *Function to display the values of the expressions
 * @param {String} e
 * @param {Object} expObj
 * @param {*} index
 * @param {*} i
 */
function drawExpressionValues(e, expObj, index, i) {
  const spacing = 20;
  if (e != "asSortedArray") {
    push();
    let offX = 0;
    let offY = (height / 3) * 2;
    offX = blobs[index].pos.x < width / 2 ? width / 10 : width - width / 8;

    if (currX[index] <= 200) {
      offX = width - width / 8;
    } else {
      offX = width / 100;
    }
    translate(offX, offY);
    const _color = expressions_properties[e].color;
    let _value = round(expObj[e] * 10, 3);

    if (isNaN(_value)) _value = 0;

    _color.setAlpha(255);
    fill(_color);
    textSize(15);
    textAlign(LEFT);
    const nameExp = e.charAt(0).toUpperCase() + e.slice(1);
    if (e != "neutral") text(`${nameExp}: ` + _value, 0, spacing * i);
    pop();
  }
}

/**
 * *shallowEquity between 2 objects
 * Used to measure the difference between each expression and measure how similar they are in %
 * @param {*} objects
 * @returns
 */
function shallowEquity(obj1, obj2) {
  const keys = Object.keys(obj1);
  let diff = 0;
  for (let key of keys) {
    if (key != "neutral") {
      const delta = abs(obj1[key] - obj2[key]);
      diff += delta;
      // exp_perc[key] = round(map(delta, 0, 1, 100, 0), 1);
    }
  }
  // *Create object with % of every expression
  let perc = map(diff, 0, 2, 100, 0);
  return round(perc, 1);
}

/**
 * Everytime the sync changes this function lerps the value during the 1 second interval
 * @param {number} prev
 * @param {number} next
 * @param {number} timeStamp
 * @returns {number}
 */
function lerpSync(prev, next, timeStamp) {
  const now = Date.now();
  const interval = 1000;
  const amt = (now - timeStamp) / interval;

  const lerped = lerp(prev, next, amt);
  // console.log(`Sync: ${prev} --> ${next} == ${lerped}
  //  Amt: ${amt}`);

  if (amt > 1) sync_transition = false;

  return round(lerped);
}
