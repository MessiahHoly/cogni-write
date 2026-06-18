import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export const getSession = async () => auth.api.getSession({
    headers: await headers()
})