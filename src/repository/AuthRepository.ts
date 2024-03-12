import { singleton } from "tsyringe";
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
            const user = this.db
                .collection("users")
                .add({ email, name, profilePic, googleID });

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
        documentId,
        name,
        profilePic,
    }: {
        googleID: string;
        documentId: string;
        name: string;
        profilePic: string;
    }) => {
        try {
            const user = await this.db
                .collection("users")
                .doc(documentId)
                .update({ name, profilePic, googleID });
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly connectLocalAccount = async ({
        documentId,
        password,
    }: {
        documentId: string;
        password: string;
    }) => {
        try {
            const user = await this.db
                .collection("users")
                .doc(documentId)
                .update({ password });
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public async getUserByEmail(email: string):Promise<any> {
        try {
            const docRef = this.db.collection("users").where("email", "==", email);
            const docSnapshot = await docRef.get();
            if (docSnapshot.empty) {
                // Handle case where no user found with the email
                return null;
            }
            console.log("+++++++++++++snapshot++++++++++++++++",{...docSnapshot.docs[0].data(),id:docSnapshot.docs[0].id})
            return {...docSnapshot.docs[0].data(),id:docSnapshot.docs[0].id};
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
            const doc = await this.db
                .collection("users")
                .add({ email, password });
            console.log("Document created with ID:", doc);
            return doc;
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
