const SHAKE_DURATION = 700;
const MIN_GROUP_COUNT = 1;
const MAX_GROUP_COUNT = 12;
const GROUP_NAMES = {
  fairytale: [
    "Aschenputtel",
    "Dornröschen",
    "Frau Holle",
    "Froschkönig",
    "Hans im Glück",
    "Hänsel und Gretel",
    "König Drosselbart",
    "Rapunzel",
    "Rotkäppchen",
    "Rumpelstilzchen",
    "Schneewittchen",
    "Tapferes Schneiderlein",
  ],
};

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function getGroupNames() {
  const groupNamesToUse = GROUP_NAMES.fairytale.map((name) => name);
  shuffle(groupNamesToUse);
  return groupNamesToUse;
}

function getNames() {
  return document
    .getElementById("names")
    .value.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function getGroupCount() {
  const value = document.getElementById("number-of-groups").value;
  return parseInt(value);
}

function match() {
  document.getElementById("result").style.visibility = "hidden";
  document.getElementsByTagName("body")[0].classList.add("shake");

  setTimeout(() => {
    document.getElementsByTagName("body")[0].classList.remove("shake");
    createGroups();
  }, SHAKE_DURATION);
}

function createGroups() {
  const names = getNames();
  if (names.length === 0) {
    return;
  }
  shuffle(names);

  const groupCount = getGroupCount();
  if (
    Number.isNaN(groupCount) ||
    groupCount < MIN_GROUP_COUNT ||
    groupCount > MAX_GROUP_COUNT
  ) {
    return;
  }

  const groups = [];
  names.forEach((name, index) => {
    const groupNumber = index % groupCount;
    if (groups[groupNumber] === undefined) {
      groups[groupNumber] = [];
    }
    groups[groupNumber].push(name);
  });

  const groupNames = getGroupNames();

  const result = groups
    .map((group, index) => {
      const headline = `<h2>Gruppe ${groupNames[index]}</h2>`;
      const members = group.join("<br>");
      return `<h2>${headline}</h2><p>${members}</p>`;
    })
    .join("");

  document.getElementById("result").innerHTML = result;
  document.getElementById("result").style.visibility = "visible";
}
