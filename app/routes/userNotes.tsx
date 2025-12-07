import type { Route } from "./+types/home";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notero - Home" },
    { name: "description", content: "Notero - Home" },
  ];
}

export default function UserNotes() {
    return (
        <div>
            <h1>User notes</h1>
        </div>
    );
}
