// Generoi uniikki ryhmäkoodi
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Ilman O, 0, I, 1 (helpompi lukea)
  let code = 'SHOP-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code; // Esim: "SHOP-X7K9"
};

// Tarkista onko koodi jo käytössä
export const checkCodeExists = async (db, code) => {
  // Toteutetaan seuraavassa vaiheessa
  return false;
};