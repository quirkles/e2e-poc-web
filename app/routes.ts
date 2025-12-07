import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/Root.tsx"),
    route("/login", "routes/Login.tsx"),

    // Protected routes in here
    route("app", "routes/AppRoute.tsx", [
        route("user/:userId/notes", "routes/UserNotes.tsx"),
    ]),

    route("*", "./routes/NotFound.tsx"),

] satisfies RouteConfig;
