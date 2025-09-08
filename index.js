const background = document.getElementById("background");
const plain = Array.from(document.getElementsByClassName("plain"));
const obstacl = document.getElementsByClassName("obstacl")[0];
const childElements = background.children;
const bodyWidth = document.body.clientWidth;
const loader = document.getElementById("loader");

let isTimeToStop = false;
let interval;
let plainPlace;
let obstaclPlace;
const form = document.getElementsByTagName("form");
const formElement = Array.from(form)[0];
const parts = [];
const boomEffect = document.getElementById("boomEffect");
const airPlain = document.getElementById("airPlain");

const country = document.getElementById("country");
const fname = document.getElementById("name");
const dialogueText = Array.from(
  document.getElementsByClassName("dialogueText")
)[0];
const dialogueDiv = document.getElementById("dialogue");
const blackListButton = document.querySelector(".blackListButton");

let blackListArray = [];
let isBlackListLoaded = false;
let isBlackListLoading = false;
const firstSpan = document.querySelector(".blackListArea > span");
const allSpans = Array.from(
  document.querySelectorAll("#dialogue > span > span")
);

Array.from(childElements).forEach((e) => parts.push(e));
const styleInit = (part, i) => {
  part.style.left = i * bodyWidth + "px";
};

parts.forEach((part, i) => {
  styleInit(part, i);
});

const moveOne = () => {
  parts.forEach((part) => {
    currentLeft = parseFloat(part.style.left);
    leftValue = currentLeft - bodyWidth;
    part.style.left = leftValue + "px";
  });
};

const move = (steps = parts.length - 1) => {
  if (fname.value != "geust" && country.value != "") {
    postInfo();
  }
  airPlain.loop = true;
  airPlain.play();
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
  const Test = setInterval(async () => {
    isTimeToStop = isColliding();
    if (isTimeToStop) {
      clearInterval(Test);
      clearInterval(interval);
      airPlain.pause();
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
      let dialogue = `Oh my God...the terrorist ${fname.value} from ${country.value} blew up the Twin Towers. We have to put him on the blacklist!!`;
      dialogueDiv.style.display = "block";
      typeWriter(dialogue);

      // Load black list in background
      fillBlackList()
        .then(() => {
          // Show button only after successful loading
          if (isBlackListLoaded) {
            blackListButton.style.display = "inline";
          }
        })
        .catch(() => {
          // Even on error, show button so user can try again
          blackListButton.style.display = "inline";
        });
    }
  }, 50);
};

const fillBlackList = async () => {
  try {
    await retriveInfo();
    if (isBlackListLoaded) {
      showBlackList(blackListArray);
      console.log(firstSpan);
    }
  } catch (error) {
    console.error("Failed to load black list:", error);
    isBlackListLoaded = false;
  }
};

const unhideList = async () => {
  const blackListArea = document.querySelector(".blackListArea");

  // If still loading, show waiting message
  if (isBlackListLoading && !isBlackListLoaded) {
    dialogueText.textContent = "Loading black list... Please wait...";
    return;
  }

  // If not loaded and not loading, try to load
  if (!isBlackListLoaded && !isBlackListLoading) {
    dialogueText.textContent = "Loading black list... Please wait...";
    isBlackListLoading = true;

    try {
      await retriveInfo();
      if (isBlackListLoaded) {
        showBlackList(blackListArray);
        // Smooth slide up animation
        blackListArea.style.transform = "translateY(100%)";
        blackListArea.style.transition = "transform 0.8s ease-in-out";
        blackListArea.style.display = "inline";

        // Trigger animation after display is set
        setTimeout(() => {
          blackListArea.style.transform = "translateY(0)";
        }, 10);

        dialogueText.textContent = "Black list loaded successfully!";
      } else {
        dialogueText.textContent =
          "Failed to load black list. Please try again.";
      }
    } catch (error) {
      console.error("Error loading black list:", error);
      dialogueText.textContent = "Error loading black list. Please try again.";
    } finally {
      isBlackListLoading = false;
    }
  } else if (isBlackListLoaded) {
    // If already loaded, just show with animation
    blackListArea.style.transform = "translateY(100%)";
    blackListArea.style.transition = "transform 0.8s ease-in-out";
    blackListArea.style.display = "inline";

    setTimeout(() => {
      blackListArea.style.transform = "translateY(0)";
    }, 10);
  }
};

const loadCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    let countries = await response.json();
    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    const countryElement = document.getElementById("country");
    countries.forEach((country) => {
      const newCountry = document.createElement("option");
      newCountry.textContent = country.name.common;
      newCountry.value = country.name.common;
      countryElement.appendChild(newCountry);
    });
  } catch (error) {
    console.error(error);
  }
};
loadCountries();

const typeWriter = (message) => {
  dialogueText.textContent = message.charAt(0);
  let index = 1;
  const typerInterval = setInterval(() => {
    dialogueText.textContent += message.charAt(index);
    index++;
    if (index >= message.length) {
      clearInterval(typerInterval);
    }
  }, 50);
};

const MASTER_KEY =
  "$2a$10$FHDaOb1AlZeTRlqO5KWzou1zBie1FfODV5MEUFLorF6JYlBlCQml6";
const X_Collection_Id = "68b86163ae596e708fe15bc3";

const postInfo = () => {
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };

  req.open("POST", "https://api.jsonbin.io/v3/b", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("X-Master-Key", MASTER_KEY);
  req.setRequestHeader("X-Collection-Id", X_Collection_Id);

  req.send(`{"name": "${fname.value}" , "country":"${country.value}"}`);
};

const retriveInfo = async () => {
  const COLLECTION_ID = X_Collection_Id;
  const API_KEY = MASTER_KEY;

  try {
    isBlackListLoading = true;
    // Step 1: Get bins in the collection
    const res = await fetch(
      `https://api.jsonbin.io/v3/c/${COLLECTION_ID}/bins`,
      {
        method: "GET",
        headers: {
          "X-Master-Key": API_KEY,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    const bins = Array.from(data);
    console.log("Bins metadata:", bins);

    // Clear previous data
    blackListArray = [];

    // Step 2: For each bin, fetch its content
    for (const bin of bins) {
      const binId = bin.record;

      const binRes = await fetch(
        `https://api.jsonbin.io/v3/b/${binId}/latest`,
        {
          method: "GET",
          headers: {
            "X-Master-Key": API_KEY,
          },
        }
      );

      if (!binRes.ok) {
        throw new Error(`HTTP error! status: ${binRes.status}`);
      }

      const binData = await binRes.json();
      blackListArray.push(binData.record);
    }

    console.log(blackListArray);
    isBlackListLoaded = true;
    loader.style.display = "none";
    blackListButton.disabled = false;
  } catch (error) {
    console.error("Error in retriveInfo:", error);
    isBlackListLoaded = false;
    throw error; // Re-throw to handle in calling function
  } finally {
    isBlackListLoading = false;
  }
};

const showBlackList = (list) => {
  // Clear previous content
  firstSpan.innerHTML = `
    <span style="color: rgb(255, 136, 9); border-bottom: 1px solid rgb(255, 136, 9); display: block; width: 100%;">Name</span>
    <span style="color: rgb(255, 136, 9); border-bottom: 1px solid rgb(255, 136, 9); display: block; width: 100%;">country</span>
  `;

  list.forEach((e) => {
    const nameElem = document.createElement("span");
    nameElem.textContent = e.name;

    const countryElem = document.createElement("span");
    countryElem.textContent = e.country;

    if (e.name === fname.value) {
      nameElem.style.backgroundColor = "rgb(255, 136, 9)";
      countryElem.style.backgroundColor = "rgb(255, 136, 9)";
    }

    firstSpan.appendChild(nameElem);
    firstSpan.appendChild(countryElem);
  });
};
