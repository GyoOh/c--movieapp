import { getSession as _getSession } from "next-auth/react";
import type { Session } from "next-auth";

let session: Session | null;

type SessionOrError = {
  session: Session | null
  error: Error | null
}

export default async function getSession(): Promise<SessionOrError> {
  console.log("getsession called", session?.user?.email)
  if (session?.accessToken) {
  if (session?.accessToken) {
      return { session, error: null };
    }
  }

  try {
    session = await _getSession();
    if (!session?.accessToken) {
      throw new Error("Not signed in");
    }
    return { session, error: null }
  } catch (error) {
    if (error instanceof Error) {
      return { error, session: null }
    }
    return { error: new Error("Unknown error"), session: null }
  }
}
