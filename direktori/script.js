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

// TOAST HELPER
export function showToast(msg, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.className = `toast ${type}`;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3500);
}

// RENDER ADS DINAMIS DI HALAMAN UTAMA ATAU DETAIL
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

      const adHtml = `
        <a href="${ad.linkUrl}" target="_blank" class="ad-banner-link">
          <img src="${ad.imageUrl}" class="ad-banner-img" alt="Iklan Banner">
        </a>
      `;

      if (ad.placement === 'main_top' && slotMainTop) slotMainTop.innerHTML = adHtml;
      if (ad.placement === 'main_bottom' && slotMainBottom) slotMainBottom.innerHTML = adHtml;
      if (ad.placement === 'detail_top' && slotDetailTop) slotDetailTop.innerHTML = adHtml;
      if (ad.placement === 'detail_bottom' && slotDetailBottom) slotDetailBottom.innerHTML = adHtml;
    });
  } catch (err) {
    console.error("Ad render error:", err);
  }
}

// LOGIKA HALAMAN UTAMA (INDEX.HTML & 404.HTML)
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

  // --- LOGIKA HALAMAN ADMIN PANEL ---
  const adModal = document.getElementById("ad-modal");
  const openAdBtn = document.getElementById("open-ad-modal-btn");
  const closeAdBtn = document.getElementById("close-ad-modal-btn");
  const adForm = document.getElementById("add-ad-form");

  if (openAdBtn && adModal) {
    openAdBtn.onclick = () => {
      document.getElementById("ad-modal-title").innerText = "Tambah Iklan Baru";
      adForm.reset();
      document.getElementById("ad-id").value = "";
      adModal.classList.add("active");
    };

    if (closeAdBtn) closeAdBtn.onclick = () => adModal.classList.remove("active");

    adForm.onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById("ad-id").value;
      const imageUrl = document.getElementById("ad-image-url").value.trim();
      const linkUrl = document.getElementById("ad-target-url").value.trim();
      const placement = document.getElementById("ad-placement").value;

      try {
        if (id) {
          await updateDoc(doc(db, "advertisements", id), { imageUrl, linkUrl, placement, updatedAt: serverTimestamp() });
          showToast("Iklan berhasil diperbarui!", "success");
        } else {
          await addDoc(collection(db, "advertisements"), { imageUrl, linkUrl, placement, createdAt: serverTimestamp() });
          showToast("Iklan baru berhasil ditambahkan!", "success");
        }
        adModal.classList.remove("active");
        loadAdminAds();
        renderAds();
      } catch (err) {
        showToast("Gagal menyimpan iklan: " + err.message, "error");
      }
    };

    loadAdminAds();
  }
});

// LOGIKA ADMIN MANAJEMEN IKLAN (CRUD)
async function loadAdminAds() {
  const wrapper = document.getElementById("ads-cards-wrapper");
  if (!wrapper) return;

  try {
    const snap = await getDocs(collection(db, "advertisements"));
    wrapper.innerHTML = "";

    if (snap.empty) {
      wrapper.innerHTML = "<div>Belum ada materi iklan. Tambahkan iklan baru.</div>";
      return;
    }

    snap.forEach(d => {
      const ad = { id: d.id, ...d.data() };
      let placementText = "Halaman Utama - Top";
      if (ad.placement === 'main_bottom') placementText = "Halaman Utama - Bottom";
      if (ad.placement === 'detail_top') placementText = "Halaman Detail - Top";
      if (ad.placement === 'detail_bottom') placementText = "Halaman Detail - Bottom";

      const card = document.createElement("div");
      card.className = "admin-item-card";
      card.innerHTML = `
        <div class="admin-item-header">
          <strong style="color:var(--primary);">${placementText}</strong>
          <span class="badge badge-active">Aktif</span>
        </div>
        <img src="${ad.imageUrl}" style="width:100%; height:80px; object-fit:cover; border-radius:4px;" alt="Banner">
        <div><small>Link Tujuan:</small> <a href="${ad.linkUrl}" target="_blank">${ad.linkUrl}</a></div>
        <div class="admin-item-actions">
          <button class="btn btn-primary" id="edit-ad-${ad.id}">Edit Iklan</button>
          <button class="btn btn-danger" id="del-ad-${ad.id}">Hapus Iklan</button>
        </div>
      `;
      wrapper.appendChild(card);

      setTimeout(() => {
        document.getElementById(`edit-ad-${ad.id}`).onclick = () => {
          document.getElementById("ad-modal-title").innerText = "Edit Iklan";
          document.getElementById("ad-id").value = ad.id;
          document.getElementById("ad-image-url").value = ad.imageUrl;
          document.getElementById("ad-target-url").value = ad.linkUrl;
          document.getElementById("ad-placement").value = ad.placement;
          document.getElementById("ad-modal").classList.add("active");
        };

        document.getElementById(`del-ad-${ad.id}`).onclick = async () => {
          await deleteDoc(doc(db, "advertisements", ad.id));
          showToast("Iklan berhasil dihapus!", "success");
          loadAdminAds();
          renderAds();
        };
      }, 0);
    });
  } catch (err) {
    console.error("Load ads error:", err);
  }
}
