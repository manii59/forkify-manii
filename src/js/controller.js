
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { loadRecipe } from './model';
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';
import bookmarks from './views/bookmarks.js';
import { MODEL_CLOSE_FORM } from './config.js';


////////////////////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function() {
    try {
    
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();

    //0 Update selected results view
    resultsView.update(model.getSearchResultsPage());
    bookmarks.update(model.state.bookmarks);

    // 1) Loading Recipe

      await model.loadRecipe(id);

    // 2) Rendring Recipe
      recipeView.render(model.state.recipe); 

    } catch (err) {
        // alert(err)
        recipeView.renderError();
    }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get Query Search
    const query = searchView.getQuery();
    if(!query) return;

    // 2. Load Search Results
    await model.loadSearchResults(query);

    // 3. Render Search Results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render inital pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }
}

const controlPaginationView = function(goToPage) {
      // 1. Render Search Results
      resultsView.render(model.getSearchResultsPage(goToPage));

      // 2. Render inital pagination buttons
      paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
    model.updateServings(newServings);  

  // Update the recipe view
    recipeView.update(model.state.recipe); 
}

const controlBookmarks = function(recipe) {
  // Add and Delete a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  // Update bookmark
  recipeView.update(model.state.recipe);

  // Render Bookmark
  bookmarks.render(model.state.bookmarks);
}

const bookmarkRender = function() {
  bookmarks.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading Spinner
    addRecipeView.renderSpinner();

  //Upload new Recipe
  await model.uploadNewRecipe(newRecipe);
  console.log(model.state.recipe);

  // Render New Recipe
  recipeView.render(model.state.recipe);

  //Success Message 
  addRecipeView.renderMessage();

  // Render bookmarkView
  bookmarks.render(model.state.bookmarks);

  // CHnage ID in the url
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  // Timeout for close form window
  setTimeout(function() {
    addRecipeView.toggleWindow()
  }, MODEL_CLOSE_FORM * 1000)

  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message)
  }
};

const newFunction = function() {
  console.log('Welcome to Application');
}

const init = function() {
  bookmarks.addRenderBookmark(bookmarkRender);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addClickHandler(controlPaginationView);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFunction();
}

init();



