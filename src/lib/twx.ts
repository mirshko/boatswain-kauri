import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { createTwc } from "react-twc";

// Using `clsx` + `twMerge` for a complete flexibility (taken from shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// We named it `twx` to have better autocompletion
export const twx = createTwc({ compose: cn });
