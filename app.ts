const character = new Character('', '', '');

const ui = new UI();

document.body.style.overflowX = 'hidden';

// Page loader
let initializing = <HTMLElement>document.querySelector('.initializing');
let initializingDone = <HTMLElement>document.querySelector('.textAfterLoad');
let progressBar = <HTMLElement>document.querySelector('.progress-bar');
let progress = <HTMLElement>document.querySelector('.progress');
let enterBtn = <HTMLElement>document.querySelector('.enter-btn');
let count: number = 0;
let per: number = 0;
let loading = setInterval(animateLoader, 30);
function animateLoader() {
  if (count === 100) {
    initializing.classList.remove('text-blink');
    clearInterval(loading);
    initializing.classList.add('text-disappear');
    progressBar.classList.add('text-disappear');
    initializing.style.visibility = 'none';
    setTimeout(() => {
      initializing.style.display = 'none';
      progressBar.style.display = 'none';
      initializingDone.style.display = 'block';
      enterBtn.style.display = 'inline';
      setTimeout(() => {
        enterBtn.style.opacity = '1';
        setTimeout(() => {
          enterBtn.classList.add('enter-btn-blink');
        }, 500);
      }, 500);
    }, 1000);
  } else {
    count += 1;
    per += 5;
    progress.style.width = per + 'px';
  }
}

const allPageLoader = <HTMLDivElement>document.querySelector('.page-loading');
enterBtn.addEventListener('click', () => {
  allPageLoader.style.display = 'none';
  searchContainer.style.visibility = 'visible';
});

// Api loader
let nextPageLink: string = '';
let allDataLoaded: boolean = false;
let previousDataExists: boolean = false;
let bottomReached: boolean = true;
let userInput: string = '';
let isChecked: boolean = false;
let tempValue: string = '';
let aliveFilt: boolean = false;
let deadFilt: boolean = false;
let unknownFilt: boolean = false;
let nameFoundConfirmed: boolean = false;
let submitCount: number = 0;

const submitBtn = document
  .getElementById('submitBtn')
  ?.addEventListener('click', (e) => {
    e.preventDefault();
    let nameCurrentInput = <HTMLInputElement>(
      document.getElementById('nameInput')
    );
    let form = <HTMLFormElement>document.getElementById('form');
    nameCurrentInput.onkeydown = () => {
      return false;
    };
    form.classList.add('disableFilterPress');
    form.disabled = true;
    const filterForm = <HTMLDivElement>document.querySelector('.filterForm');
    filterForm.classList.add('disableFilterPress');
    if (isChecked === true) {
      const getCheckedRadioBtn = <HTMLInputElement>(
        document.querySelector('input[class="form-check-input"]:checked')
      );
      getCheckedRadioBtn.checked = false;
      isChecked = false;
      const resetFilter = <HTMLElement>document.querySelector('.resetFilter');
      resetFilter.style.visibility = 'hidden';
    }
    if (previousDataExists === true) {
      const containerPost = <HTMLDivElement>(
        document.querySelector('.post-container')
      );
      while (containerPost.firstChild) {
        containerPost.removeChild(containerPost.firstChild);
      }
      previousDataExists = false;
    }
    aliveFilt = false;
    deadFilt = false;
    unknownFilt = false;
    allDataLoaded = true;
    searchingText.textContent = 'Searching in database...';
    searchingText.classList.add('text-blink');
    apiPreload.style.display = 'block';
    mainContainer.style.display = 'none';
    setTimeout(() => {
      apiPreload.style.display = 'none';
      form.classList.remove('disableFilterPress');
      form.disabled = false;
      nameCurrentInput.onkeydown = () => {
        return true;
      };
      filterForm.classList.remove('disableFilterPress');
      const containerPost = <HTMLDivElement>(
        document.querySelector('.post-container')
      );
      if (!containerPost.firstChild) {
        let userInputDisplay = <HTMLElement>(
          document.querySelector('.searchedForText')
        );
        userInputDisplay.style.display = 'inline';
        const nameInput = (document.getElementById(
          'nameInput'
        ) as HTMLInputElement)?.value;
        if (nameInput !== '') {
          if (!/^[a-zA-Z]*$/g.test(nameInput)) {
            userInputDisplay.textContent =
              'invalid characters - only letters allowed';
            form?.reset();
            return false;
          } else {
            userInput = nameInput;
            userInputDisplay.textContent = 'You searched for: ' + userInput;
          }
        } else {
          userInput = '';
          userInputDisplay.textContent = 'You searched for: All characters';
        }
        character.changeCharacter(nameInput);
        callCharactersFunction();
      }
    }, 1000);
  });

