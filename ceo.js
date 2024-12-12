import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOkJP8oimGChOhcKmyGU-PepgHlKMLZeI",
  authDomain: "ceo-database-7aebb.firebaseapp.com",
  projectId: "ceo-database-7aebb",
  storageBucket: "ceo-database-7aebb.firebasestorage.app",
  messagingSenderId: "624837365691",
  appId: "1:624837365691:web:7dfdfe1cfc7a7696407e9e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveOrUpdateCEOAndDomain(
  inputText,
  collectionName = "savedData"
) {
  try {
    showNotification(
      "Please wait while the data is saving. only takes a few minute",
      "loading"
    );
    const lines = inputText.split("\n");

    for (let i = 0; i < lines.length; i += 2) {
      const ceoLine = lines[i].trim();
      const emailLine = lines[i + 1]?.trim();

      if (!ceoLine || !emailLine || !emailLine.includes("@")) {
        continue;
      }

      const ceoNames = ceoLine; // The CEO names
      const email = emailLine.split(" ").find((word) => word.includes("@")); // Extract email
      const domain = email.split("@")[1]; // Extract domain

      const docRef = doc(db, collectionName, domain);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(docRef, { ceoNames, domain }, { merge: true });
        console.log(`Updated domain ${domain} with new names: ${ceoNames}`);
      } else {
        await setDoc(docRef, { ceoNames, domain });
        console.log(`Saved new domain ${domain} with names: ${ceoNames}`);
      }
    }

    showNotification(
      "Data saved successfully! Thank you for Updating me",
      "success"
    );
    clearInputField();
  } catch (error) {
    console.error("Error saving or updating data:", error);
    showNotification(`Error: ${error.message}`, "error");
  }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");

  // Set the message content
  notification.textContent = message;

  // Reset classes before adding new ones
  notification.classList.remove("success", "error", "loading");
  notification.classList.add(type);

  // Make notification visible
  notification.classList.remove("hidden");

  if (type !== "loading") {
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 5000);
  }
}

function clearInputField() {
  document.getElementById("domain").value = "";
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const inputText = document.getElementById("domain").value.trim();

  if (!inputText) {
    showNotification("Input cannot be empty!", "error");
    return;
  }

  saveOrUpdateCEOAndDomain(inputText);
});

