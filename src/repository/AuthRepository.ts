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
        accessToken,
        refreshToken,
    }: {
        googleID: string;
        email: string;
        name: string;
        accessToken: string;
        refreshToken?: string;
    }) => {
        try {
            const user = this.db.collection("users").add({
                email,
                name,
                strategies: {
                    google: {
                        id: googleID,
                        accessToken,
                        refreshToken: refreshToken ? refreshToken : null,
                    },
                },
            });

            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly createFacebookUser = async ({
        facebookID,
        email,
        name,
        accessToken,
        refreshToken,
    }: {
        facebookID: string;
        email: string;
        name: string;
        accessToken: string;
        refreshToken?: string;
    }) => {
        try {
            const user = this.db.collection("users").add({
                email,
                name,
                strategies: {
                    facebook: {
                        id: facebookID,
                        accessToken,
                        refreshToken: refreshToken ? refreshToken : null,
                    },
                },
            });

            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly connectToGoogle = async ({
        googleId,
        documentId,
        strategies,
        accessToken,
        refreshToken,
    }: {
        googleId: string;
        documentId: string;
        strategies: any;
        accessToken: string;
        refreshToken?: string;
    }) => {
        try {
            const user = await this.db
                .collection("users")
                .doc(documentId)
                .update({
                    strategies: {
                        ...strategies,
                        google: {
                            id: googleId,
                            accessToken,
                            refreshToken: refreshToken ? refreshToken : null,
                        },
                    },
                });
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly updateAccessToken = async ({
        id,
        documentId,
        strategy,
        strategies,
        accessToken,
    }: {
        id: string;
        documentId: string;
        strategy: "GOOGLE" | "FACEBOOK";
        strategies:any
        accessToken: string;
    }) => {
        try {
            switch (strategy) {
                case "GOOGLE":
                    await this.db
                        .collection("users")
                        .doc(documentId)
                        .update({
                            strategies: {
                                ...strategies,
                                google: {
                                    id,
                                    accessToken,
                                },
                            },
                        });
                    break;
                case "FACEBOOK":
                    await this.db
                        .collection("users")
                        .doc(documentId)
                        .update({
                            strategies: {
                                ...strategies,
                                facebook: {
                                    id,
                                    accessToken,
                                },
                            },
                        });
                    break;

                default:
                    break;
            }

            return 
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };
    public readonly connectToFacebook = async ({
        facebookID,
        documentId,
        strategies,
        accessToken,
        refreshToken,
    }: {
        facebookID: string;
        documentId: string;
        strategies: any;
        accessToken: string;
        refreshToken?: string;
    }) => {
        try {
            const user = await this.db
                .collection("users")
                .doc(documentId)
                .update({
                    strategies: {
                        ...strategies,
                        facebook: {
                            id: facebookID,
                            accessToken,
                            refreshToken: refreshToken ? refreshToken : null,
                        },
                    },
                });
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
                .update({
                    local: {
                        password,
                    },
                });
            return user;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    };

    public async createUser({
        email,
        name,
        password,
    }: {
        email: string;
        name: string;
        password: string;
    }) {
        try {
            const doc = await this.db
                .collection("users")
                .add({ email, name, local: { password } });
            return doc;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async getUserPassword(email: string): Promise<string | null> {
        try {
            const docRef = this.db
                .collection("users")
                .where("email", "==", email);
            const docSnapshot = await docRef.get();
            if (!docSnapshot.docs[0].data().local) {
                return null;
            }
            return docSnapshot.docs[0].data().local.password;
        } catch (error: any) {
            throw new CustomError(
                (error?.message as string) || "Internal Server Error",
                error?.httpCode || HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}
export default AuthRepository;
