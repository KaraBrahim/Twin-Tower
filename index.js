const background = document.getElementById("background");
const plain = Array.from(document.getElementsByClassName("plain"));
const obstacl = document.getElementsByClassName("obstacl")[0];
const childElements = background.children;
const bodyWidth = document.body.clientWidth;
let isTimeToStop = false;
let interval;
let plainPlace;
let obstaclPlace;
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
  testCollision();
  interval = setInterval(() => {
    moveOne();
    counter++;
    if (counter == steps) {
      clearInterval(interval);
    }
  }, 2900);
};

const isColliding = () => {
  plainPlace = plain[0].getBoundingClientRect();
  obstaclPlace = obstacl.getBoundingClientRect();
  const margin = 110;
  return !(plainPlace.left < obstaclPlace.left - margin);
};

const testCollision = () => {
  const Test = setInterval(() => {
    isTimeToStop = isColliding();
    if (isTimeToStop) {
      clearInterval(Test);
      clearInterval(interval);
      parts.forEach((part) => {
        const computedStyle = part.getBoundingClientRect();
        part.style.transition = "none";
        part.style.left = computedStyle.left + "px";
      });
      const plainImg = plain[0].querySelector("img");
      if (plainImg) {
        plainImg.style.animationPlayState = "paused";
      }
      const boom = document.getElementsByClassName("boom");
      Array.from(boom).forEach((boomNumber) => {
        boomNumber.style.display = "inline";
      });
      console.log("game stopped!");
    }
  }, 50);
};
