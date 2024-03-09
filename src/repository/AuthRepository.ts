import { singleton } from "tsyringe";
import {
    getFirestore,
    collection,
    getDocs,
    Firestore,
    addDoc,
} from "firebase/firestore/lite";
import { firebaseApp } from "../configs/firebaseConfig";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";

@singleton()
class AuthRepository {
    private db: Firestore;
    constructor() {
        this.db = getFirestore(firebaseApp);
    }
    public readonly createGoogleUser=async({googleID,email,name,profilePic}:{googleID:string,email:string,name:string,profilePic:string})=> {
        try {
            const user=await addDoc(collection(this.db, "user"), {
                 email,
                 name,googleID,profilePic
            });
            return user
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
    public readonly getUser=async()=> {
        try {
            const usersCol = collection(this.db, "user");
            const userSnapshot = await getDocs(usersCol);
            const userList = userSnapshot.docs.map((doc) => doc.data());
            return userList
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
export default AuthRepository;
