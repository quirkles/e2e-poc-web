import type { Route } from "./+types/root";
import {UserNotesPage} from "~/components/pages/userHome/App/Usernotes";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notero - Home" },
    { name: "description", content: "Notero - Home" },
  ];
}

export default function UserNotesRoute() {
    return (
        <UserNotesPage/>
    );
}
