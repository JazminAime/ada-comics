// Configuración de la API
const apiUrl = "https://gateway.marvel.com/v1/public/";
const publicKey = "6877e07e8bae0ff549565ad6e9b2760c";
const privateKey = "6730add6925a773cb0cee241b0902bc1b6079e87";
const ts = "marveljaz";
const hash = "8314252163cf98e60d2dd0754a7281a8";

// Selección de elementos del DOM
const cardsContainer = document.getElementById("cards-container");
const selectedOption = document.getElementById("marvel-select");
const options = document.querySelectorAll(".comic-option");
const total = document.getElementById("total-results");
const firstPage = document.getElementById("first-page");
const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");
const lastPage = document.getElementById("last-page");
const loader = document.getElementById("loader");
const searchButton = document.getElementById("btn-search");
const ttlResults = document.getElementById("results-gral");

// Función para crear tarjetas
function createCard(card) {
  const cardItem = document.createElement("div");
  cardItem.classList.add("card");

  const cardImage = document.createElement("img");
  const imagePath = card.thumbnail.path.replace(/^http:/, "https:");
  cardImage.src = `${imagePath}.${card.thumbnail.extension}`;
  cardImage.alt = card.name;

  const cardName = document.createElement("h3");
  cardName.textContent = card.name || card.title;

  cardItem.appendChild(cardImage);
  cardItem.appendChild(cardName);

  // Click en la card
  cardItem.addEventListener("click", () => {
    details(card);
  });

  cardsContainer.appendChild(cardItem);
}

// Función para crear tarjetas de personajes
function createCharacterCard(character) {
  const characterItem = document.createElement("div");
  characterItem.classList.add("card");

  const characterImage = document.createElement("img");
  const imagePath = character.thumbnail.path.replace(/^http:/, "https:");
  characterImage.src = `${imagePath}.${character.thumbnail.extension}`;
  characterImage.alt = character.name;

  const characterName = document.createElement("h3");
  characterName.textContent = character.name;

  characterItem.appendChild(characterImage);
  characterItem.appendChild(characterName);

  return characterItem;
}

// Función para crear tarjetas de cómics
function createComicCard(comic) {
  const comicItem = document.createElement("div");
  comicItem.classList.add("card");

  const comicImage = document.createElement("img");
  const imagePath = comic.thumbnail.path.replace(/^http:/, "https:");
  comicImage.src = `${imagePath}.${comic.thumbnail.extension}`;
  comicImage.alt = comic.title;

  const comicTitle = document.createElement("h3");
  comicTitle.textContent = comic.title;

  comicItem.appendChild(comicImage);
  comicItem.appendChild(comicTitle);

  return comicItem;
}

// Función para obtener detalles del personaje y crear su tarjeta
function fetchCharacterDetails(resourceURI, charactersContainer) {
  const characterUrl =
    resourceURI + "?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;

  fetch(characterUrl)
    .then((response) => response.json())
    .then((data) => {
      const character = data.data.results[0];
      const characterCard = createCharacterCard(character);
      charactersContainer.appendChild(characterCard);
    })
    .catch((error) =>
      console.error("Error al obtener los detalles del personaje:", error)
    );
}

// Función para obtener detalles del cómic y crear su tarjeta
function fetchComicDetails(resourceURI, comicsContainer) {
  const comicUrl =
    resourceURI + "?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;

  fetch(comicUrl)
    .then((response) => response.json())
    .then((data) => {
      const comic = data.data.results[0];
      const comicCard = createComicCard(comic);
      comicsContainer.appendChild(comicCard);
    })
    .catch((error) =>
      console.error("Error al obtener los detalles del cómic:", error)
    );
}

