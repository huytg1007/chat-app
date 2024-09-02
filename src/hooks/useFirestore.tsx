import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

type Condition = {
  fieldName: string;
  operator: string | any;
  compareValue: any;
}

const useFirestore = (collection: string, condition: Condition, limit?: number) => {
  const [documents, setDocuments] = useState<any>([]);

  useEffect(() => {
    let collectionRef = db.collection(collection).orderBy('createdAt');
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        // reset documents data
        setDocuments([]);
        return;
      }
      collectionRef = collectionRef.where(
        condition.fieldName,
        condition.operator,
        condition.compareValue
      );

      if(limit){
        collectionRef = collectionRef.limit(limit);
      }
    }

    const unsubscribe = collectionRef.onSnapshot((snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setDocuments(documents);
    });

    return unsubscribe;
  }, [collection, condition]);

  return documents;
};

export default useFirestore;