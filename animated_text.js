// *Animation Scroll Texts
const frase = "PLEASE STAND IN FRONT OF YOUR BLOB ●&nbsp;";
let content = document.getElementsByClassName("loop");
if (screen_1)
  content.forEach((c) => {
    repeatContent(c, c.offsetWidth);
    function repeatContent(el) {
      let counter = 0; // prevents infinite loop
      const max_testi = 10;
      while (counter < max_testi) {
        el.innerHTML += frase;
        counter += 1;
      }
    }
  });
