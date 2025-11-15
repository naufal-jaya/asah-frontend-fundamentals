import './notes-item.js';
import './note-form.js';
import './footer.js'; 
import './icons/archive.png';
import './icons/delete.png';
import './styles.css';



let notesData = []; 
const API_BASE_URL = 'https://notes-api.dicoding.dev/v2/notes';

async function fetchNotes() {
    try {
        const activeRes = await fetch(`${API_BASE_URL}`);
        const archivedRes = await fetch(`${API_BASE_URL}/archived`);

        if (!activeRes.ok || !archivedRes.ok) {
            throw new Error("Gagal menghubungi server, coba lagi nanti.");
        }

        const activeJson = await activeRes.json();
        const archivedJson = await archivedRes.json();

        return {
            active: activeJson.data,
            archived: archivedJson.data
        };

    } catch (error) {
        console.error("Fetch error:", error.message);
        showError("Gagal mengambil data catatan.");
        return { active: [], archived: [] };
    }
}


async function archiveAPI(noteId, archiveStatus) {
    const action = archiveStatus ? 'archive' : 'unarchive';
    const API_URL = `${API_BASE_URL}/${noteId}/${action}`;

    try {
        const response = await fetch(API_URL, { method: 'POST' });

        if (!response.ok) {
            throw new Error(`Gagal ${action} (status ${response.status})`);
        }

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }

        return true;

    } catch (error) {
        console.error("Archive error:", error);
        showError(`Gagal ${action} catatan: ${error.message}`);
        return false;
    }
}


async function deleteNoteFromAPI(noteId) {
    const DELETE_URL = `${API_BASE_URL}/${noteId}`;

    try {
        const response = await fetch(DELETE_URL, { method: 'DELETE' });

        if (response.ok) { 
            if (response.status === 204) return true;

            const responseJson = await response.json();
            if (responseJson.status !== 'success') {
                throw new Error(responseJson.message);
            }

            return true;
        } 
        
        throw new Error(`HTTP ${response.status}`);

    } catch (error) {
        console.error("Delete error:", error);
        showError(`Gagal menghapus catatan: ${error.message}`);
        return false;
    }
}


async function addNoteToAPI(note) {
    showLoading();
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(note),
        });

        if (!response.ok) {
            throw new Error(`Gagal membuat catatan (status ${response.status})`);
        }

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }

        return true;

    } catch (error) {
        console.error("Add error:", error);
        showError(error.message);
        return false;

    } finally {
        hideLoading();
    }
}


const inputTitle = document.querySelector('#title-input');
const inputNotes = document.querySelector('#notes-input');
const inputForm = document.querySelector('form');

inputForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const newNote = {
        title: inputTitle.value,
        body: inputNotes.value,
    };

    const success = await addNoteToAPI(newNote); 
    
    if (success) {
    await refreshNotes();
    hideLoading();
    } else {
        hideLoading();
        showError(`Gagal ${actionText} catatan.`);
    }

});

const activeContainer = document.querySelector('#notes-list');
const archivedContainer = document.querySelector('#archived-notes');

function notesUpdate() {
    activeContainer.innerHTML = '<h2>Daftar notessss</h2>';
    archivedContainer.innerHTML = '<h2>Daftar notes ga kepake :)</h2>';

    notesData.forEach(note => {
        const item = document.createElement('note-item');
        item.note = note;

        if (note.archived) {
            archivedContainer.appendChild(item);
        } else {
            activeContainer.appendChild(item);
        }
    });

    if (!archivedContainer.querySelector('note-item')) {
        const noArchive = document.createElement('p');
        noArchive.innerText = 'Belum ada notes yang di-Archive!';
        archivedContainer.appendChild(noArchive);
    }
}

async function refreshNotes() {
    showLoading();
    const { active, archived } = await fetchNotes();
    hideLoading();

    const activeNotes = active.map(n => ({
        ...n, archived: false
    }));

    const archivedNotes = archived.map(n => ({
        ...n, archived: true
    }));

    notesData = [...activeNotes, ...archivedNotes];

    notesUpdate();
}


refreshNotes();

document.body.addEventListener('archive-note', async (event) => {
    const noteId = event.detail.id;
    const note = notesData.find(note => note.id == noteId);

    showLoading();

    if (note) {
        const targetStatus = !note.archived;

        const success = await archiveAPI(noteId, targetStatus);

        if (success) {
            const item = document.querySelector(`note-item[data-id="${noteId}"]`);
            if (item) item.classList.add('moving');

            await refreshNotes();
        } else {
            showError(`Gagal mengupdate status catatan.`);
        }

        hideLoading();
    }
});


document.body.addEventListener('delete-note', async (event) => {
    const noteId = event.detail.id;
    const success = await deleteNoteFromAPI(noteId); 
        
    if (success) {
        await refreshNotes(); 
    }
});



function showLoading() {
    document.getElementById('loading-container').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-container').style.display = 'none';
}

function showError(message) {
    alert("❌ Terjadi kesalahan:\n" + message);
}

