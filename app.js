import { auth, signOut, db } from "./firebase.js";
import {
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");
const openSettings = document.getElementById("openSettings");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const toastContainer = document.getElementById("toastContainer");

let user = null;

// Load settings
let settings = {
  autoClear: true,
  confirmDelete: false,
  theme: "neon"
};

function loadSettings() {
  const saved = localStorage.getItem("nv-settings");
  if (saved) settings = JSON.parse(saved);
}
loadSettings();

// Toast system
function toast(msg, type = "info") {
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = msg;
  toastContainer.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// Auth state
auth.onAuthStateChanged((u) => {
  if (!u) return (window.location.href = "login.html");
  user = u;
  loadNotes();
});

// Logout
logoutBtn.onclick = () => signOut(auth);

// Open settings modal
openSettings.onclick = async () => {
  const html = await fetch("settings.html").then(r => r.text());
  modalContent.innerHTML = html;
  modal.classList.remove("hidden");
};

// Close modal on backdrop click
modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

// Notes
const addNoteBtn = document.getElementById("addNoteBtn");
const newNote = document.getElementById("newNote");
const notesContainer = document.getElementById("notesContainer");

addNoteBtn.onclick = async () => {
  if (!newNote.value.trim()) return toast("Note is empty", "error");

  await addDoc(collection(db, "users", user.uid, "notes"), {
    text: newNote.value,
    created: Date.now()
  });

  toast("Note added");

  if (settings.autoClear) newNote.value = "";
};

function loadNotes() {
  const q = query(
    collection(db, "users", user.uid, "notes"),
    orderBy("created", "desc")
  );

  onSnapshot(q, (snapshot) => {
    notesContainer.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "note";

      div.innerHTML = `
        <span contenteditable="true" class="note-text">${data.text}</span>
        <div class="note-actions">
          <button class="nv-btn primary editBtn" data-id="${docSnap.id}">Save</button>
          <button class="nv-btn danger deleteBtn" data-id="${docSnap.id}">Delete</button>
        </div>
      `;

      notesContainer.appendChild(div);
    });

    // Edit
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        const text = btn.parentElement.parentElement.querySelector(".note-text").textContent;

        await updateDoc(doc(db, "users", user.uid, "notes", id), { text });
        toast("Note updated");
      };
    });

    // Delete
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.onclick = async () => {
        if (settings.confirmDelete) {
          if (!confirm("Delete this note?")) return;
        }

        await deleteDoc(doc(db, "users", user.uid, "notes", btn.dataset.id));
        toast("Note deleted");
      };
    });
  });
}
