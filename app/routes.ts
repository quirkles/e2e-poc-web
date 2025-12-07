import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/root.tsx"),
    route("/login", "routes/login.tsx"),

    // Protected routes in here
    route("app", "routes/app.tsx", [
        route("user/:userId/notes", "routes/userNotes.tsx"),
    ]),

    route("*", "./routes/notFound.tsx"),

] satisfies RouteConfig;
