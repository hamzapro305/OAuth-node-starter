import { singleton } from "tsyringe";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    Firestore,
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
    public readonly getUser=async()=> {
        try {
            // const citiesCol = collection(this.db, "cities");
            // const citySnapshot = await getDocs(citiesCol);
            // const cityList = citySnapshot.docs.map((doc) => doc.data());
            return "Yaha hoon bhen chod";
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
export default AuthRepository;
