import NProgress from "nprogress";
import "nprogress/nprogress.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("🚨 BASE_URL is not defined. Check your .env file or environment variables.");
}

const FIXED_BASE_URL = BASE_URL as string;

interface CustomRequestInit extends RequestInit {
  showProgress?: boolean;
}

export async function Fetch<T>(
  endpoint: string,
  options?: CustomRequestInit,
): Promise<T> {
  const { showProgress = true } = options || {};
  const url = `${FIXED_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  if (typeof window !== "undefined" && showProgress) {
    NProgress.start();
  }

  try {
    const response = await fetch(url, {
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  } finally {
    if (typeof window !== "undefined" && showProgress) {
      NProgress.done();
    }
  }
}
