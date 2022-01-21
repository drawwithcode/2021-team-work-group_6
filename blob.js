class Blob {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.grown = false;
    // this.prev = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.organics = [];
    this.n_blobs = 10;
    for (let i = 0; i < this.n_blobs; i++) {
      this.organics.push(
        new Organic(
          i,
          0,
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

    if (this.pos.x < a1.x) {
      this.vel.mult(bounceReduction);
      this.vel.reflect(createVector(1, 0));
      this.pos.x = a1.x;
    } else if (this.pos.x > a2.x) {
      this.vel.mult(bounceReduction);
      this.vel.reflect(createVector(1, 0));
      this.pos.x = a2.x;
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
    const r_min = 125;
    stroke(255);
    // point(this.pos.x, this.pos.y);
    this.organics.forEach((o) => {
      if (screen_1 && !this.grown) o.grow();
      if (o.radius > r_min) this.grown = true; // Far partire le animazioni

      o.show(rough, color, change, offset);

      o.move(this.pos);
      // o.showText(e);
      //  10 secondi --> Pausa rilevazione --> Espando Blob --> cambio BG
      if (blob_distance < 10) {
        rileva = false;
        if (o.radius < width) o.expand();
        else {
          screen_2 = false;
          screen_3 = true;
        }
      }

      if (screen_3 && o.radius != 0) o.reset();
    });
  }

  idle() {}

  attracted(target, intensity) {
    // let dir = target - this.pos
    let force = p5.Vector.sub(target, this.pos);
    let d = force.mag();
    d = constrain(d, 1, 100);
    const G = 50;
    const speed = 40;
    const strength = G / d;

    // if (d < 20) force.mult(-force.mag());
    if ((d < 5 && intensity > 0.5) || detections.length < 2) this.vel.set(0, 0);
    else {
      if (intensity == 0) intensity = 0.1;
      const mag = (strength * intensity * speed) / d;
      force.setMag(mag);
      this.acc.add(force);
    }
    // if (d < 20) force.sub(-this.vel);
    // else if (d == 0) {
    //   force.mult(0);
    // }
    // this.acc.add(force);
  }

  //  I have to reset Position and Radius
  //  Posizione non si resetta correttamente
  reset() {
    this.grown = false;
    this.pos.x <= width / 2
      ? (this.pos.x = startPositions[0])
      : (this.pos.x = startPositions[1]);
  }
}
