import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { Bike } from "../models/Bike";

export interface Offer {
  id?: string;
  bikes: Bike[];
  note: string;
  createdAt: Timestamp;
  createdBy: string;
  status: 'pending' | 'accepted' | 'rejected';
  customerEmail?: string;
  customerName?: string;
}

const COLLECTION_NAME = "offers";
const offersCollection = collection(db, COLLECTION_NAME);

export const createOffer = async (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    const offerData = {
      ...offer,
      createdAt: Timestamp.now(),
      status: 'pending' as const
    };
    const docRef = await addDoc(offersCollection, offerData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};

export const getOffers = async (): Promise<Offer[]> => {
  try {
    const q = query(offersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Offer));
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const getOffersByUser = async (userId: string): Promise<Offer[]> => {
  try {
    const q = query(
      offersCollection,
      where("createdBy", "==", userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Offer));
  } catch (error) {
    console.error("Error fetching user offers:", error);
    throw error;
  }
}; 