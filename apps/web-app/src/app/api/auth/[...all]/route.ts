import { auth } from "@/auth"; // Replace with your actual auth file import
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
