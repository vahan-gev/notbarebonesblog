import { db, auth } from "../firebaseConfig";
import {
    collection,
    query,
    getDocs,
    where,
    Timestamp,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

// Thank you https://stackoverflow.com/users/164392/csharptest-net
function makeid(length) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export async function getUserWithId(id) {
    let user = null;
    if (auth.currentUser && id) {
        const q = query(collection(db, "users"), where("uid", "==", id));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    user = doc.data();
                });
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }
    return user;
}

export async function getArticleWithId(id) {
    let article = null;
    if (auth.currentUser && id) {
        const q = query(collection(db, "articles"), where("id", "==", id));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    article = doc.data();
                });
            }
        } catch (error) {
            console.error("Error fetching article:", error);
        }
    }
    return article;
}

export async function ifAdmin(id) {
    let isAdmin = false;
    if (id) {
        const user = await getUserWithId(id);
        if (user && user.role === "admin") {
            isAdmin = true;
        }
    }
    return isAdmin;
}

export async function getUserArticles(id) {
    let articles = [];
    if (auth.currentUser && id) {
        const q = query(collection(db, "articles"), where("author", "==", id));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    articles.push(doc.data());
                });
            }
        } catch (error) {
            console.error("Error fetching user articles:", error);
        }
    }
    return articles;
}

export async function createComment(id, author, body) {
    const comment = { author, body, createdAt: Timestamp.now(), id: makeid(body.length) };
    if (id) {
        const q = query(collection(db, "articles"), where("id", "==", id));
        try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const articleDoc = querySnapshot.docs[0];

                await updateDoc(articleDoc.ref, {
                    comments: arrayUnion(comment),
                });

                return { id: articleDoc.id, ...comment };
            } else {
                throw new Error("No article found with the given ID");
            }
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    } else {
        throw new Error("Invalid ID");
    }
}
