// colrso: https://www.rapidtables.com/web/color/green-color.html
// organic is used to store the list of instances of Organic objects that we will create
var organics = [];
// The variable change stores the rate of rotation and the y coordinate for noise later
var change, colorsPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 255);
  // noLoop();
  // frameRate(30);
  change = 0;
  colorsPalette = [
    color(255, 0, 127, 50),
    color(255, 0, 127, 33),
    color(255, 0, 127, 33),
    color(255, 0, 127, 33),
    color(255, 0, 127, 90),
    color(255, 0, 127, 55),
  ];
  //i< grandezza
  for (var i = 0; i < 113; i++) {
    organics.push(
      new Organic(
        0.1 + 1 * i,
        width / 2,
        height / 2,
        i * 4,
        i * random(90),
        colorsPalette[floor(random(6))]
      )
    );
  }
}

function draw() {
  background("black");
  for (var i = 0; i < organics.length; i++) {
    organics[i].show(change);
  }
  //change velocità
  change += 0.01;
}

function Organic(radius, xpos, ypos, roughness, angle, color) {
  this.radius = radius; //radius of blob
  this.xpos = xpos; //x position of blob
  this.ypos = ypos; // y position of blob
  this.roughness = roughness; // magnitude of how much the circle is distorted
  this.angle = angle; //how much to rotate the circle by
  this.color = color; // color of the blob

  this.show = function (change) {
    noStroke(); // no stroke for the circle
    fill(this.color); //color to fill the blob

    //we enclose things between push and pop so that all transformations within only affect items within
    push();
    translate(xpos, ypos); //move to xpos, ypos
    rotate(this.angle + change); //rotate by this.angle+change

    //begin a shape based on the vertex points below
    beginShape();

    //The lines below create our vertex points
    var off = 0;
    //i spigolosità
    for (var i = 0; i < TWO_PI; i += 0.2) {
      //if (i % 0.1 == 0) {
      var offset = map(
        noise(off, change),
        0,
        1,
        -this.roughness,
        this.roughness
      );
      var r = this.radius + offset;
      var x = r * cos(i);
      var y = r * sin(i);
      vertex(x, y);
      //spigolosità
      //}
      off += 0.3;
    }
    endShape(); //end and create the shape
    pop();
  };
}
