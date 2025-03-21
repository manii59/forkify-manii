import previewView from "./previewView";
import View from "./view";

class BookmarkView extends View {
    _parentElement = document.querySelector('.bookmarks');
    _errorMessage = 'No Bookmarks yet! Find a nice recipe and bookmark it;)';
    _message = '';

    addRenderBookmark(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');  
    }

}

export default new BookmarkView(); 