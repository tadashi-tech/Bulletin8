
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// 1. CONFIGURATION FIREBASE
// Remplace les valeurs par celles de TON projet.

const firebaseConfig = {
  apiKey: "AIzaSyCcnpx9zSzzc4z4bQcgpbV2PgvtWfuGM10",
  authDomain: "site-explorium.firebaseapp.com",
  projectId: "site-explorium",
  storageBucket: "site-explorium.firebasestorage.app",
  messagingSenderId: "567562805780",
  appId: "1:567562805780:web:1c0c2e5dde9d12d94cfd01"
};

// 2. INITIALISATION

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. ELEMENTS HTML

const form = document.getElementById("registrationForm");

const subjectsError = document.getElementById("subjectsError");

const subjects = document.querySelectorAll(
  'input[name="subjects"]'
);

const remark = document.getElementById("remark");
const charCount = document.getElementById("charCount");

const successMessage = document.getElementById("successMessage");
const editButton = document.getElementById("editButton");

const submitButton = form.querySelector(
  'button[type="submit"]'
);

document.getElementById("year").textContent =
  new Date().getFullYear();

// 4. VERIFICATION DES MATIERES

function checkSubjects() {
  const selected = Array.from(subjects).some(
    subject => subject.checked
  );

  subjectsError.textContent = selected
    ? ""
    : "Choisis au moins une matière.";

  return selected;
}

subjects.forEach(subject => {
  subject.addEventListener("change", checkSubjects);
});

// 5. COMPTEUR DE CARACTERES

remark.addEventListener("input", function () {
  charCount.textContent =
    remark.value.length + " / 500";
});

// 6. ENREGISTREMENT DANS FIREBASE

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.reportValidity()) return;

  if (!checkSubjects()) {
    subjectsError.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    return;
  }

  const data = {
    fullname: document.getElementById("fullname").value.trim(),
    age: Number(document.getElementById("age").value),
    class: document.getElementById("class").value,
    subjects: Array.from(subjects)
      .filter(subject => subject.checked)
      .map(subject => subject.value),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    remark: remark.value.trim(),
    createdAt: serverTimestamp()
  };

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Enregistrement...";

    await addDoc(
      collection(db, "inscriptions"),
      data
    );

    form.hidden = true;
    successMessage.hidden = false;

    successMessage.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  } catch (error) {
    console.error("Erreur Firebase :", error);

    alert(
      "Impossible d'enregistrer ton inscription. Vérifie ta connexion et réessaie."
    );

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Envoyer mon inscription";
  }
});

// 7. REVENIR AU FORMULAIRE

editButton.addEventListener("click", function () {
  successMessage.hidden = true;
  form.hidden = false;

  document.getElementById("fullname").focus();
});
