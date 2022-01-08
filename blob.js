class Blob {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // this.prev = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.organics = [];
    this.n_blobs = 10;
    for (let i = 0; i < this.n_blobs; i++) {
      this.organics.push(
        new Organic(
          i,
          1 + 20 * i,
          this.pos,
          i * 10,
          i * random(90),
          colors.neutral
        )
      );
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // const bounceReduction = 0.6;

    // if (this.pos.x < 0) {
    //   this.vel.mult(bounceReduction);
    //   this.vel.reflect(createVector(1, 0));
    //   this.pos.x = 0;
    // } else if (this.pos.x > width) {
    //   this.vel.mult(bounceReduction);
    //   this.vel.reflect(createVector(1, 0));
    //   this.pos.x = width;
    // }
    // if (this.pos.y < 0) {
    //   this.vel.mult(bounceReduction);
    //   this.vel.reflect(createVector(0, 1));
    //   this.pos.y = 0;
    // } else if (this.pos.y > height) {
    //   this.vel.mult(bounceReduction);
    //   this.vel.reflect(createVector(0, 1));
    //   this.pos.y = height;
    // }
  }

  show(rough, c, e) {
    stroke(255);
    point(this.pos.x, this.pos.y);
    this.organics.forEach((o) => {
      o.move(this.pos);
      o.show(c, rough);
      o.showText(e);
    });
  }

  attracted(target, intensity) {
    // var dir = target - this.pos
    var force = p5.Vector.sub(target, this.pos);
    var d = force.mag();
    d = constrain(d, 1, 100);
    var G = 50;
    var strength = G / d;
    // if (d < 20) force.mult(-force.mag());
    if (d < 10) this.vel.set(0, 0);
    else {
      force.setMag((strength * intensity) / d);
      this.acc.add(force);
    }
    // if (d < 20) force.sub(-this.vel);
    // else if (d == 0) {
    //   force.mult(0);
    // }
    // this.acc.add(force);
  }
}

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
