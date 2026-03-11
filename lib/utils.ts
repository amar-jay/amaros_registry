import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function computeChecksum(buffer: Buffer): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash("sha256");
		hash.update(buffer);
		if (hash) {
			resolve(hash.digest("hex"));
		} else {
			reject(new Error("Failed to compute checksum"));
		}
	});
}
