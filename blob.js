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
          expressions.neutral.color
        )
      );
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);

    const bounceReduction = 0.6;

    if (this.pos.x < 0) {
      this.vel.mult(bounceReduction);
      this.vel.reflect(createVector(1, 0));
      this.pos.x = 0;
    } else if (this.pos.x > width) {
      this.vel.mult(bounceReduction);
      this.vel.reflect(createVector(1, 0));
      this.pos.x = width;
    }
    if (this.pos.y < 0) {
      this.vel.mult(bounceReduction);
      this.vel.reflect(createVector(0, 1));
      this.pos.y = 0;
    } else if (this.pos.y > height) {
      this.vel.mult(bounceReduction);
      this.vel.reflect(createVector(0, 1));
      this.pos.y = height;
    }
  }

  show(rough, color, change, offset, e) {
    stroke(255);
    // point(this.pos.x, this.pos.y);
    this.organics.forEach((o) => {
      o.move(this.pos);
      o.show(rough, color, change, offset);
      o.showText(e);
    });
  }

  attracted(target, intensity) {
    // let dir = target - this.pos
    let force = p5.Vector.sub(target, this.pos);
    let d = force.mag();
    const G = 50;
    const speed = 40;
    const strength = G / d;
    d = constrain(d, 1, 100);
    // if (d < 20) force.mult(-force.mag());
    if ((d < 5 && intensity > 0.5) || detections.length < 2) this.vel.set(0, 0);
    else {
      force.setMag((strength * intensity * speed) / (d * d));
      this.acc.add(force);
    }
    // if (d < 20) force.sub(-this.vel);
    // else if (d == 0) {
    //   force.mult(0);
    // }
    // this.acc.add(force);
  }
}
