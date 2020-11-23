const SHAKE_DURATION = 700;
const MIN_GROUP_COUNT = 1;
const MAX_GROUP_COUNT = 12;
const XMAS = "xmas";
const GROUP_NAMES = {
  asterix: [
    // see https://de.wikipedia.org/wiki/Figuren_aus_Asterix
    "Adrenaline",
    "Augenblix",
    "Automatix",
    "Asterix",
    "Falbala",
    "Gutemine",
    "Idefix",
    "Jellosubmarine",
    "Kantine",
    "Majestix",
    "Methusalix",
    "Miraculix",
    "Obelix",
    "Praline",
    "Rohrpostix",
    "Tragicomix",
    "Troubadix",
    "Verleihnix",
    "Julius Cäsar",
    "Kleopatra",
  ],
  city: [
    // 3 largest urban areas from each continent
    // see https://en.wikipedia.org/wiki/List_of_largest_cities
    // Africa
    "Kairo",
    "Lagos",
    "Kinshasa",
    // Asia
    "Tokio",
    "Jakarta",
    "Delhi",
    // Europe
    "Moskau",
    "Paris",
    "London",
    // North America
    "Mexico",
    "New York",
    "Los Angeles",
    // South America
    "São Paulo",
    "Buenos Aires",
    "Rio de Janeiro",
  ],
  city_eu: [
    // largest capital cities in Europe
    // see https://en.wikipedia.org/wiki/List_of_European_cities_by_population_within_city_limits
    "Moskau",
    "London",
    "Berlin",
    "Madrid",
    "Kiew",
    "Rom",
    "Paris",
    "Bukarest",
    "Minsk",
    "Wien",
    "Warschau",
    "Budapest",
    "Belgrad",
    "Prag",
    "Sofia",
    "Brüssel",
  ],
  city_de: [
    // largest federal capital cities in Germany
    // see https://en.wikipedia.org/wiki/List_of_cities_in_Germany_by_population
    "Berlin",
    "Hamburg",
    "München",
    "Stuttgart",
    "Düsseldorf",
    "Bremen",
    "Dresden",
    "Hannover",
    "Wiesbaden",
    "Kiel",
    "Magdeburg",
    "Erfurt",
    "Mainz",
    "Saarbrücken",
    "Potsdam",
  ],
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
  xmas: [
    "Glühwein",
    "Grinch",
    "Knecht Ruprecht",
    "Lebkuchen",
    "Nikolaus",
    "Rudolf",
    "Schneemann",
    "Spekulatius",
    "Weihnachtsmann",
    "Wichtel",
    "Ho Ho Ho",
  ],
  zodiac: [
    "Widder",
    "Stier",
    "Zwillinge",
    "Krebs",
    "Löwe",
    "Jungfrau",
    "Waage",
    "Skorpion",
    "Schütze",
    "Steinbock",
    "Wassermann",
    "Fische",
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

function isXmas() {
  const date = new Date();
  return date.getMonth() === 11 && date.getDate <= 25;
}

function getGroupNameCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("group");
  if (Object.keys(GROUP_NAMES).includes(categoryFromUrl)) {
    return categoryFromUrl;
  }

  if (isXmas()) {
    return XMAS;
  }

  const categories = Object.keys(GROUP_NAMES).filter(
    (category) => category !== XMAS
  );
  const index = Math.floor(Math.random() * categories.length);
  return categories[index];
}

function getGroupNames() {
  const category = getGroupNameCategory();
  const groupNamesToUse = GROUP_NAMES[category].map((name) => name);
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
