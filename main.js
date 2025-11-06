import './notes-item.js';
import './note-form.js';
import './footer.js'; 

let notesData = []; 

const API_BASE_URL = 'https://notes-api.dicoding.dev/v2/notes';


async function fetchNotes() {
    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const responseJson = await response.json();
        
        if (responseJson.status !== 'success') {
            throw new Error(`API Error: ${responseJson.message}`);
        }

      
        return responseJson.data; 

    } catch (error) {
        console.error("Gagal mengambil data catatan dari API:", error.massage);
        
        return []; 
    }
}

async function archiveAPI(noteId, archiveStatus) {
    const action = archiveStatus ? 'archive' : 'unarchive';
    const API_URL = `${API_BASE_URL}/${noteId}/${action}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(`API Error: ${responseJson.message}`);
        }

        console.log(`Catatan ${noteId} berhasil di-${action}.`);
        return true;
    } catch (error) {
        console.error(`Gagal melakukan aksi ${action}:`, error);
        return false;
    }
}

async function deleteNoteFromAPI(noteId) {
    const DELETE_URL = `${API_BASE_URL}/${noteId}`;
    try {
        const response = await fetch(DELETE_URL, { method: 'DELETE' });

        // 1. Sukses jika status 200-204
        if (response.ok) { 
            // Cek apakah ada body yang perlu di-parse (hanya jika status BUKAN 204)
            if (response.status === 204) {
                console.log(`Catatan ${noteId} berhasil dihapus (Status 204 No Content).`);
                return true; 
            }
            
            // Lanjutkan parsing JSON hanya jika ada body (e.g., status 200)
            const responseJson = await response.json();
            
            if (responseJson.status !== 'success') {
                throw new Error(`API Error: ${responseJson.message}`);
            }
            return true;
        } else {
            // Status 4xx atau 5xx
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Gagal menghapus catatan:", error);
        alert(`Gagal menghapus catatan: ${error.message}`);
        return false;
    }
}

async function addNoteToAPI(note) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(`API Error: ${responseJson.message}`);
        }
        
        console.log("Catatan baru berhasil dikirim ke API:", responseJson.message);
        return true;

    } catch (error) {
        console.error("Gagal mengirim catatan baru:", error);
        alert(`Gagal membuat catatan: ${error.message}`);
        return false;
    }
}


// ==========================================================
// 3. LOGIKA FORM SUBMIT (DIGANTI DARI LOKAL KE API)
// ==========================================================

const inputTitle = document.querySelector('#title-input');
const inputNotes = document.querySelector('#notes-input');
// ... (Logika input alert tetap sama) ...

const inputForm = document.querySelector('form');

inputForm.addEventListener('submit', async (event) => { // Fungsi diubah menjadi async
    event.preventDefault(); 

    const newNote = {
        title: inputTitle.value,
        body: inputNotes.value,
    };

    // Kirim data ke API
    const success = await addNoteToAPI(newNote); 
    
    if (success) {
        // Jika berhasil, muat ulang (refresh) data dari API
        inputNotes.value = '';
        inputTitle.value = '';
        await refreshNotes(); // Muat ulang data
    }
});


// ==========================================================
// 4. LOGIKA RENDERING & INIT APLIKASI
// ==========================================================

const activeContainer = document.querySelector('#notes-list');
const archivedContainer = document.querySelector('#archived-notes');

function notesUpdate() {
    // Kosongkan kontainer sebelum render
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
    // Ambil data terbaru dari API dan render ulang
    notesData = await fetchNotes(); 
    console.log("Data Notes setelah Archive/Refresh:", notesData);
    notesUpdate();
}

// Inisialisasi Aplikasi (Memanggil data pertama kali)
refreshNotes();


// ... (Logika archive dan delete event listener tetap sama) ... 
// CATATAN: Fungsi archive dan delete Anda saat ini masih memanipulasi notesData lokal. 
// Untuk integrasi penuh API, Anda harus mengganti logika ini dengan FETCH (PUT/DELETE) ke API juga.

document.body.addEventListener('archive-note', async (event) => {
    const noteId = event.detail.id;
    const note = notesData.find(note => note.id === noteId);

    if (note) {
        const targetStatus = !note.archived; 
        const actionText = targetStatus ? 'mengarsip' : 'mengaktifkan';

        const success = await archiveAPI(noteId, targetStatus); 

        if (success) {
            console.log("Archive berhasil, tapi tidak me-refresh.");
            await refreshNotes();
        } else {
            alert(`Gagal ${actionText} catatan.`);
        }
    }
});

document.body.addEventListener('delete-note', async (event) => {
    const noteId = event.detail.id;
    const success = await deleteNoteFromAPI(noteId); 
        
    if (success) {
        await refreshNotes(); 
    }
});