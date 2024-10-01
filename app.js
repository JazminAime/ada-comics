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
  cardName.textContent = card.name;

  //   const descriptionCard = document.createElement("p");
  //   descriptionCard.textContent = card.description;

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

  fetch(`${apiUrl}${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}`)
    .then((response) => response.json())
    .then((data) => {
      const results = data.data.results;
      results.forEach((card) => createCard(card));
    })
    .catch((error) => console.error("Error al obtener los datos:", error));
}

// Click boton buscar
const searchButton = document.getElementById("btn-search");
searchButton.addEventListener("click", () => {
  const selectedValue = selectedOption.value.toUpperCase();

  if (selectedValue === "PERSONAJES") {
    fetchMarvelData("characters");
  } else if (selectedValue === "COMICS") {
    fetchMarvelData("comics");
  }
});

// Cargar comics al iniciar
window.onload = () => fetchMarvelData("comics");

// total, limite y count - paginado - funciones - almacenar datos - array
