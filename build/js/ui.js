"use strict";
var output = '';
var modalPlace = document.querySelector('.modal-place');
var modalContainer = (document.getElementById('modal-container'));
var mainContainer = document.getElementById('main-container');
var container = document.querySelector('.post-container');
var charContainer = (document.querySelector('.charInfoDisplay'));
var searchContainer = (document.getElementById('search-container'));
var form = document.getElementById('form');
var filterForm = document.querySelector('.filterForm');
var loader = document.querySelector('.loader');
var apiPreload = document.getElementById('apiPreload');
var pageName = document.querySelector('.page-name');
var searchingText = document.querySelector('.searchingText');
var UI = /** @class */ (function () {
    function UI() {
    }
    UI.prototype.showCharacters = function (characters) {
        characters.forEach(function (character) {
            output = "\n      <div class=\"col-12 col-lg-5 d-flex oneProfileDiv\" id=\"one-profile\">\n        <div class=\"col-4\" id=\"c-image-container\">\n          <img src=\"" + character.image + "\" alt=\"\" class=\"img-fluid\" id=\"c-image\" />\n          <h5>Status: <span class=\"healthCheck\">" + character.status + "</span></h5>\n        </div>\n        <div class=\"col-8\" id=\"c-info-container\">\n          <ul class=\"list-group\">\n            <li class=\"list-group-item\" id=\"c-name\">Name: " + character.name + "</li>\n            <li class=\"list-group-item\" id=\"c-species\">Specie: " + character.species + "</li>\n            <li class=\"list-group-item\" id=\"c-lastseen\">Last time seen: " + character.location.name + "</li>\n            <li class=\"list-group-item url-hidden\" id=\"c-id\">" + character.id + "</li>\n            </ul>\n        </div>\n      </div>\n      ";
            container === null || container === void 0 ? void 0 : container.insertAdjacentHTML('beforeend', output);
        });
        loader.classList.remove('show-loader');
    };
    UI.prototype.showCharacterModal = function (result) {
        output = "\n    <div class=\"ml-auto mr-3 mt-2 closeBtn\"\n    ><i class=\"fas fa-times\"></i\n    ></div>\n    <h3 class=\"modalName\">" + result.name + "</h3>\n    <img\n      src=\"" + result.image + "\"\n      alt=\"\"\n      class=\"img-fluid insideImg\"\n      id=\"c-image\"\n    />\n    <ul class=\"list-group\">\n      <li class=\"list-group-item\" id=\"c-species\">Specie: " + result.species + "</li>\n      <li class=\"list-group-item\" id=\"c-gender\">Gender: " + result.gender + "</li>\n      <li class=\"list-group-item\" id=\"c-location\">\n        First time seen: " + result.origin.name + "\n      </li>\n      <li class=\"list-group-item\" id=\"c-lastseen\">Last time seen: " + result.location.name + "</li>\n      <li class=\"list-group-item\" id=\"c-status\">\n        Status: <span class=\"modalHealthStatus\"><h5>" + result.status + "</h5></span>\n      </li>\n    </ul>\n    ";
        charContainer === null || charContainer === void 0 ? void 0 : charContainer.insertAdjacentHTML('beforeend', output);
        modalContainer.style.display = 'inline';
    };
    UI.prototype.clearCharacterModal = function () {
        charContainer.innerHTML = '';
    };
    return UI;
}());
