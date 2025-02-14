import { db } from "../firebaseConfig"
import { collection, query, getDocs, addDoc, orderBy, limit, Timestamp, updateDoc, where, deleteDoc, startAfter } from "@firebase/firestore"

// Thank you https://stackoverflow.com/users/164392/csharptest-net
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


export async function createArticle({ title, body, author }) {
  const data = { id: makeid(title.length + author.length), title, body, author, createdAt: Timestamp.now(), comments: [], likes: [], views: 0 }
  const docRef = await addDoc(collection(db, "articles"), data)
  return { id: docRef.id, ...data }
}


export async function fetchArticles(lastVisible) {

  const snapshot = lastVisible
    ? await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(5)))
    : await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(5)))

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    originalDoc: doc,
    ...doc.data(),
  }))

}



export async function incrementArticleViews(id) {
  const q = query(collection(db, "articles"), where("id", "==", id));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No article found with the given ID");
  }

  const articleDoc = querySnapshot.docs[0];

  await updateDoc(articleDoc.ref, {
    views: articleDoc.data().views + 1,
  });

  return { id: articleDoc.id };
}

export async function deleteArticleWithId(id) {
  const q = query(collection(db, "articles"), where("id", "==", id));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No article found with the given ID");
  }

  const articleDoc = querySnapshot.docs[0];

  await deleteDoc(articleDoc.ref);

  return { id: articleDoc.id };
}

export async function editArticleWithId(id, title, body) {
  const q = query(collection(db, "articles"), where("id", "==", id));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No article found with the given ID");
  }

  const articleDoc = querySnapshot.docs[0];

  await updateDoc(articleDoc.ref, {
    title,
    body,
  });

  return { id: articleDoc.id };

}

export async function likeArticle(userId, articleId) {
  const q = query(collection(db, "articles"), where("id", "==", articleId));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No article found with the given ID");
  }

  const articleDoc = querySnapshot.docs[0];

  await updateDoc(articleDoc.ref, {
    likes: [...articleDoc.data().likes, userId],
  });

  return { id: articleDoc.id };
}

export async function unlikeArticle(userId, articleId) {
  const q = query(collection(db, "articles"), where("id", "==", articleId));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("No article found with the given ID");
  }

  const articleDoc = querySnapshot.docs[0];

  await updateDoc(articleDoc.ref, {
    likes: articleDoc.data().likes.filter((id) => id !== userId),
  });

  return { id: articleDoc.id };
}