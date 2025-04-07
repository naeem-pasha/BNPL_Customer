import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// api/auth.js
export const checkAuth = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_USER_SERVER}/api/user/check-auth`,
      {
        withCredentials: true,
      }
    );

    if (data.success) {
      return true;
    }
  } catch (error) {
    return false;
  }
};
