const background = document.getElementById("background");
const plain = Array.from(document.getElementsByClassName("plain"));
const obstacl = document.getElementsByClassName("obstacl")[0];
const childElements = background.children;
const bodyWidth = document.body.clientWidth;

let isTimeToStop = false;
let interval;
let plainPlace;
let obstaclPlace;
const form = document.getElementsByTagName("form");
const formElement = Array.from(form)[0];
const parts = [];
const boomEffect = document.getElementById("boomEffect");
const country = document.getElementById('country');
const fname = document.getElementById('name');
const dialogueText = Array.from(document.getElementsByClassName('dialogueText'))[0];
const dialogueDiv = document.getElementById("dialogue");


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
  console.log(fname.value , country.value);
  formElement.style.display = "none";
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
      boomEffect.play();
      const boom = document.getElementsByClassName("boom");
      Array.from(boom).forEach((boomNumber) => {
        boomNumber.style.display = "inline";
      });
      let dialogue = `Oh my God...the terrorist ${fname.value} from ${country.value} blew up the Twin Towers. We have to put him on the blacklist!!`
      dialogueDiv.style.display = "block"
      typeWriter(dialogue);
    }
  }, 50);
};

const loadCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    let countries = await response.json();
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    const countryElement = document.getElementById('country');
    countries.forEach((country)=>{
      const newCountry = document.createElement("option");
      newCountry.textContent = country.name.common;
      newCountry.value = country.name.common;
      countryElement.appendChild(newCountry);
    })
  } catch (error) {
    console.error(error);
  }
};
loadCountries();


const typeWriter = (message) => {
  dialogueText.textContent = message.charAt(0);
  let index = 1;
const typerInterval = setInterval(()=>{
  dialogueText.textContent += message.charAt(index);
  index++;
  if (index >= message.length){
    clearInterval(typerInterval);
  }
}, 50);
}
