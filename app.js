// Configuracion de la API
const apiUrl = "https://gateway.marvel.com/v1/public/";
const publicKey = "6877e07e8bae0ff549565ad6e9b2760c";
const privateKey = "6730add6925a773cb0cee241b0902bc1b6079e87";
const ts = "marveljaz";
const hash = "8314252163cf98e60d2dd0754a7281a8";

// DOM select, contenedor cards
const cardsContainer = document.getElementById("cards-container");
const selectedOption = document.getElementById("marvel-select");

// Funcion para crear tarjetas
function createCard(card) {
  const cardItem = document.createElement("div");
  cardItem.classList.add("card");

  const cardImage = document.createElement("img");
  cardImage.src = `${card.thumbnail.path}.${card.thumbnail.extension}`;
  cardImage.alt = card.name;

  const cardName = document.createElement("h3");
  cardName.textContent = card.name || card.title;

  cardItem.appendChild(cardImage);
  cardItem.appendChild(cardName);
  //cardItem.appendChild(descriptionCard);
  cardsContainer.appendChild(cardItem);
}

// Funcion para limpiar tarjetas
function clearCards() {
  cardsContainer.innerHTML = "";
}

// Funcion para obtener personajes o comics
function fetchMarvelData(endpoint) {
  clearCards();

  fetch(
    `${apiUrl}${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`
  )
    .then((response) => response.json())
    .then((data) => {
      const results = data.data.results;
      results.forEach((card) => createCard(card));
    })
    .catch((error) => console.error("Error al obtener los datos:", error));
}

// Click boton buscar
const searchButton = document.getElementById("btn-search");

function btnSearch() {
  const selectedValue = selectedOption.value.toUpperCase();

  if (selectedValue === "PERSONAJES") {
    fetchMarvelData("characters");
  } else if (selectedValue === "COMICS") {
    fetchMarvelData("comics");
  }
}

searchButton.addEventListener("click", btnSearch);

// Cargar comics al iniciar
window.onload = () => fetchMarvelData("comics");

// PAGINACION
// const pagination = document.getElementById("pagination");
const firstPage = document.getElementById("first-page");
const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");
const lastPage = document.getElementById("last-page");

let limit = 20;
let offset = 0;

nextPage.addEventListener("click", () => {
  offset = offset + limit;
  btnSearch();
});

prevPage.addEventListener("click", () => {
  if (offset > 0) {
    offset = offset - limit;
    btnSearch();
  }
});

firstPage.addEventListener("click", () => {});

lastPage.addEventListener("click", () => {});
