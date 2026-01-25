import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Luo uusi lista
export const createList = async (code, userId, isPro = false) => {
  const listRef = doc(db, 'lists', code);
  
  try {
    await setDoc(listRef, {
      code,
      createdAt: serverTimestamp(),
      ownerId: userId,
      members: [userId],
      isPro,
      name: `Lista ${code}`
    });
    return { success: true, code };
  } catch (error) {
    console.error('Error creating list:', error);
    return { success: false, error };
  }
};

// Liity olemassa olevaan listaan
export const joinList = async (code, userId) => {
  const listRef = doc(db, 'lists', code);
  
  try {
    // Yritä ensin luoda lista (jos ei ole olemassa)
    // Jos on jo olemassa, createList epäonnistuu ja yritetään liittyä
    try {
      return await createList(code, userId);
    } catch (createError) {
      // Lista on jo olemassa, yritä liittyä
      if (createError.code === 'permission-denied') {
        // Yritä päivittää jäsenyys
        await updateDoc(listRef, {
          members: arrayUnion(userId)
        });
        return { success: true, code };
      }
      throw createError;
    }
  } catch (error) {
    console.error('Error joining list:', error);
    return { success: false, error };
  }
};

// Tarkista onko käyttäjä listan jäsen
export const isMember = async (code, userId) => {
  const listRef = doc(db, 'lists', code);
  
  try {
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) return false;
    
    const members = listSnap.data().members || [];
    return members.includes(userId);
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};