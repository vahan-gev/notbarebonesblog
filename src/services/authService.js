import { useState, useEffect } from "react"
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth, db } from "../firebaseConfig"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import Button from "../components/Button/Button"

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


async function createUser(username, uid, displayName, email, photoURL) {
    const data = { username, uid, displayName, email, photoURL, role: "user" };
    const docRef = await addDoc(collection(db, "users"), data);
    return { id: docRef.id, ...data };
}



export async function logout() {
    signOut(auth);
}

async function handleLogin(result) {
    await getDocs(query(collection(db, "users"), where("uid", "==", result.user.uid))).then((querySnapshot) => {
        if (querySnapshot.empty) {
            createUser(makeid(result.user.displayName.length), result.user.uid, result.user.displayName, result.user.email, result.user.photoURL);
        }
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}


export function SignIn() {
    return <div className="flex justify-center items-center flex-col">
        <img alt="google-logo" className="m-5" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.freepnglogos.com%2Fuploads%2Fgoogle-logo-png%2Fgoogle-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png&f=1&nofb=1&ipt=1027133da911ef4cbdf93822b5bbc60f15539748b3bf256751720ad2c6c689f8&ipo=images" width={40} height={40} />
        <Button onClick={() => {
            signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
                handleLogin(result);
            })
        }} text="Sign In With Google" /></div>
}

export function useAuthentication() {
    const [user, setUser] = useState(null)
    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            user ? setUser(user) : setUser(null)
        })
    }, [])
    return user
}
