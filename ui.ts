type CombineTwo = HTMLElement | null;
let output: any = '';
const modalPlace = <HTMLDivElement>document.querySelector('.modal-place');
const modalContainer = <HTMLDivElement>(
  document.getElementById('modal-container')
);
const mainContainer = <HTMLDivElement>document.getElementById('main-container');
const container = <HTMLDivElement>document.querySelector('.post-container');
const charContainer = <HTMLDivElement>(
  document.querySelector('.charInfoDisplay')
);
const searchContainer = <HTMLDivElement>(
  document.getElementById('search-container')
);
const form = <HTMLFormElement>document.getElementById('form');
const filterForm = <HTMLDivElement>document.querySelector('.filterForm');
const loader = <HTMLElement>document.querySelector('.loader');
const apiPreload = <HTMLDivElement>document.getElementById('apiPreload');
const pageName = <HTMLDivElement>document.querySelector('.page-name');
const searchingText = <HTMLElement>document.querySelector('.searchingText');

class UI {
  showCharacters(characters: any) {
    characters.forEach((character: any) => {
      output = `
      <div class="col-12 col-lg-5 d-flex oneProfileDiv" id="one-profile">
        <div class="col-4" id="c-image-container">
          <img src="${character.image}" alt="" class="img-fluid" id="c-image" />
          <h5>Status: <span class="healthCheck">${character.status}</span></h5>
        </div>
        <div class="col-8" id="c-info-container">
          <ul class="list-group">
            <li class="list-group-item" id="c-name">Name: ${character.name}</li>
            <li class="list-group-item" id="c-species">Specie: ${character.species}</li>
            <li class="list-group-item" id="c-lastseen">Last time seen: ${character.location.name}</li>
            <li class="list-group-item url-hidden" id="c-id">${character.id}</li>
            </ul>
        </div>
      </div>
      `;
      container?.insertAdjacentHTML('beforeend', output);
    });
    loader.classList.remove('show-loader');
  }

  showCharacterModal(result: any) {
    output = `
    <div class="ml-auto mr-3 mt-2 closeBtn"
    ><i class="fas fa-times"></i
    ></div>
    <h3 class="modalName">${result.name}</h3>
    <img
      src="${result.image}"
      alt=""
      class="img-fluid insideImg"
      id="c-image"
    />
    <ul class="list-group">
      <li class="list-group-item" id="c-species">Specie: ${result.species}</li>
      <li class="list-group-item" id="c-gender">Gender: ${result.gender}</li>
      <li class="list-group-item" id="c-location">
        First time seen: ${result.origin.name}
      </li>
      <li class="list-group-item" id="c-lastseen">Last time seen: ${result.location.name}</li>
      <li class="list-group-item" id="c-status">
        Status: <span class="modalHealthStatus"><h5>${result.status}</h5></span>
      </li>
    </ul>
    `;
    charContainer?.insertAdjacentHTML('beforeend', output);
    modalContainer.style.display = 'inline';
  }

  clearCharacterModal() {
    charContainer.innerHTML = '';
  }
}
