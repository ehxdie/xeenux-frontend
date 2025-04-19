"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { notification } from "@/utils/scaffold-eth/notification";
import { resetPassword } from "@/api/auth";

export default function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return notification.error("Passwords do not match");
        }

        if (password.length < 6) {
            return notification.error("Password must be at least 6 characters long");
        }

        setIsLoading(true);

        try {
            await resetPassword(token, { password });
            notification.success("Password reset successful!");
            router.push("/login");
        } catch (error) {
            notification.error("Failed to reset password. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-2 py-2 bg-gradient-to-b from-[#12021c] to-[#1a0329]">
            <div className="container mx-auto py-8">
                <Card className="md:glass-card border-none w-full md:max-w-lg mx-auto p-8">
                    <h1 className="text-4xl font-bold text-center mb-8 gradient-text">
                        Reset Password
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="glass-card"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="glass-card"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-500 rounded-xl h-12 font-semibold hover:bg-purple-500/80"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}