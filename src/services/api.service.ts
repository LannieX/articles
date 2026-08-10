"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

const MODE = process.env.NEXT_PUBLIC_MODE || "dev";

const BASE_URL =
  MODE === "prod" ? "https://www.test-servies.com" : "http://localhost:4444";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const ApiServices = async (
  method: HttpMethod,
  endpoint: string,
  data?: Record<string, any>,
) => {
  try {
    const session = await getServerSession(authOptions);

    const accessToken = session?.accessToken;

    const url = new URL(`${BASE_URL}${endpoint}`);

    const options: RequestInit = {
      method,

      headers: {
        "Content-Type": "application/json",

        ...(accessToken && {
          Authorization: `Bearer ${accessToken}`,
        }),
      },

      cache: "no-store",
    };

    if (method === "GET") {
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
    } else {
      if (data) {
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url.toString(), options);

    const result = await response.json();

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      throw new Error(
        result?.message || result?.error || `API Error: ${response.statusText}`,
      );
    }

    return result;
  } catch (error) {
    console.error("ApiServices Error:", error);

    throw error;
  }
};
