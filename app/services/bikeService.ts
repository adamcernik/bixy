import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { Bike } from "../models/Bike";

const COLLECTION_NAME = "bikes";
const bikesCollection = collection(db, COLLECTION_NAME);

export const getBikes = async (): Promise<Bike[]> => {
  try {
    const snapshot = await getDocs(bikesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Bike));
  } catch (error) {
    console.error("Error fetching bikes:", error);
    // Create the collection if it doesn't exist by adding a test document
    if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
      console.log("Attempting to create collection...");
      try {
        const testBike: Bike = {
          manufacturer: 'Bulls',
          modelName: 'Test Bike',
          modelYear: 2023,
          weight: 15,
          frameMaterial: 'Aluminum',
          imageUrl: '',
          location: 'Store',
          battery: 'Test 500Wh',
          color: 'Black',
          size: 'M',
          category: 'MTB',
          isEbike: true,
          pieces: 1,
          priceRetail: 50000,
          priceAction: 45000,
          priceReseller: 40000,
          note: 'Test bike'
        };
        await addDoc(bikesCollection, testBike);
        const snapshotRetry = await getDocs(bikesCollection);
        return snapshotRetry.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Bike));
      } catch (retryError) {
        console.error("Could not create collection:", retryError);
        throw retryError;
      }
    }
    throw error;
  }
};

export const addBike = async (bike: Bike): Promise<string> => {
  try {
    const docRef = await addDoc(bikesCollection, bike);
    return docRef.id;
  } catch (error) {
    console.error("Error adding bike:", error);
    throw error;
  }
};

export const updateBike = async (id: string, bike: Bike): Promise<void> => {
  try {
    const bikeRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(bikeRef, { ...bike });
  } catch (error) {
    console.error("Error updating bike:", error);
    throw error;
  }
};

export const deleteBike = async (id: string): Promise<void> => {
  try {
    const bikeRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(bikeRef);
  } catch (error) {
    console.error("Error deleting bike:", error);
    throw error;
  }
};

export const getBikesByManufacturer = async (manufacturer: string): Promise<Bike[]> => {
  try {
    const q = query(bikesCollection, where("manufacturer", "==", manufacturer));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Bike));
  } catch (error) {
    console.error("Error fetching bikes by manufacturer:", error);
    throw error;
  }
}; 