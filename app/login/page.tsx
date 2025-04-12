"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { notification } from "@/utils/scaffold-eth/notification";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await login(email, password);
            notification.success("Login successful!");
            router.push('/user/dashboard');
        } catch (error) {
            notification.error("Invalid email or password");
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen px-2 py-2 bg-gradient-to-b from-[#12021c] to-[#1a0329]">
            <div className="container mx-auto py-8">
                <Card className="md:glass-card border-none w-full md:max-w-lg mx-auto p-8">
                    <h1 className="text-4xl font-bold text-center mb-8 gradient-text">
                        Welcome Back
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="glass-card"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="glass-card"
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <Link
                                href="/forgot-password"
                                className="text-purple-400 hover:text-purple-300"
                            >
                                Forgot password?
                            </Link>
                            <Link
                                href="/register"
                                className="text-purple-400 hover:text-purple-300"
                            >
                                Don&apos;t have an account?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-500 rounded-xl h-12 font-semibold 
                                     hover:bg-purple-500/80"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}