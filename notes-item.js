class NoteItem extends HTMLElement {
  constructor() {
    super();
    this._note = null;
  }

  set note(data) {
    this._note = data;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._note) return;
    this.setAttribute('data-archived', this._note.archived);
    this.innerHTML = `
      <div class="note">
        <h2>${this._note.title}</h2>
        <p>${this._note.body}</p>
        <p><strong>Tanggal:</strong> ${new Date(this._note.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> ${this._note.archived ? 'Diarsipkan' : 'Aktif'}</p>
        <div class="actions">
          <button class="archive-btn"><img src="icons/archive.png" alt="archive"></button>
          <button class="delete-btn"><img src="icons/delete.png" alt="delete"></button>
        </div>
      </div>
    `;
    this.querySelector('.archive-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('archive-note', {
        detail: { id: this._note.id },
        bubbles: true,
      }));
    });
    this.querySelector('.delete-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('delete-note', {
        detail: { id: this._note.id },
        bubbles: true,
      }));
    });
  }
}

customElements.define('note-item', NoteItem);






