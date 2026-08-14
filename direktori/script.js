import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, setDoc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY2JOM_GK_c8MIKOOROjG61XtC-VxF3Gc",
  authDomain: "laundry-directory-1915d.firebaseapp.com",
  projectId: "laundry-directory-1915d",
  storageBucket: "laundry-directory-1915d.appspot.com",
  messagingSenderId: "336437234560",
  appId: "1:336437234560:web:69dc7cbb36704c9f614f65"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// FUNGSI GETBASEPATH() PORTABLE UNTUK GITHUB PAGES / LOCAL
export function getBasePath() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  if (window.location.hostname.includes('github.io') && segments.length > 0) {
    return '/' + segments[0];
  }
  return '';
}

export function createSlug(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
}

export function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3500);
}

// RENDER IKLAN BANNER DINAMIS
export async function renderAds() {
  try {
    const snap = await getDocs(collection(db, "advertisements"));
    const ads = [];
    snap.forEach(d => ads.push({ id: d.id, ...d.data() }));

    const slotMainTop = document.getElementById("ad-slot-main-top");
    const slotMainBottom = document.getElementById("ad-slot-main-bottom");
    const slotDetailTop = document.getElementById("ad-slot-detail-top");
    const slotDetailBottom = document.getElementById("ad-slot-detail-bottom");

    if (slotMainTop) slotMainTop.innerHTML = "";
    if (slotMainBottom) slotMainBottom.innerHTML = "";
    if (slotDetailTop) slotDetailTop.innerHTML = "";
    if (slotDetailBottom) slotDetailBottom.innerHTML = "";

    ads.forEach(ad => {
      if (!ad.imageUrl || !ad.linkUrl) return;
      const adHtml = `<a href="${ad.linkUrl}" target="_blank" class="ad-banner-link"><img src="${ad.imageUrl}" class="ad-banner-img" alt="Iklan Banner"></a>`;
      if (ad.placement === 'main_top' && slotMainTop) slotMainTop.innerHTML = adHtml;
      if (ad.placement === 'main_bottom' && slotMainBottom) slotMainBottom.innerHTML = adHtml;
      if (ad.placement === 'detail_top' && slotDetailTop) slotDetailTop.innerHTML = adHtml;
      if (ad.placement === 'detail_bottom' && slotDetailBottom) slotDetailBottom.innerHTML = adHtml;
    });
  } catch (err) {
    console.error("Ad render error:", err);
  }
}

// SETUP DOM GLOBAL & DARK MODE
document.addEventListener("DOMContentLoaded", () => {
  renderAds();

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.innerText = new Date().getFullYear();

  const darkToggle = document.getElementById("dark-mode-toggle");
  if (darkToggle) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      darkToggle.innerText = "☀️ Mode Terang";
    }
    darkToggle.onclick = () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      darkToggle.innerText = isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap";
    };
  }
});
