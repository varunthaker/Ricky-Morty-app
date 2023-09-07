import { createCharacterCard } from "./components/card/card.js";
import { createButton } from "./components/nav-button/nav-button.js";
import { createPagination } from "./components/nav-pagination/nav-pagination.js";
import { createSearchBar } from "./components/search-bar/search-bar.js";

const cardContainer = document.querySelector('[data-js="card-container"]');
const searchBarContainer = document.querySelector(
  '[data-js="search-bar-container"]'
);
const navigation = document.querySelector('[data-js="navigation"]');

// States‚
let maxPage = 1;
let page = 1;
let searchQuery = "";

const searchOnCharacters = (e) => {
  e.preventDefault();
  searchQuery = searchBar.elements.query.value;
  fetchCharacters();
  searchBar.reset();
};

const prevClick = () => {
  page--;
  fetchCharacters();
  if (page <= 1) {
    prevButton.disabled = true;
  } else if (page > 1) {
    nextButton.disabled = false;
  } else {
    return null;
  }
};

const nextClick = () => {
  page++;
  fetchCharacters();
  if (page === maxPage) {
    nextButton.disabled = true;
  } else if (page <= maxPage) {
    prevButton.disabled = false;
  } else {
    return null;
  }
};

const searchBar = createSearchBar(searchOnCharacters);
searchBarContainer.append(searchBar);
const prevButton = createButton(
  "button--prev",
  "button-prev",
  "previous",
  prevClick
);

navigation.append(prevButton);
const pagination = createPagination(page, maxPage);
navigation.append(pagination);
const nextButton = createButton(
  "button--next",
  "button-next",
  "next",
  nextClick
);
navigation.append(nextButton);

const fetchCharacters = async () => {
  const apiURL = `https://rickandmortyapi.com/api/character/?page=${page}&name=${searchQuery}`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    maxPage = data.info.pages;
    const requiredData = data.results;

    cardContainer.innerHTML = "";

    requiredData.map((character) => {
      const createdCard = createCharacterCard(character);
      return cardContainer.append(createdCard);
    });
    pagination.innerHTML = `${page}/${maxPage}`;
  } catch (error) {
    console.error("error is ", error);
    if (error) {
      console.log(`Searched name ${searchQuery} does't exist!`);
      cardContainer.innerHTML = " ";
      const pElement = document.createElement("p");

      pElement.textContent = `Searched Character "${searchQuery}" doesn't exist!`;
      cardContainer.append(pElement);
    }
  }
};

fetchCharacters();
