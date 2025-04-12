"use client";

import { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import SelectPackage from "@/components/ui/select-package";
import { strictEmailRegex } from "@/lib/utils";
import { notification } from "@/utils/scaffold-eth/notification";

// Country codes data
const countryCodes = [
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+234", country: "Nigeria", flag: "🇳🇬" },
    { code: "+27", country: "South Africa", flag: "🇿🇦" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
].sort((a, b) => a.country.localeCompare(b.country));

function CountryCodeSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const selectedCountry = countryCodes.find((c) => c.code === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="glass-card w-[140px] justify-between">
                    <div className="flex items-center gap-2 truncate">
                        <span className="text-xl">{selectedCountry?.flag}</span>
                        <span className="text-base font-medium">{value}</span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0 bg-[#1a0329]/95 backdrop-blur-xl border-purple-500/20">
                <Command>
                    <CommandInput placeholder="Search country..." className="h-12 bg-transparent" />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                        {countryCodes.map((country) => (
                            <CommandItem
                                key={country.code}
                                value={`${country.country} ${country.code}`}
                                onSelect={() => {
                                    onChange(country.code);
                                    setOpen(false);
                                }}
                                className="flex items-center gap-3 py-3 px-4 cursor-pointer hover:bg-purple-500/20"
                            >
                                <span className="text-xl">{country.flag}</span>
                                <div className="flex flex-col">
                                    <span className="font-medium">{country.country}</span>
                                    <span className="text-sm text-gray-400">{country.code}</span>
                                </div>
                                {value === country.code && (
                                    <Check className="ml-auto h-4 w-4 text-purple-500" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        countryCode: "+1",
        position: "left" as "left" | "right",
        package: 0,
        ref: 0,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const _ref = parseInt(params.get("ref") || "0") || 0;
        const position = params.get("position") || "left";
        setFormData((prev) => ({
            ...prev,
            position: position as "left" | "right",
            ref: _ref,
        }));
    }, []);

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber.replace(/\D/g, "")}`;

        if (formData.name.trim().length === 0) {
            return notification.error("Name is required");
        }
        if (formData.name.length > 30) {
            return notification.error("Name must be 30 characters or less");
        }
        if (!strictEmailRegex.test(formData.email)) {
            return notification.error("Please enter a valid email address");
        }
        if (formData.email.length > 50) {
            return notification.error("Email must be 50 characters or less");
        }
        if (formData.phoneNumber.trim().length === 0) {
            return notification.error("Phone number is required");
        }
        if (fullPhoneNumber.length > 15) {
            return notification.error("Phone number must be 15 characters or less");
        }

        // Handle the registration (e.g., send to a backend API)
        console.log("Registering with data:", {
            ...formData,
            phoneNumber: fullPhoneNumber,
        });

        notification.success("Registration submitted (simulated)");
    };

    return (
        <div className="min-h-screen px-2 py-2 bg-gradient-to-b from-[#12021c] to-[#1a0329]">
            <div className="container mx-auto py-8">
                <Card className="md:glass-card border-none w-full md:max-w-7xl mx-auto p-4">
                    <h1 className="text-4xl font-bold text-center mb-12 gradient-text">Join now</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <Label className="mb-2">Name</Label>
                                    <Input
                                        placeholder="Enter your name"
                                        className="glass-card"
                                        value={formData.name}
                                        onChange={handleInputChange("name")}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2">Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="glass-card"
                                        value={formData.email}
                                        onChange={handleInputChange("email")}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2">Mobile Number</Label>
                                    <div className="flex gap-2">
                                        <CountryCodeSelect
                                            value={formData.countryCode}
                                            onChange={(code) =>
                                                setFormData((prev) => ({ ...prev, countryCode: code }))
                                            }
                                        />
                                        <Input
                                            type="tel"
                                            placeholder="Enter mobile number"
                                            className="glass-card flex-1"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange("phoneNumber")}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-4 block">Choose position</Label>
                                    <RadioGroup
                                        value={formData.position}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                position: value as "left" | "right",
                                            }))
                                        }
                                        className="flex gap-8"
                                    >
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="left" id="left" className="h-5 w-5" />
                                            <Label htmlFor="left" className="text-lg">Left</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="right" id="right" className="h-5 w-5" />
                                            <Label htmlFor="right" className="text-lg">Right</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <SelectPackage
                                value={formData.package}
                                onChange={(value) => {
                                    setFormData((prev) => ({ ...prev, package: value }));
                                }}
                            />
                        </div>

                        <div className="flex justify-center mt-8">
                            <Button
                                type="submit"
                                className="bg-purple-500 rounded-xl h-12 font-semibold w-48 hover:bg-purple-500/80"
                            >
                                Register
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
