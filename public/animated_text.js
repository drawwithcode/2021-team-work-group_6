// *Animation Scroll Texts
// Using JavaScript to duplicate sentences to avoid repeating them in HTML

const frase = "PLEASE STAND IN FRONT OF YOUR BLOB";
let outer = document.getElementById("bottom");
let content = document.getElementsByClassName("loop");
if (screen_1)
  content.forEach((c) => {
    // const frase = c.innerHTML;
    const width = c.offsetWidth;
    repeatContent(c, outer.offsetWidth);
    function repeatContent(content, till) {
      let counter = 1; // prevents infinite loop
      const max_testi = 16;
      while (counter < max_testi && width < till) {
        color_id = (counter % 6) + 1;
        content.innerHTML +=
          frase + `<span class=c-${color_id}> ●&nbsp;</span>`;
        counter += 1;
      }
    }
  });

/*
let outer = document.querySelector("#outer");
let content = outer.querySelector('#content');

repeatContent(content, outer.offsetWidth);

let el = outer.querySelector('#loop');
el.innerHTML = el.innerHTML + el.innerHTML;

function repeatContent(content, till) {
    let html = content.innerHTML;
    let counter = 0; // prevents infinite loop

    while (content.offsetWidth < till && counter < 100) {
        content.innerHTML += html;
        counter += 1;
    }
html, body {
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
}

#outer {
  overflow: hidden;
}

#outer div {
  display: inline-block;
}

#loop {
  white-space: nowrap;
  animation: loop-anim 5s linear infinite;
}

@keyframes loop-anim {
  0% {
      margin-left: 0;
  }
  100% {
      margin-left: -50% /* This works because of the div between "outer" and "loop" */