// Función para obtener personajes o comics
function fetchMarvelData(endpoint, searchValue = "", searchType = "") {
  clearCards();

  let url;
  const orderSelect = document.getElementById("sort-order");

  if (searchValue) {
    const searchParameter = `${searchType}StartsWith=${searchValue}`;

    if (orderSelect.value === "A-Z") {
      url = `${apiUrl}${endpoint}?${searchParameter}&orderBy=${searchType}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    } else if (orderSelect.value === "Z-A") {
      url = `${apiUrl}${endpoint}?${searchParameter}&orderBy=-${searchType}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    } else if (orderSelect.value === "MAS NUEVOS") {
      url = `${apiUrl}${endpoint}?${searchParameter}&orderBy=-modified&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    } else if (orderSelect.value === "MAS VIEJOS") {
      url = `${apiUrl}${endpoint}?${searchParameter}&orderBy=modified&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    }
  } else {
    if (orderSelect.value === "A-Z") {
      url = `${apiUrl}${endpoint}?orderBy=${searchType}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    } else if (orderSelect.value === "Z-A") {
      url = `${apiUrl}${endpoint}?orderBy=-${searchType}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    } else if (orderSelect.value === "MAS NUEVOS") {
      url = `${apiUrl}${endpoint}?orderBy=-modified&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    } else if (orderSelect.value === "MAS VIEJOS") {
      url = `${apiUrl}${endpoint}?orderBy=modified&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
    }
  }
  console.log(url);

  showLoader();
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      totalResults = data.data.total;
      total.textContent = `${totalResults} RESULTADOS`;
      let results = data.data.results;
      results.forEach((card) => createCard(card));
      disableButtons();
      hideLoader();
    })
    .catch((error) => console.error("Error al obtener los datos:", error));
}

// Función para limpiar tarjetas
function clearCards() {
  cardsContainer.innerHTML = "";
}

// Función para mostrar detalles de personajes y cómics
function details(card) {
  // Ocultar tarjetas
  cardsContainer.style.display = "none";

  const firstPage = document.getElementById("first-page");
  const prevPage = document.getElementById("prev-page");
  const nextPage = document.getElementById("next-page");
  const lastPage = document.getElementById("last-page");

  firstPage.style.display = "none";
  prevPage.style.display = "none";
  nextPage.style.display = "none";
  lastPage.style.display = "none";

  const ttlResults = document.getElementById("results-gral");
  ttlResults.style.display = "none";
  total.style.display = "none";

  const detailsContainer = document.getElementById("details-container");
  detailsContainer.style.display = "block";
  detailsContainer.innerHTML = "";

  let detailsHtml = "";

  if (selectedOption.value === "COMICS") {
    const writers =
      card.creators.items
        .filter((creator) => creator.role.toLowerCase() === "writer")
        .map((writer) => writer.name)
        .join(", ") || "No especificado";

    const characters = card.characters.items;

    // Obtener la fecha de lanzamiento (onsaleDate)
    const onsaleDateObj = card.dates.find((date) => date.type === "onsaleDate");
    let releaseDate = "Fecha de lanzamiento no disponible";
    if (onsaleDateObj && onsaleDateObj.date) {
      const dateObj = new Date(onsaleDateObj.date);
      releaseDate = dateObj.toLocaleDateString("es-ES"); // Formato DD/MM/YYYY
    }

    detailsHtml = `
      <div class="details-content">
        <div class="details-image">
          <img src="${card.thumbnail.path.replace(/^http:/, "https:")}.${
      card.thumbnail.extension
    }" alt="${card.title}" class="detail-image" />
        </div>
        <div class="details-text">
          <h2>${card.title}</h2>
          <p class="release-date"><strong>Fecha de lanzamiento: ${releaseDate}</strong></p>
          <p class="writers">Guionistas: ${writers}</p>
          <p class="description">Descripción: ${
            card.description || "No hay descripción disponible."
          }</p>
        </div>
      </div>`;

    detailsHtml += `<p class="character-count"><strong>Cantidad de personajes incluidos: ${characters.length}</strong></p>`;
    detailsContainer.innerHTML = detailsHtml;

    // Crear tarjetas para los personajes
    if (characters.length > 0) {
      const charactersContainer = document.createElement("div");
      charactersContainer.id = "characters-container";
      charactersContainer.style.display = "flex";
      charactersContainer.style.flexWrap = "wrap";
      charactersContainer.style.justifyContent = "center";
      charactersContainer.style.gap = "20px";
      detailsContainer.appendChild(charactersContainer);

      characters.forEach((character) => {
        fetchCharacterDetails(character.resourceURI, charactersContainer);
      });
    }
  } else if (selectedOption.value === "PERSONAJES") {
    const comicsList = card.comics.items;

    detailsHtml = `
    <div class="details-content">
      <div class="details-image">
        <img src="${card.thumbnail.path.replace(/^http:/, "https:")}.${
      card.thumbnail.extension
    }" alt="${card.name}" class="detail-image" />
      </div>
      <div class="details-text">
        <h2>${card.name}</h2>
        <p class="description"><strong>Descripción:</strong> ${
          card.description || "No hay descripción disponible."
        }</p>
      </div>
    </div>`;

    detailsHtml += `<p class="comic-count"><strong>Cantidad de comics incluidos: ${comicsList.length}</strong></p>`;
    detailsContainer.innerHTML = detailsHtml;

    // Crear tarjetas para los cómics
    if (comicsList.length > 0) {
      const comicsContainer = document.createElement("div");
      comicsContainer.id = "comics-container";
      comicsContainer.style.display = "flex";
      comicsContainer.style.flexWrap = "wrap";
      comicsContainer.style.justifyContent = "center";
      comicsContainer.style.gap = "20px";
      detailsContainer.appendChild(comicsContainer);

      comicsList.forEach((comic) => {
        fetchComicDetails(comic.resourceURI, comicsContainer);
      });
    }
  }
  const btn = document.createElement("button");
  btn.id = "back-button";
  btn.className = "btn-back";
  btn.textContent = "Volver";
  detailsContainer.appendChild(btn);

  const backBtn = document.getElementById("back-button");
  backBtn.addEventListener("click", () => {
    detailsContainer.style.display = "none";
    cardsContainer.style.display = "flex";
    firstPage.style.display = "block";
    prevPage.style.display = "block";
    nextPage.style.display = "block";
    lastPage.style.display = "block";
    ttlResults.style.display = "block";
    total.style.display = "block";
  });
}