// Get data from API, first call
function callCharactersFunction(): void {
  previousDataExists = true;
  character
    .getCharacter()
    .then((results: any) => {
      mainContainer.style.display = 'inline';
      filterForm.style.display = 'flex';
      pageName.style.display = 'flex';
      document.body.style.overflowY = 'scroll';
      ui.showCharacters(results.results);
      changeStatusColor();
      changeBorderShadowOnHover();
      showAllInfo(results.results);
      nameFoundConfirmed = true;
      submitCount++;
      if (results.info.next != null) {
        nextPageLink = results.info.next;
        allDataLoaded = false;
      } else {
        console.log('Other page not exists, all API data loaded');
        allDataLoaded = true;
      }
    })
    .catch(() => {
      nameFoundConfirmed = false;
      if (nameFoundConfirmed === false)
        if (submitCount < 1) {
          mainContainer.style.display = 'none';
          filterForm.style.display = 'none';
          pageName.style.display = 'none';
          document.body.style.overflowY = 'hidden';
        }
      apiPreload.style.display = 'inline';
      searchingText.textContent = '[not found]';
      searchingText.classList.remove('text-blink');
      // console.log('First call' + err);
    });

  form?.reset();
}

// Check if page bottom reached to call API again
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (
    clientHeight + scrollTop >= scrollHeight - 30 &&
    scrollHeight >= 4000 &&
    scrollHeight !== clientHeight &&
    allDataLoaded === false
  ) {
    if (bottomReached === true) {
      bottomReached = false;
      console.log('Loading more data from API');
      loader.classList.add('show-loader');
      const filterForm = <HTMLDivElement>document.querySelector('.filterForm');
      filterForm.classList.add('disableFilterPress');
      setTimeout(() => {
        console.log('Data loaded');
        loader.classList.remove('show-loader');
        filterForm.classList.remove('disableFilterPress');
        character
          .callCharactersFunctionNextPage(nextPageLink)
          .then((results: any) => {
            ui.showCharacters(results.results);
            changeStatusColor();
            changeBorderShadowOnHover();
            showAllInfo(results.results);
            bottomReached = true;
            if (results.info.next != null) {
              nextPageLink = results.info.next;
              allDataLoaded = false;
            } else {
              allDataLoaded = true;
              console.log('All data from API loaded');
            }
          })
          .catch((err) => console.log('Fetch API data on scroll error' + err));
      }, 1000);
    }
  }
});

// Filter fetched data from API
const checkButtons = document.querySelectorAll('.form-check-input');
let checkBtnArr = Array.from(checkButtons);
checkBtnArr.forEach((element) => {
  element.addEventListener('click', () => {
    const checkedInput = <HTMLInputElement>(
      document.querySelector('input[class="form-check-input"]:checked')
    );
    if (checkedInput) {
      tempValue = checkedInput.value;
      if (tempValue === 'alive') {
        if (aliveFilt !== true) {
          innerFilterFunctions();
          aliveFilt = true;
          deadFilt = false;
          unknownFilt = false;
        } else {
          console.log('Filtered already enabled');
        }
      }
      if (tempValue === 'dead') {
        if (deadFilt !== true) {
          innerFilterFunctions();
          deadFilt = true;
          aliveFilt = false;
          unknownFilt = false;
        } else {
          console.log('Filtered already enabled');
        }
      }
      if (tempValue === 'unknown') {
        if (unknownFilt !== true) {
          innerFilterFunctions();
          unknownFilt = true;
          aliveFilt = false;
          deadFilt = false;
        } else {
          console.log('Filtered already enabled');
        }
      }
    }
  });
});

// Filter function
function innerFilterFunctions(): void {
  let nameCurrentInput = <HTMLInputElement>document.getElementById('nameInput');
  let form = <HTMLFormElement>document.getElementById('form');
  nameCurrentInput.onkeydown = () => {
    return false;
  };
  form.classList.add('disableFilterPress');
  form.disabled = true;
  const filterForm = <HTMLDivElement>document.querySelector('.filterForm');
  filterForm.classList.add('disableFilterPress');
  isChecked = true;
  character.changeCharByFilter(userInput, tempValue);
  const containerPost = <HTMLDivElement>(
    document.querySelector('.post-container')
  );
  while (containerPost.firstChild) {
    containerPost.removeChild(containerPost.firstChild);
  }
  searchingText.textContent = 'Filtering...';
  searchingText.classList.add('text-blink');
  apiPreload.style.display = 'block';
  setTimeout(() => {
    if (!containerPost.firstChild) {
      apiPreload.style.display = 'none';
      searchingText.classList.remove('text-blink');
      character
        .callCharacterFiltered()
        .then((results: any) => {
          apiPreload.style.display = 'none';
          searchingText.textContent = 'Searching in database...';
          searchingText.classList.add('text-blink');
          const resetFilter = <HTMLElement>(
            document.querySelector('.resetFilter')
          );
          resetFilter.style.visibility = 'visible';
          ui.showCharacters(results.results);
          changeStatusColor();
          changeBorderShadowOnHover();
          showAllInfo(results.results);
          form.classList.remove('disableFilterPress');
          form.disabled = false;
          nameCurrentInput.onkeydown = () => {
            return true;
          };
          filterForm.classList.remove('disableFilterPress');
          if (results.info.next != null) {
            nextPageLink = results.info.next;
            allDataLoaded = false;
          } else {
            console.log('Other page not exists, all API data loaded');
            allDataLoaded = true;
          }
        })
        .catch(() => {
          form.classList.remove('disableFilterPress');
          form.disabled = false;
          nameCurrentInput.onkeydown = () => {
            return true;
          };
          filterForm.classList.remove('disableFilterPress');
          apiPreload.style.display = 'inline';
          searchingText.textContent = '[not found]';
          searchingText.classList.remove('text-blink');
        });
    }
  }, 700);
}

