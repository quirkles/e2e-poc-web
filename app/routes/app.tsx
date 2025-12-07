import {Outlet} from "react-router";
import {Header} from "~/components/elements/Header";
import RequireAuth from "~/components/RequireAuth";


export default function App() {
    return (
        <RequireAuth>
            <div className="flex flex-col min-h-screen">
                <Header/>
                <div className="p-4">
                    <Outlet/>
                </div>
            </div>
        </RequireAuth>
        )
}