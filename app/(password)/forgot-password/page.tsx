"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { notification } from "@/utils/scaffold-eth/notification";
import { forgotPassword } from "@/api/auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            await forgotPassword({ email });
            setEmailSent(true);
            notification.success("Password reset instructions sent to your email");
        } catch (error: any) {
            notification.error(error?.response?.data?.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-2 py-2 bg-gradient-to-b from-[#12021c] to-[#1a0329]">
            <div className="container mx-auto py-8">
                <Card className="md:glass-card border-none w-full md:max-w-lg mx-auto p-8">
                    <h1 className="text-3xl font-bold text-center mb-6 gradient-text">
                        Reset Password
                    </h1>

                    {!emailSent ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="glass-card"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-500 rounded-xl h-12 font-semibold hover:bg-purple-500/80"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-purple-400 hover:text-purple-300"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <p className="text-gray-300">
                                Check your email for password reset instructions.
                            </p>
                            <Button
                                onClick={() => setEmailSent(false)}
                                className="bg-purple-500 rounded-xl px-6 py-2 font-semibold hover:bg-purple-500/80"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