// Reset filter
const resetFilter = <HTMLElement>document.querySelector('.resetFilter');
resetFilter?.addEventListener('click', () => {
  const containerPost = <HTMLDivElement>(
    document.querySelector('.post-container')
  );
  while (containerPost.firstChild) {
    containerPost.removeChild(containerPost.firstChild);
  }
  if (!containerPost.firstChild) {
    if (isChecked === true) {
      const getCheckedRadioBtn = <HTMLInputElement>(
        document.querySelector('input[class="form-check-input"]:checked')
      );
      getCheckedRadioBtn.checked = false;
      isChecked = false;
      aliveFilt = false;
      deadFilt = false;
      unknownFilt = false;
      const resetFilter = <HTMLElement>document.querySelector('.resetFilter');
      resetFilter.style.visibility = 'hidden';
    }
    apiPreload.style.display = 'none';
    searchingText.textContent = 'Searching in database...';
    searchingText.classList.add('text-blink');
    callCharactersFunction();
  }
});

// Open card and show all info
function showAllInfo(results: any): void {
  const oneProfileDiv = document.querySelectorAll('.oneProfileDiv');
  let profileDivArray = Array.from(oneProfileDiv);
  profileDivArray.forEach((element) => {
    element.addEventListener(
      'click',
      (e) => {
        e.stopPropagation();
        let charID: any = element.children[1].children[0].children[3].innerHTML;
        charID = parseInt(charID);

        results.forEach((result: any) => {
          if (charID === result.id) {
            ui.clearCharacterModal();
            ui.showCharacterModal(result);
            changeModalAllColors(result);
            modalPlace.style.display = 'inline';
            const closeBtn = document.querySelector('.closeBtn');
            closeBtn?.addEventListener('click', (e) => {
              if (e.target != modalPlace) {
                modalPlace.style.display = 'none';
              }
            });
            return true;
          }
        });
      },
      true
    );
  });
}

// Close modal if empty place is pressed
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener(
    'click',
    (e) => {
      if (e.target == charContainer) {
        modalContainer.style.display = 'inline';
      } else {
        modalContainer.style.display = 'none';
      }
    },
    false
  );
});

// Change Status color on API data load
function changeStatusColor(): void {
  const healthCheck = document.querySelectorAll('.healthCheck');
  let healthArray = Array.from(healthCheck);

  healthArray.forEach((element) => {
    if (element?.innerHTML === 'Alive') {
      element.classList.add('statusAlive');
    } else if (element?.innerHTML === 'Dead') {
      element.classList.add('statusDead');
    } else if (element?.innerHTML === 'unknown') {
      element.classList.add('statusUnknown');
    }
  });
}

// Show border on hover
function changeBorderShadowOnHover(): void {
  const oneProfileDiv = document.querySelectorAll('.oneProfileDiv');
  let profileDivArray = Array.from(oneProfileDiv);

  profileDivArray.forEach((element) => {
    const healthCheckClass =
      element?.children[0].children[1].children[0].classList;
    element?.addEventListener('mouseenter', () => {
      if (healthCheckClass.contains('statusAlive')) {
        element.classList.add('c-border-glow-green');
      } else if (healthCheckClass.contains('statusDead')) {
        element.classList.add('c-border-glow-red');
      } else if (healthCheckClass.contains('statusUnknown')) {
        element.classList.add('c-border-glow-grey');
      }
    });
    element?.addEventListener('mouseleave', () => {
      if (healthCheckClass.contains('statusAlive')) {
        element.classList.remove('c-border-glow-green');
      } else if (healthCheckClass.contains('statusDead')) {
        element.classList.remove('c-border-glow-red');
      } else if (healthCheckClass.contains('statusUnknown')) {
        element.classList.remove('c-border-glow-grey');
      }
    });
  });
}

// Change border and status colors
function changeModalAllColors(result: any): void {
  const modalHeatlhStatus = <HTMLSpanElement>(
    document.querySelector('.modalHealthStatus')
  );
  const insideImg = <HTMLImageElement>document.querySelector('.insideImg');
  if (result.status === 'Alive') {
    insideImg.classList.add('c-border-glow-green');
    modalHeatlhStatus.classList.add('statusAlive');
  } else if (result.status === 'Dead') {
    insideImg.classList.add('c-border-glow-red');
    modalHeatlhStatus.classList.add('statusDead');
  } else if (result.status === 'unknown') {
    insideImg.classList.add('c-border-glow-grey');
    modalHeatlhStatus.classList.add('statusUnknown');
  }
}
