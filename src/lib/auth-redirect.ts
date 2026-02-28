export const REQUIRE_SIGN_IN_FOR_APP = process.env.NEXT_PUBLIC_REQUIRE_AUTH === "true";
export const DEFAULT_SIGNED_IN_PATH = "/dashboard";

export function getSafeNextPath(nextPath?: string | null): string {
  if (!nextPath) {
    return DEFAULT_SIGNED_IN_PATH;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return DEFAULT_SIGNED_IN_PATH;
  }

  return nextPath;
}

export function createLoginRedirectPath(nextPath: string): string {
  const safeNextPath = getSafeNextPath(nextPath);
  return `/login?next=${encodeURIComponent(safeNextPath)}`;
}
