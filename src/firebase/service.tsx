import firebase, { db, auth } from './config';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export const addDocument = (collection: string, data: any) => {
  const query = db.collection(collection);  

  query.add({
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

export const uploadImage = async (file: any): Promise<string> => {
  if (!file) return "";

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    // 1. Upload the image to Firebase Storage
    // console.log(file)
    const fileName = file.name;
    console.log(fileName)
    const storage = getStorage();
    const storageRef = ref(storage, 'images/' + fileName);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    // 2. Get the download URL of the uploaded image
    var fixUrl = "";
    await getDownloadURL(ref(storage, 'images/' + fileName))
      .then(async(url) => {
        // `url` is the download URL for 'images/fileName}'
        // and ?alt=media to url to make it work
        fixUrl = url + '?alt=media';
        console.log(fixUrl);
      })
    .catch((error) => {
      // Handle any errors
    });
    console.log("Upload Image To Firebase Storage successfully!");
    return fixUrl;

  } catch (error) {
    console.error("Error Upload image: ", error);
    return "";
  }
};

export const changeAvatar = async (fixUrl: string, curRoomId: string) => {
  try {
    // 3. Update the user's document in Firestore with the new avatar URL
    const userDocRef = db.collection('rooms').doc(curRoomId); // Adjust the collection path as needed
    await userDocRef.update({
      avatar: fixUrl,
    });
    console.log("Avatar updated successfully!");

  } catch (error) {
    console.error("Error updating avatar: ", error);
  }
};

export const changeRoomName = async (newName: string, curRoomId: string) => {
  try {
    // 3. Update the user's document in Firestore with the new avatar URL
    const userDocRef = db.collection('rooms').doc(curRoomId); // Adjust the collection path as needed
    await userDocRef.update({
      name: newName,
    });
    console.log("Room name updated successfully!");

  } catch (error) {
    console.error("Error updating room name: ", error);
  }
};


// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName: string | undefined) => {
  // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
  // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...

  if(displayName === undefined) {
    return;
  }

  const name = displayName.split(' ').filter((word) => word);

  const length = name.length;
  let flagArray: boolean[] = [];
  let result: any[] = [];
  let stringArray: string[] = [];

  /**
   * khoi tao mang flag false
   * dung de danh dau xem gia tri
   * tai vi tri nay da duoc su dung
   * hay chua
   **/
  for (let i = 0; i < length; i++) {
    flagArray[i] = false;
  }

  const createKeywords = (name: string) => {
    const arrName: string[] = [];
    let curName = '';
    name.split('').forEach((letter: string) => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  function findPermutation(k: number) {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(' '));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  }

  findPermutation(0);

  const keywords = stringArray.reduce((acc: any, cur: string) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};