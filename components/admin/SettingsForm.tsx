"use client";

import { useState, useEffect } from "react";
import { useGetSettings, useUpdateSetting } from "@/hooks/use-admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function SettingsForm() {
    const { settings, isLoading, refreshSettings } = useGetSettings();
    const { updateSetting, isUpdating } = useUpdateSetting();
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        if (settings) {
            const initialData = Object.keys(settings).reduce((acc, key) => {
                acc[key] = settings[key].value;
                return acc;
            }, {} as Record<string, string>);
            setFormData(initialData);
        }
    }, [settings]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        for (const key in formData) {
            await updateSetting({
                key,
                value: formData[key],
                group: settings[key].group,
                description: settings[key].description,
            });
        }
        refreshSettings();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {Object.keys(settings).map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium">{settings[key].description}</label>
                            <Input
                                value={formData[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                                placeholder={`Enter ${settings[key].description}`}
                            />
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
