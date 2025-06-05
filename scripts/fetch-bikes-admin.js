const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

// Function to get all e-bikes
async function getEBikes() {
  try {
    const bikesCollection = db.collection('bikes');
    const snapshot = await bikesCollection.get();
    const bikes = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(bike => bike.battery && bike.battery.trim() !== ''); // Only get e-bikes (bikes with battery info)
    
    // Write to retail/bikes.json
    const outputPath = path.join(__dirname, '../retail/bikes.json');
    fs.writeFileSync(outputPath, JSON.stringify(bikes, null, 2));
    console.log(`Saved ${bikes.length} e-bikes to retail/bikes.json`);
    return bikes;
  } catch (error) {
    console.error("Error fetching bikes:", error);
    return [];
  }
}

// Run the function
getEBikes(); 