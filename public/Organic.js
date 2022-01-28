/**
 * *Organic is used as layer to create the Blob
 * https://medium.com/creative-coding-space/meet-blobby-in-p5-js-5d9d99232400
 */
class Organic {
  constructor(id, radius, pos, roughness, angle, color) {
    this.id = id;
    this.radius = radius; //radius of blob
    this.pos = pos;
    this.roughness = roughness; //magnitude of distortion
    this.angle = angle; //angle of rotation
    this.color = color; //color of the blob
    this.off = 0;
  }

  showOrganics(_rough, _color, _change, _offset) {
    noStroke(); // no stroke for the circle
    this.color = _color;
    this.color.setAlpha(alpha);
    this.roughness = _rough * 10;
    fill(this.color); //color to fill the blob
    push();
    translate(this.pos); //move to xpos, ypos
    rotate(this.angle + _change); //rotate by this.angle+change
    beginShape();

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

  expand() {
    this.radius += 10;

    if (this.radius == 100) {
      const nameExp = e.charAt(0).toUpperCase() + e.slice(1);
      text(`${nameExp}: ` + _value, 0, spacing * i);
    } else {
      this.radius += 10;
    }
  }

  grow() {
    const speed = 0.05;
    const incrementDelta = 5;
    this.radius += (1 + this.id * incrementDelta) * speed;
  }
}
