import {useFirebase} from "~/providers/firebase/Firebase";

export function Header() {
    const {auth} = useFirebase()
    const user = auth.currentUser

    const handleLogout = async () => {
        await auth.logout()
    }

    if (!user) {
        return null
    }

    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="flex items-center">
                <div className="flex items-center gap-4 grow">
                    <span className="text-sm">{user.email}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}