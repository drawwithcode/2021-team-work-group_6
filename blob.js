class Blob {
  constructor(id, x, y) {
    this.id = id;
    this.pos = createVector(x, y);
    this.startPosition = createVector(x, y);
    this.grown = false;
    this.vel = createVector();
    this.acc = createVector();
    this.organics = [];
    this.n_blobs = 10;
    this.createOrganics();

    this.intensity = 0;
    this.expressions = { prev: "neutral", next: "neutral" };
    this.properties = {
      color: color(89, 84, 87),
      changeIncrement: 0,
      offset: 0,
    };

    this.prevProp = {};
    this.nextProp = {};

    this.side = "";
    this.expressionList = {};

    this.neutral = false;
    this.change = 0;
    this.transition = false;
  }

  createOrganics() {
    for (let i = 0; i < this.n_blobs; i++) {
      this.organics.push(
        new Organic(
          i,
          10,
          this.pos,
          i * 10,
          i * random(90),
          expressions_properties.neutral.color
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

  showBlobsNeutral(rough, color, change, offset, e) {
    const r_min = 125;
    stroke(255);
    // point(this.pos.x, this.pos.y);
    this.organics.forEach((o) => {
      if (screen_1 && !this.grown && detections.length > 0) o.grow();
      if (o.radius > r_min) this.grown = true; // TODO Far partire le animazioni
      o.showOrganics(rough, color, change, offset);
      o.move(this.pos);
      // o.showText(e);
      //  TODO 10 secondi --> Pausa rilevazione --> Espando Blob --> cambio BG
      if (screen_2 && blob_distance < 10) {
        rileva = false;
        if (o.radius < width) o.expand();
        else {
          screen_2 = false;
          screen_3 = true;
        }
      }
    });
  }

  showBlobs(change) {
    // if(!this.neutral){}
    const rough = this.intensity * 10;
    const color = this.properties.color;
    // const change = this.change + this.properties.changeIncrement;
    const offset = this.properties.offset;
    const r_min = 125;
    stroke(255);
    // point(this.pos.x, this.pos.y);
    this.organics.forEach((o) => {
      if (screen_1 && !this.grown && detections.length > 0) o.grow();
      if (o.radius > r_min) this.grown = true; // TODO Far partire le animazioni
      o.showOrganics(rough, color, change, offset);
      o.move(this.pos);
      // o.showText(e);
      //  TODO 10 secondi --> Pausa rilevazione --> Espando Blob --> cambio BG
      if (screen_2 && blob_distance < 10) {
        rileva = false;
        if (o.radius < width) o.expand();
        else {
          screen_2 = false;
          screen_3 = true;
        }
      }
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
    //  ! Sometimes the blob breaks goes over the attraction point
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

  propertiesTransitions(lastTimestamp) {
    const now = Date.now();
    const interval = 1000;
    const amt = (now - lastTimestamp) / interval;
    // console.log("amt:", amt);

    const c1 = this.prevProp.color;
    const c2 = this.nextProp.color;

    // let amt = 0; // da 0 a 1
    this.properties.color = lerpColor(c1, c2, amt);
    // console.log("lerped_color:", lerped_color);
    this.properties.changeIncrement = lerp(
      this.prevProp.changeIncrement,
      this.nextProp.changeIncrement,
      amt
    );
    this.properties.offset = lerp(
      this.prevProp.offset,
      this.nextProp.offset,
      amt
    );
    this.properties.color.setAlpha(alpha);

    // const obj = {
    //   color: lerped_color,
    //   changeIncrement: lerped_change,
    //   offset: lerped_offset,
    // };

    if (amt >= 1) this.transition = false;

    // return obj;
  }
}
