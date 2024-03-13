export type User = {
    username: string
    auth: {
        google: AuthProvider | null
        facebook: AuthProvider | null
        local: LocalAuthProvider | null
    }
}

export type AuthProvider = {
    id: string
    accessToken: string
}

export type LocalAuthProvider = {
    email: string
    password: string
    isVerified: boolean
}