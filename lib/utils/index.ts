import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function b2i(amt: bigint, decimals: number = 18): number {
    return parseInt(formatUnits(amt, decimals));
}

export function b2f(amt: bigint, decimals: number = 18): number {
    return parseFloat(formatUnits(amt, decimals));
}

// Convert BigInt to formatted string
export const bigIntToString = (
    amount: bigint,
    d: number | bigint = 18,
    decimalPlaces: number = 0,
): string => {
    // amount = typeof amount === 'number' ? BigInt(amount) : amount;
    const decimals = typeof d === "number" ? d : Number(d);
    const amountStr = amount.toString().padStart(decimals + 1, "0");
    const decimalIndex = amountStr.length - decimals;
    const whole = amountStr.slice(0, decimalIndex);
    let fraction = amountStr.slice(decimalIndex).replace(/0+$/, "");
    if (decimalPlaces !== undefined && decimalPlaces >= 0) {
        fraction = fraction.slice(0, decimalPlaces); // Apply decimal place limit
    }
    return fraction ? `${whole}.${fraction}` : whole;
};

// Convert string amount to BigInt (multiply by 10^decimals)
export const stringToBigInt = (
    amount: string,
    d: number | bigint = 18,
): bigint => {
    const decimals = typeof d === "number" ? d : Number(d);
    try {
        const [whole, fraction = ""] = amount.split(".");
        const paddedFraction = fraction.padEnd(decimals, "0");
        const combined = whole + paddedFraction;
        return BigInt(combined);
    } catch {
        return BigInt(0);
    }
};

export const formatAmount = (amount: string): string => {
    // Remove non-numeric characters except decimal point
    let cleaned = amount.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");

    // Limit decimal places to 18 (or your token's decimals)
    if (parts.length === 2 && parts[1].length > 18) {
        cleaned = parts[0] + "." + parts[1].slice(0, 18);
    }

    return cleaned;
};

export const strictEmailRegex =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

export function shortenAddress(address: string): string {
    return address?.length > 10
        ? `${address.slice(0, 4)}...${address.slice(-4)}`
        : address;
}
