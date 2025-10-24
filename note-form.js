class NoteForm extends HTMLElement {
  static get observedAttributes() {
    return ['max-title-length', 'max-body-length'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }


  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    if (this.isConnected) this.render();
  }

  render() {
    const maxTitle = this.getAttribute('max-title-length') || '';
    const maxBody = this.getAttribute('max-body-length') || '';

    this.innerHTML = `
      <form>         
        <div id="titleInputWrapper">
        <label for="title-input"><strong>Title</strong> maks. 30</label>   
        <input 
          type="text" 
          required 
          id="title-input" 
          ${maxTitle ? `maxlength="${maxTitle}"` : ''}>
        </div>
        
        <div id="notesInputWrapper">
        <label for="notes-input"><strong>Your note</strong> maks. 100</label> 
        <textarea 
          required 
          id="notes-input" 
          ${maxBody ? `maxlength="${maxBody}"` : ''}></textarea> 
        </div>
        
        <button type="submit">Submit</button>
      </form>
    `;

  }
}

customElements.define('note-form', NoteForm);
