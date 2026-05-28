import { getIdToken } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";

type AuthFetchOptions = RequestInit & {
  json?: unknown;
};

export const authFetch = async (input: string, options: AuthFetchOptions = {}) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await getIdToken(user, true);
  const headers = new Headers(options.headers || {});

  headers.set("Authorization", `Bearer ${token}`);

  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return { response, data };
};

