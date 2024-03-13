import { singleton } from "tsyringe";
import { firebaseDB } from "../configs/firebaseConfig";
import { CustomError } from "../exception/CustomError";
import HttpStatusCode from "../utils/HttpStatusCode";

@singleton()
class UserRepository {
    private db: typeof firebaseDB;
    constructor() {
        this.db = firebaseDB;
    }
    public async getUserByEmail(email: string): Promise<any> {
        try {
            const docRef = this.db
                .collection("users")
                .where("email", "==", email);
            const docSnapshot = await docRef.get();
            if (docSnapshot.empty) {
                // Handle case where no user found with the email
                return null;
            }
            return {
                ...docSnapshot.docs[0].data(),
                id: docSnapshot.docs[0].id,
                local:{}
            };
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
export default UserRepository;
