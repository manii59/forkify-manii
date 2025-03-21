import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    render(data, render = true) {
      if (!data || (Array.isArray(data) && data.length === 0)) 
        return this.renderError()

      this._data = data;
      const markup = this._generateMarkup()

      if (!render) return markup;

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup)
    }

    _clear() {
      this._parentElement.innerHTML = '';
    }

    update(data) {
      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup);
      const newElement = Array.from(newDOM.querySelectorAll('*'));
      const curElement = Array.from(this._parentElement.querySelectorAll('*'));
     

      // Update Text 
      newElement.forEach((newEl, i) => {
        const curEl = curElement[i];

        if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') 
          curEl.textContent = newEl.textContent;

        
      //Update attributes
        if (!newEl.isEqualNode(curEl)) 
          Array.from(newEl.attributes).forEach(attr => 
            curEl.setAttribute(attr.name, attr.value)    
        );
      })

      
    }


    renderSpinner(){
      const markUp = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp)
    }

    renderError(message = this._errorMessage) {
      const markUp = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
          `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

    renderMessage(message = this._message) {
      const markUp = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }
    
       
    
}