// Paginación
let limit = 20;
let offset = 0;

// Deshabilitar botones de paginación
function disableButtons() {
  firstPage.disabled = offset === 0;
  prevPage.disabled = offset === 0;

  const maxOffset = Math.floor((totalResults - 1) / limit) * limit;
  nextPage.disabled = offset >= maxOffset;
  lastPage.disabled = offset >= maxOffset;
}

// Eventos de paginación
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

firstPage.addEventListener("click", () => {
  offset = 0;
  btnSearch();
});

lastPage.addEventListener("click", () => {
  offset = Math.floor((totalResults - 1) / limit) * limit;
  btnSearch();
});

// Funciones para mostrar y ocultar el loader
function showLoader() {
  loader.style.display = "flex";
  cardsContainer.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  cardsContainer.style.display = "flex";
}

// Función de búsqueda
function btnSearch() {
  const selectedValue = selectedOption.value.toUpperCase();
  const searchValue = document
    .getElementById("input-search")
    .value.trim()
    .toUpperCase();

  const detailsContainer = document.getElementById("details-container");
  detailsContainer.style.display = "none";
  detailsContainer.innerHTML = "";

  cardsContainer.style.display = "flex";

  if (selectedValue === "PERSONAJES") {
    fetchMarvelData("characters", searchValue, "name");
  } else if (selectedValue === "COMICS") {
    fetchMarvelData("comics", searchValue, "title");
  }
}

// Evento para el botón de búsqueda
searchButton.addEventListener("click", btnSearch);

// Cargar cómics al iniciar
window.onload = () => {
  viewOptions();
  fetchMarvelData("comics");
};

// Función para opciones - personajes - cómics
function viewOptions() {
  const selectedValue = selectedOption.value;
  const orderSelect = document.getElementById("sort-order");

  const options = orderSelect.querySelectorAll("option");
  options.forEach((option) => {
    if (selectedValue === "COMICS") {
      if (
        option.value === "MAS NUEVOS" ||
        option.value === "MAS VIEJOS" ||
        option.value === "A-Z" ||
        option.value === "Z-A"
      ) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    } else if (selectedValue === "PERSONAJES") {
      if (option.value === "MAS NUEVOS" || option.value === "MAS VIEJOS") {
        option.style.display = "none";
      } else {
        option.style.display = "block";
      }
    }
  });

  if (selectedValue === "PERSONAJES") {
    orderSelect.value = "A-Z";
  }
}

// Evento para la selección
selectedOption.addEventListener("change", () => {
  viewOptions();
});
