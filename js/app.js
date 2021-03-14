"use strict";
var _a;
var character = new Character('', '', '');
var ui = new UI();
document.body.style.overflowX = 'hidden';
// Page loader
var initializing = document.querySelector('.initializing');
var initializingDone = document.querySelector('.textAfterLoad');
var progressBar = document.querySelector('.progress-bar');
var progress = document.querySelector('.progress');
var enterBtn = document.querySelector('.enter-btn');
// let count: number = 0;
// let per: number = 0;
// let loading = setInterval(animateLoader, 30);
// function animateLoader() {
//   if (count === 100) {
//     initializing.classList.remove('text-blink');
//     clearInterval(loading);
//     initializing.classList.add('text-disappear');
//     progressBar.classList.add('text-disappear');
//     initializing.style.visibility = 'none';
//     setTimeout(() => {
//       initializing.style.display = 'none';
//       progressBar.style.display = 'none';
//       initializingDone.style.display = 'block';
//       enterBtn.style.display = 'inline';
//       setTimeout(() => {
//         enterBtn.style.opacity = '1';
//         setTimeout(() => {
//           enterBtn.classList.add('enter-btn-blink');
//         }, 500);
//       }, 500);
//     }, 1000);
//   } else {
//     count += 1;
//     per += 5;
//     progress.style.width = per + 'px';
//   }
// }
initializingDone.style.display = 'inline';
enterBtn.style.display = 'inline';
setTimeout(function () {
    enterBtn.style.opacity = '1';
    initializingDone.style.opacity = '1';
    setTimeout(function () {
        enterBtn.classList.add('enter-btn-blink');
    }, 500);
}, 1000);
var allPageLoader = document.querySelector('.page-loading');
enterBtn.addEventListener('click', function () {
    allPageLoader.style.display = 'none';
    searchContainer.style.visibility = 'visible';
});
// Api loader
var nextPageLink = '';
var allDataLoaded = false;
var previousDataExists = false;
var bottomReached = true;
var userInput = '';
var isChecked = false;
var tempValue = '';
var aliveFilt = false;
var deadFilt = false;
var unknownFilt = false;
var nameFoundConfirmed = false;
var submitCount = 0;
var submitBtn = (_a = document
    .getElementById('submitBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
    e.preventDefault();
    var nameCurrentInput = (document.getElementById('nameInput'));
    var form = document.getElementById('form');
    nameCurrentInput.onkeydown = function () {
        return false;
    };
    form.classList.add('disableFilterPress');
    form.disabled = true;
    var filterForm = document.querySelector('.filterForm');
    filterForm.classList.add('disableFilterPress');
    if (isChecked === true) {
        var getCheckedRadioBtn = (document.querySelector('input[class="form-check-input"]:checked'));
        getCheckedRadioBtn.checked = false;
        isChecked = false;
        var resetFilter_1 = document.querySelector('.resetFilter');
        resetFilter_1.style.visibility = 'hidden';
    }
    if (previousDataExists === true) {
        var containerPost = (document.querySelector('.post-container'));
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
    setTimeout(function () {
        var _a;
        apiPreload.style.display = 'none';
        form.classList.remove('disableFilterPress');
        form.disabled = false;
        nameCurrentInput.onkeydown = function () {
            return true;
        };
        filterForm.classList.remove('disableFilterPress');
        var containerPost = (document.querySelector('.post-container'));
        if (!containerPost.firstChild) {
            var userInputDisplay = (document.querySelector('.searchedForText'));
            userInputDisplay.style.display = 'inline';
            var nameInput = (_a = document.getElementById('nameInput')) === null || _a === void 0 ? void 0 : _a.value;
            if (nameInput !== '') {
                if (!/^[a-zA-Z]*$/g.test(nameInput)) {
                    userInputDisplay.textContent =
                        'invalid characters - only letters allowed';
                    form === null || form === void 0 ? void 0 : form.reset();
                    return false;
                }
                else {
                    userInput = nameInput;
                    userInputDisplay.textContent = 'You searched for: ' + userInput;
                }
            }
            else {
                userInput = '';
                userInputDisplay.textContent = 'You searched for: All characters';
            }
            character.changeCharacter(nameInput);
            callCharactersFunction();
        }
    }, 1000);
});
// Get data from API, first call
function callCharactersFunction() {
    previousDataExists = true;
    character
        .getCharacter()
        .then(function (results) {
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
        }
        else {
            console.log('Other page not exists, all API data loaded');
            allDataLoaded = true;
        }
    })
        .catch(function () {
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
    form === null || form === void 0 ? void 0 : form.reset();
}
// Check if page bottom reached to call API again
window.addEventListener('scroll', function () {
    var _a = document.documentElement, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    if (clientHeight + scrollTop >= scrollHeight - 80 &&
        scrollHeight >= 4000 &&
        scrollHeight !== clientHeight &&
        allDataLoaded === false) {
        if (bottomReached === true) {
            bottomReached = false;
            console.log('Loading more data from API');
            loader.classList.add('show-loader');
            var filterForm_1 = document.querySelector('.filterForm');
            filterForm_1.classList.add('disableFilterPress');
            setTimeout(function () {
                console.log('Data loaded');
                loader.classList.remove('show-loader');
                filterForm_1.classList.remove('disableFilterPress');
                character
                    .callCharactersFunctionNextPage(nextPageLink)
                    .then(function (results) {
                    ui.showCharacters(results.results);
                    changeStatusColor();
                    changeBorderShadowOnHover();
                    showAllInfo(results.results);
                    bottomReached = true;
                    if (results.info.next != null) {
                        nextPageLink = results.info.next;
                        allDataLoaded = false;
                    }
                    else {
                        allDataLoaded = true;
                        console.log('All data from API loaded');
                    }
                })
                    .catch(function (err) { return console.log('Fetch API data on scroll error' + err); });
            }, 1000);
        }
    }
});
// Filter fetched data from API
var checkButtons = document.querySelectorAll('.form-check-input');
var checkBtnArr = Array.from(checkButtons);
checkBtnArr.forEach(function (element) {
    element.addEventListener('click', function () {
        var checkedInput = (document.querySelector('input[class="form-check-input"]:checked'));
        if (checkedInput) {
            tempValue = checkedInput.value;
            if (tempValue === 'alive') {
                if (aliveFilt !== true) {
                    innerFilterFunctions();
                    aliveFilt = true;
                    deadFilt = false;
                    unknownFilt = false;
                }
                else {
                    console.log('Filtered already enabled');
                }
            }
            if (tempValue === 'dead') {
                if (deadFilt !== true) {
                    innerFilterFunctions();
                    deadFilt = true;
                    aliveFilt = false;
                    unknownFilt = false;
                }
                else {
                    console.log('Filtered already enabled');
                }
            }
            if (tempValue === 'unknown') {
                if (unknownFilt !== true) {
                    innerFilterFunctions();
                    unknownFilt = true;
                    aliveFilt = false;
                    deadFilt = false;
                }
                else {
                    console.log('Filtered already enabled');
                }
            }
        }
    });
});
// Filter function
function innerFilterFunctions() {
    var nameCurrentInput = document.getElementById('nameInput');
    var form = document.getElementById('form');
    nameCurrentInput.onkeydown = function () {
        return false;
    };
    form.classList.add('disableFilterPress');
    form.disabled = true;
    var filterForm = document.querySelector('.filterForm');
    filterForm.classList.add('disableFilterPress');
    isChecked = true;
    character.changeCharByFilter(userInput, tempValue);
    var containerPost = (document.querySelector('.post-container'));
    while (containerPost.firstChild) {
        containerPost.removeChild(containerPost.firstChild);
    }
    searchingText.textContent = 'Filtering...';
    searchingText.classList.add('text-blink');
    apiPreload.style.display = 'block';
    setTimeout(function () {
        if (!containerPost.firstChild) {
            apiPreload.style.display = 'none';
            searchingText.classList.remove('text-blink');
            character
                .callCharacterFiltered()
                .then(function (results) {
                apiPreload.style.display = 'none';
                searchingText.textContent = 'Searching in database...';
                searchingText.classList.add('text-blink');
                var resetFilter = (document.querySelector('.resetFilter'));
                resetFilter.style.visibility = 'visible';
                ui.showCharacters(results.results);
                changeStatusColor();
                changeBorderShadowOnHover();
                showAllInfo(results.results);
                form.classList.remove('disableFilterPress');
                form.disabled = false;
                nameCurrentInput.onkeydown = function () {
                    return true;
                };
                filterForm.classList.remove('disableFilterPress');
                if (results.info.next != null) {
                    nextPageLink = results.info.next;
                    allDataLoaded = false;
                }
                else {
                    console.log('Other page not exists, all API data loaded');
                    allDataLoaded = true;
                }
            })
                .catch(function () {
                form.classList.remove('disableFilterPress');
                form.disabled = false;
                nameCurrentInput.onkeydown = function () {
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
var resetFilter = document.querySelector('.resetFilter');
resetFilter === null || resetFilter === void 0 ? void 0 : resetFilter.addEventListener('click', function () {
    var containerPost = (document.querySelector('.post-container'));
    while (containerPost.firstChild) {
        containerPost.removeChild(containerPost.firstChild);
    }
    if (!containerPost.firstChild) {
        if (isChecked === true) {
            var getCheckedRadioBtn = (document.querySelector('input[class="form-check-input"]:checked'));
            getCheckedRadioBtn.checked = false;
            isChecked = false;
            aliveFilt = false;
            deadFilt = false;
            unknownFilt = false;
            var resetFilter_2 = document.querySelector('.resetFilter');
            resetFilter_2.style.visibility = 'hidden';
        }
        apiPreload.style.display = 'none';
        searchingText.textContent = 'Searching in database...';
        searchingText.classList.add('text-blink');
        callCharactersFunction();
    }
});
// Open card and show all info
function showAllInfo(results) {
    var oneProfileDiv = document.querySelectorAll('.oneProfileDiv');
    var profileDivArray = Array.from(oneProfileDiv);
    profileDivArray.forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
            var charID = element.children[1].children[0].children[3].innerHTML;
            charID = parseInt(charID);
            results.forEach(function (result) {
                if (charID === result.id) {
                    ui.clearCharacterModal();
                    ui.showCharacterModal(result);
                    changeModalAllColors(result);
                    modalPlace.style.display = 'inline';
                    var closeBtn = document.querySelector('.closeBtn');
                    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', function (e) {
                        if (e.target != modalPlace) {
                            modalPlace.style.display = 'none';
                        }
                    });
                    return true;
                }
            });
        }, true);
    });
}
// Close modal if empty place is pressed
window.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('click', function (e) {
        if (e.target == charContainer) {
            modalContainer.style.display = 'inline';
        }
        else {
            modalContainer.style.display = 'none';
        }
    }, false);
});
// Change Status color on API data load
function changeStatusColor() {
    var healthCheck = document.querySelectorAll('.healthCheck');
    var healthArray = Array.from(healthCheck);
    healthArray.forEach(function (element) {
        if ((element === null || element === void 0 ? void 0 : element.innerHTML) === 'Alive') {
            element.classList.add('statusAlive');
        }
        else if ((element === null || element === void 0 ? void 0 : element.innerHTML) === 'Dead') {
            element.classList.add('statusDead');
        }
        else if ((element === null || element === void 0 ? void 0 : element.innerHTML) === 'unknown') {
            element.classList.add('statusUnknown');
        }
    });
}
// Show border on hover
function changeBorderShadowOnHover() {
    var oneProfileDiv = document.querySelectorAll('.oneProfileDiv');
    var profileDivArray = Array.from(oneProfileDiv);
    profileDivArray.forEach(function (element) {
        var healthCheckClass = element === null || element === void 0 ? void 0 : element.children[0].children[1].children[0].classList;
        element === null || element === void 0 ? void 0 : element.addEventListener('mouseenter', function () {
            if (healthCheckClass.contains('statusAlive')) {
                element.classList.add('c-border-glow-green');
            }
            else if (healthCheckClass.contains('statusDead')) {
                element.classList.add('c-border-glow-red');
            }
            else if (healthCheckClass.contains('statusUnknown')) {
                element.classList.add('c-border-glow-grey');
            }
        });
        element === null || element === void 0 ? void 0 : element.addEventListener('mouseleave', function () {
            if (healthCheckClass.contains('statusAlive')) {
                element.classList.remove('c-border-glow-green');
            }
            else if (healthCheckClass.contains('statusDead')) {
                element.classList.remove('c-border-glow-red');
            }
            else if (healthCheckClass.contains('statusUnknown')) {
                element.classList.remove('c-border-glow-grey');
            }
        });
    });
}
// Change border and status colors
function changeModalAllColors(result) {
    var modalHeatlhStatus = (document.querySelector('.modalHealthStatus'));
    var insideImg = document.querySelector('.insideImg');
    if (result.status === 'Alive') {
        insideImg.classList.add('c-border-glow-green');
        modalHeatlhStatus.classList.add('statusAlive');
    }
    else if (result.status === 'Dead') {
        insideImg.classList.add('c-border-glow-red');
        modalHeatlhStatus.classList.add('statusDead');
    }
    else if (result.status === 'unknown') {
        insideImg.classList.add('c-border-glow-grey');
        modalHeatlhStatus.classList.add('statusUnknown');
    }
}
