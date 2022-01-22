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
    this.off = 0;
  }

  move(v) {
    this.pos = v;
  }

  showOrganics(_rough, _color, _change, _offset) {
    noStroke(); // no stroke for the circle
    this.color = _color;
    this.roughness = _rough * 10;
    fill(this.color); //color to fill the blob

    //we enclose things between push and pop so that all transformations within only affect items within
    push();
    translate(this.pos); //move to xpos, ypos
    rotate(this.angle + _change); //rotate by this.angle+change

    //begin a shape based on the vertex points below
    beginShape();

    // let off = 0;
    this.off = 0;
    //The lines below create our vertex points
    for (let i = 0; i < TWO_PI; i += 0.1) {
      let offset = map(
        noise(this.off, _change),
        0,
        1,
        -this.roughness,
        this.roughness
      );
      let r = this.radius + offset;
      let x = r * cos(i);
      let y = r * sin(i);
      vertex(x, y);
      this.off += _offset;
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

  expand() {
    this.radius += 10;
  }

  grow() {
    const speed = 0.05;
    const incrementDelta = 5;
    this.radius += (1 + this.id * incrementDelta) * speed;
    // // console.log("this.radius:", this.radius);
  }

  // setting the particle in motion.
  // https://p5js.org/examples/simulate-particles.html
}
