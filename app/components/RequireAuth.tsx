import {fbAuth, isAuthenticated} from "~/providers/firebase/Firebase";
import {Outlet, redirect, useNavigate} from "react-router";
import {type ReactNode, useEffect} from "react";


export async function clientLoader() {
    const isAuthed = await isAuthenticated().catch(e => {
        console.error("Failed to check auth", e)
        return false
    })
    if (!isAuthed) {
        throw redirect('/login')
    }
}

export default function RequireAuth({children}: { children: ReactNode}) {
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = fbAuth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/login')
            }
        })
        return () => unsubscribe()
    }, [navigate]);
    return (children)
}