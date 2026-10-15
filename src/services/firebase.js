import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// Konfigurasi Firebase dari Environment Variables atau Fallback ke Proyek app2-dapur-nia
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBHZeVmetduQGgJ06TovkeczpTfaz9prnM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "app2-dapur-nia.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "app2-dapur-nia",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "app2-dapur-nia.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "371065882577",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:371065882577:web:ac4c3969e4dda7c89982f0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CEF826X1FF",
};

// Inisialisasi Firebase App, Firestore, & Auth
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Fungsi Otentikasi Pengguna (Praktik 2: Halaman Masuk Dapur Nia)
 */
export async function masukDenganEmail(email, password) {
  return await signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function daftarDenganEmail(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && displayName.trim()) {
    try {
      await updateProfile(userCredential.user, { displayName: displayName.trim() });
    } catch (profileError) {
      console.warn("Gagal memperbarui nama profil:", profileError);
    }
  }
  return userCredential;
}

export async function keluarAplikasi() {
  return await signOut(auth);
}

export function pantauStatusAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Nama koleksi sesuai Skema-Firestore-Dapur-Nia.md (Wajib huruf kecil, bentuk tunggal)
export const KOLEKSI_MENU = "menu";

/**
 * 1. Fungsi READ (Ambil seluruh daftar menu dari Firestore)
 */
export async function getDaftarMenu() {
  const menuRef = collection(db, KOLEKSI_MENU);
  const q = query(menuRef, orderBy("dibuat_pada", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * 1b. Fungsi READ Real-time Listener (onSnapshot)
 */
export function listenDaftarMenu(onSuccess, onError) {
  const menuRef = collection(db, KOLEKSI_MENU);
  const q = query(menuRef, orderBy("dibuat_pada", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      onSuccess(items);
    },
    (error) => {
      console.error("Gagal membaca Firestore:", error);
      if (onError) onError(error);
    }
  );
}

/**
 * 2. Fungsi CREATE (Tambah satu dokumen menu baru ke Firestore)
 * Sesuai skema: nama (string), harga (number), sisa_porsi (number), tersedia (boolean), dibuat_pada (serverTimestamp)
 */
export async function tambahMenuFirestore({ nama, harga, sisa_porsi, tersedia = true }) {
  const menuRef = collection(db, KOLEKSI_MENU);
  const docRef = await addDoc(menuRef, {
    nama: nama.trim(),
    harga: Number(harga),
    sisa_porsi: Number(sisa_porsi),
    tersedia: Boolean(tersedia),
    dibuat_pada: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * 3. Fungsi UPDATE (Ubah dokumen menu di Firestore)
 */
export async function ubahMenuFirestore(id, { nama, harga, sisa_porsi, tersedia }) {
  const docRef = doc(db, KOLEKSI_MENU, id);
  await updateDoc(docRef, {
    nama: nama.trim(),
    harga: Number(harga),
    sisa_porsi: Number(sisa_porsi),
    tersedia: Boolean(tersedia),
  });
}

/**
 * 4. Fungsi DELETE (Hapus dokumen menu di Firestore)
 */
export async function hapusMenuFirestore(id) {
  const docRef = doc(db, KOLEKSI_MENU, id);
  await deleteDoc(docRef);
}

/**
 * 5. Fungsi Seed Dokumen Awal ke Cloud Firestore
 * Memasukkan contoh data sesuai Skema-Firestore-Dapur-Nia.md
 */
export async function seedContohMenuFirestore() {
  const dataAwal = [
    { nama: "Rendang", harga: 35000, sisa_porsi: 12, tersedia: true },
    { nama: "Sate Ayam", harga: 25000, sisa_porsi: 20, tersedia: true },
    { nama: "Nasi Ayam Bakar", harga: 25000, sisa_porsi: 30, tersedia: true },
    { nama: "Soto Betawi", harga: 20000, sisa_porsi: 10, tersedia: true },
  ];

  const menuRef = collection(db, KOLEKSI_MENU);
  for (const item of dataAwal) {
    await addDoc(menuRef, {
      ...item,
      dibuat_pada: serverTimestamp(),
    });
  }
}
