let startTransition = false;

if (!startTransition) {
  startTransition = true;
}

organics.forEach((o) => {
  o.display();
});

// crea funzione

class Transition {
  constructor(_value, _x, _y) {
    this.value = _value;
    this.max_value = 50 * this.value;
    this.x = _x;
    this.y = _y;
    this.increment = 2;
  }
}

// display() {
//     push ();
//     // valore iniziale
//     // value = 0; | this.value = 0;
//     push();
//     if (this.value < this.max_value) {
//         this.value += this.increment;
//     } else {
//         // non incremento nulla
//     }
//     pop ();
//     pop ();
// }
