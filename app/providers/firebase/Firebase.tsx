import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {initializeApp} from "firebase/app";
import {getAuth, type User} from "@firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDIzyjWS3uVzC1TPxXuZwTRwCz32hWtUfE",
    authDomain: "e2e-poc-web.firebaseapp.com",
    projectId: "e2e-poc-web",
    storageBucket: "e2e-poc-web.firebasestorage.app",
    messagingSenderId: "221372015196",
    appId: "1:221372015196:web:560c9547d0a90018793c99",
    measurementId: "G-VB16WYEDCE"
};

type FirebaseContextType = {
    auth: {
        logout: () => Promise<void>,
        currentUser: User | null
    }
}

// Create context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const fbApp = initializeApp(firebaseConfig)

export const fbAuth = getAuth(fbApp)

export function isAuthenticated() {
    return new Promise((resolve) => {
        const unsubscribe = fbAuth.onAuthStateChanged((user) => {
            unsubscribe()
            resolve(!!user)
        })
    })
}

// Provider component
export function FirebaseProvider({children}: { children: ReactNode }) {
    const [authContextReturnValue, setAuthContextReturnValue] = useState<FirebaseContextType['auth']>({
        logout: async () => {
            if (fbAuth === null) {
                return
            }
            await fbAuth.signOut()
        },
        currentUser: fbAuth?.currentUser || null
    })
    useEffect(() => {
        const unsubscribe = fbAuth.onAuthStateChanged(
            (user: User | null) => {
                if (user === null) {
                    console.log("auth change handler: no user")
                    setAuthContextReturnValue({
                        ...authContextReturnValue,
                        currentUser: null
                    })
                    return
                }
                if (
                    user.uid !== authContextReturnValue.currentUser?.uid ||
                    user.email !== authContextReturnValue.currentUser?.email ||
                    user.displayName !== authContextReturnValue.currentUser?.displayName
                ) {
                    console.log("auth change handler: changed user", {
                        prev: authContextReturnValue.currentUser?.toJSON(),
                        curr: user.toJSON()
                    })
                    setAuthContextReturnValue((curr) => {
                        return {
                            ...curr,
                            currentUser: user
                        }
                    })
                    return
                }
                console.log(`auth change handler: same user: ${user.email}`)
            }
        )
        return () => unsubscribe()
    }, [setAuthContextReturnValue])
    const contextValue: FirebaseContextType = {
        auth: authContextReturnValue
    }
    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    );
}

// Hook to access Firebase app
export function useFirebase(): FirebaseContextType {
    const app = useContext(FirebaseContext);
    if (!app) {
        throw new Error("useFirebase must be used within FirebaseProvider");
    }
    return app;
}
