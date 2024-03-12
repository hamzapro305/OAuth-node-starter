import { singleton } from "tsyringe";
import {
    getFirestore,
    collection,
    getDocs,
    Firestore,
    addDoc,
    query,
    where,
    updateDoc,
    doc,
} from "firebase/firestore/lite";
import { firebaseDB } from "../configs/firebaseConfig";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";

@singleton()
class AuthRepository {
    private db: typeof firebaseDB;
    constructor() {
        this.db = firebaseDB;
    }
    public readonly createGoogleUser = async ({
        googleID,
        email,
        name,
        profilePic,
    }: {
        googleID: string;
        email: string;
        name: string;
        profilePic: string;
    }) => {
        try {
            const user=this.db.collection("users").add({email,name,profilePic,googleID})
            // const user = await this.db.collection("users").doc("OBMIuG0qBdo0rMNPs7Am").update({email,name,profilePic})
            
            // const user = await addDoc(collection(this.db, "user"), {
            //     email,
            //     name,
            //     googleID,
            //     profilePic,
            // });
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly connectToGoogle = async ({
        googleID,
        email,
        name,
        profilePic,
    }: {
        googleID: string;
        email: string;
        name: string;
        profilePic: string;
    }) => {
        try {
            // const user = await updateDoc(doc(this.db, "user", email), {
            //     googleID,
            //     name,
            //     profilePic,
            // });
            return "user";
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public async getUserByEmail(email: string) {
        try {
            // const usersCol = collection(this.db, "user");
            // // Query for the user with the specified email
            // const querySnapshot = await getDocs(
            //     query(usersCol, where("email", "==", email))
            // );
            // // Check if any user matches the query
            // if (querySnapshot.size > 0) {
            //     // Return the first matching user (assuming unique emails)
            //     return querySnapshot.docs[0].data();
            // } else {
            //     // No user found with the specified email
            //     return null;
            // }
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async createUser({
        email,
        password,
    }: {
        email: string;
        password: string;
    }) {
        try {
            // const usersCol = collection(this.db, "user");
            // await addDoc(usersCol, { email, password });
            return;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public readonly getUser = async () => {
        try {
            // const usersCol = collection(this.db, "user");
            // const userSnapshot = await getDocs(usersCol);
            // const userList = userSnapshot.docs.map((doc) => doc.data());
            // return userList;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
}
export default AuthRepository;
