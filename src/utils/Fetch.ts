import NProgress from "nprogress";
import "nprogress/nprogress.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface CustomRequestInit extends RequestInit {
  showProgress?: boolean;
}

export async function Fetch<T>(
  endpoint: string,
  options?: CustomRequestInit,
): Promise<T> {
  const { showProgress = true } = options || {};
  const url = `${BASE_URL}/${endpoint}`;

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
    throw error;
  } finally {
    if (typeof window !== "undefined" && showProgress) {
      NProgress.done();
    }
  }
}
