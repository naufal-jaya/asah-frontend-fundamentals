import { notesData } from './notes-data.js';
import './notes-item.js';
import './note-form.js';


//input alert
const inputTitle = document.querySelector('#title-input');
const maxTitle = parseInt(inputTitle.getAttribute('maxlength'), 10);
const inputNotes = document.querySelector('#notes-input');
const maxNotes = parseInt(inputNotes.getAttribute('maxlength'), 10);


inputTitle.addEventListener('input', () => {
  const existingAlert = document.getElementById('titleAlert');
  if (inputTitle.value.length === maxTitle && !existingAlert) {
    const alert = document.createElement('p');
    alert.innerText = 'Sudah penuh bro';
    alert.id = 'titleAlert';
    inputTitle.insertAdjacentElement('afterend', alert);
  } else if (inputTitle.value.length !== maxTitle && existingAlert) {
    existingAlert.remove();
  }
});

inputNotes.addEventListener('input', () => {
  const existingAlert = document.getElementById('notesAlert');
  if (inputNotes.value.length === maxNotes && !existingAlert) {
    const alert = document.createElement('p');
    alert.innerText = 'Sudah penuh bro';
    alert.id = 'notesAlert';
    inputNotes.insertAdjacentElement('afterend', alert);
  } else if (inputNotes.value.length !== maxNotes && existingAlert) {
    existingAlert.remove();
  }
});


//submit form
const inputForm = document.querySelector('form');

inputForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const newNote = {
    id: `notes-${Date.now()}`,
    title: inputTitle.value,
    body: inputNotes.value,
    createdAt: new Date().toISOString(),
    archived: false,
  };
  console.log(newNote);
  console.log(notesData);
  
  notesData.push(newNote);
  inputNotes.value = '';
  inputTitle.value = '';

  activeContainer.innerHTML = '<h2>Daftar notessss</h2>';
  archivedContainer.innerHTML = '<h2>Daftar notes ga kepake :)</h2>';
  notesUpdate();
});

const activeContainer = document.querySelector('#notes-list');
const archivedContainer =  document.querySelector('#archived-notes');

notesUpdate();

//note render
function notesUpdate() {

  notesData.forEach(note => {
    const item = document.createElement('note-item');
    item.note = note; 

    if (note.archived) {
      archivedContainer.appendChild(item);
    } else {
      activeContainer.appendChild(item);
    }
  });

  if(!archivedContainer.querySelector('note-item')) {
      const noArchive = document.createElement('p');
      noArchive.innerText = 'Belum ada notes yang di-Archive!';
      archivedContainer.appendChild(noArchive);
  }
}

document.body.addEventListener('archive-note', (event) => {
  const noteId = event.detail.id;
  const note = notesData.find(n => n.id === noteId);
  if (note) {
    note.archived = !note.archived; 
    activeContainer.innerHTML = '<h2>Daftar notessss</h2>';
    archivedContainer.innerHTML = '<h2>Daftar notes ga kepake :)</h2>';
    notesUpdate();
  }
});

document.body.addEventListener('delete-note', (event) => {
  const noteId = event.detail.id;
  const index = notesData.findIndex(n => n.id === noteId);
  if (index !== -1) {
    notesData.splice(index, 1); 
    refreshNotes();
  }
});


