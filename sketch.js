// organic is used to store the list of instances of Organic objects that we will create
let organics = [];
let organics2 = [];
// The variable change stores the rate of rotation and the y coordinate for noise later
let change, colors;
let alpha = 50;

let currColor;
let currIntensity;

let expressions;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("black");
  // noLoop();
  frameRate(30);
  change = 0;
  currColor = color(89, 84, 87, alpha);
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

  for (let i = 0; i < 50; i++) {
    organics.push(
      new Organic(
        0.5 + 2 * i,
        width / 4,
        height / 2,
        i * 10,
        i * random(90),
        colors.neutral
      )
    );

    organics2.push(
      new Organic(
        0.5 + 2 * i,
        width / 2,
        height / 2,
        i * 10,
        i * random(90),
        colors.neutral
      )
    );
  }
}

function draw() {
  background("black");
  if (detections) {
    getFaceElements();
    for (let i = 0; i < organics.length; i++) {
      let rough = currIntensity * 10;
      organics[i].show(change, currColor, rough);
      organics2[i].show(change, currColor, rough);
    }
    //  Speed of change
    change += 0.03;
  }
}

// aggiungi funzione color transition !!!!
class Organic {
  constructor(radius, xpos, ypos, roughness, angle, color) {
    this.radius = radius; //radius of blob
    this.xpos = xpos; //x position of blob
    this.ypos = ypos; // y position of blob
    this.roughness = roughness; // magnitude of how much the circle is distorted
    this.angle = angle; //how much to rotate the circle by
    this.color = color; // color of the blob
  }

  show(change, c, r) {
    noStroke(); // no stroke for the circle
    this.color = c;
    this.roughness = r * 10;
    fill(this.color); //color to fill the blob

    //we enclose things between push and pop so that all transformations within only affect items within
    push();
    translate(xpos, ypos); //move to xpos, ypos
    rotate(this.angle + change); //rotate by this.angle+change

    //begin a shape based on the vertex points below
    beginShape();

    //The lines below create our vertex points
    let off = 0;
    for (let i = 0; i < TWO_PI; i += 0.1) {
      // if (i % 0.1 == 0) {
      let offset = map(
        noise(off, change),
        0,
        1,
        -this.roughness,
        this.roughness
      );
      let r = this.radius + offset;
      let x = r * cos(i);
      let y = r * sin(i);
      vertex(x, y);
      // }
      off += 0.1;
    }
    endShape(); //end and create the shape
    pop();
  }

  function colorTransition() {
    let currExp;
    let prevExp;

    lerpColor(colors.prevExp, colors.currExp, 0.50)

    if (prevExp == currExp) { colorTransition = false} 
    else { colorTransition = true}
  }
  // color.transition (valorini) crea espressione prece e corrente, se diversi eseguo transizione
  // colorLerp tra colore prece e succ
}

function getFaceElements() {
  //  Per ogni faccia rilevata
  detections.forEach((d) => {
    // let myDictionary = createNumberDict(d.expressions);
    // console.log("myDictionary:", myDictionary);
    // let maxV = myDictionary.maxValue();
    let currExp;
    let arr = Object.values(d.expressions);
    let maxi = max(arr);
    console.log("maxi:", maxi);
    //  For magico per espressione corrente in testa
    for (const e in d.expressions) {
      if (maxi == d.expressions[e]) {
        currExp = `${e}`;
        console.log("currExp:", currExp);
        //  Fix: neutrale per troppo tempo
        //  Transizione fluida tra stati
        if (currExp == "neutral") currIntensity = 0.1;
        else currIntensity = `${d.expressions[e]}`;
        console.log("currIntensity:", currIntensity);
        console.log("colors.currExp:", colors[currExp]);
        currColor = colors[currExp];
        // stroke(colors[currExp]);
      }
    }

    //  Per posizione dei punti della faccia
    d.landmarks._positions.forEach((p) => {
      // let mappedX = map(p._x, 0, 640, 0, width);
      // let mappedY = map(p._y, 0, 480, 0, height);
      // point(p._x, p._y);
    });
  });
}
