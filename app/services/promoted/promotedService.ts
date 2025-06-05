import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PROMOTED_DOC = 'promoted/bikes';

export const getPromotedBikes = async (): Promise<string[]> => {
  const ref = doc(db, PROMOTED_DOC);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().modelNumbers || [];
  }
  return ['', '', ''];
};

export const setPromotedBikes = async (modelNumbers: string[]): Promise<void> => {
  const ref = doc(db, PROMOTED_DOC);
  await setDoc(ref, { modelNumbers });
}; 