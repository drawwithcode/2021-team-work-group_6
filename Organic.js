class Organic {
  constructor(id, radius, pos, roughness, angle, color) {
    this.id = id;
    this.radius = radius; //radius of blob
    this.pos = pos;
    this.roughness = roughness; // magnitude of how much the circle is distorted
    this.angle = angle; //how much to rotate the circle by
    this.color = color; // color of the blob
    this.xSpeed = 1;
    this.ySpeed = 1;
  }

  move(v) {
    this.pos = v;
  }

  show(c, r) {
    noStroke(); // no stroke for the circle
    this.color = c;
    this.roughness = r * 10;
    fill(this.color); //color to fill the blob

    //we enclose things between push and pop so that all transformations within only affect items within
    push();
    translate(this.pos); //move to xpos, ypos
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

  showText(e) {
    fill("white");
    textSize(35);
    textAlign(CENTER);
    text(e, this.pos.x, this.pos.y);
  }

  // setting the particle in motion.
  // https://p5js.org/examples/simulate-particles.html
}
