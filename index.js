/* const part1 = document.getElementById("part1");
const part2 = document.getElementById("part2");
const part3 = document.getElementById("part3"); */

const background = document.getElementById("background");
const plain = Array.from(document.getElementsByClassName("plain"))
console.log(plain[0]);
const childElements = background.children;
const bodyWidth = document.body.clientWidth;
const parts = [];
Array.from(childElements).forEach((e) => parts.push(e));
const styleInit = (part, i) => {
  part.style.left = i * bodyWidth + "px";
};

parts.forEach((part, i) => {
  styleInit(part, i);
  console.log(part.style.left);
});

const moveOne = () => {
  parts.forEach((part) => {
    currentLeft = parseFloat(part.style.left);
    leftValue = currentLeft - bodyWidth;
    part.style.left = leftValue + "px";
  });
};

const move = (steps = parts.length - 1) => {
  let counter = 1;
  moveOne();
  const interval = setInterval(() => {
    moveOne();
    counter++;
    if (counter == steps) {
      clearInterval(interval);
    }
  }, 2900);
  if (counter == steps) {
    clearInterval(interval);
  }
};
