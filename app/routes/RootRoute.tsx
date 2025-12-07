import type { Route } from "./+types/root";
import {isAuthenticated} from "~/providers/firebase/FirebaseProvider";
import {redirect} from "react-router";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notero - Home" },
    { name: "description", content: "Notero - Home" },
  ];
}

export default function RootRoute() {
    return null
}

export async function clientLoader() {
    const isAuthed = await isAuthenticated().catch(e => {
        console.error("Failed to check auth", e)
        return false
    })
    if (!isAuthed) {
        return redirect('/login')
    } else {
        return redirect('/app')
    }
}
