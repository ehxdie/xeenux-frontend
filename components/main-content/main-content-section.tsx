"use client";

import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

interface MainContentSectionProps {
    title: ReactNode | string;
    content: ReactNode;
    id?: string;
    triggerId?: string;

    className?: string;
}

export function MainContentSection({
    title,
    content,
    id = "",
    triggerId = "",
    className = "",
}: MainContentSectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card id={id} className="glass-card overflow-hidden">
            <div
                className="w-full p-4 flex items-center justify-between text-left"
                onClick={() => setIsExpanded(!isExpanded)}
                id={triggerId}
            >
                {typeof title === "string" ? (
                    <h3 className="text-sm font-semibold text-gray-200">
                        {title}
                    </h3>
                ) : (
                    title
                )}
                {/* <h3 className="text-sm font-semibold text-gray-200">{title}</h3> */}
                <ChevronDown
                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
            </div>

            {isExpanded && (
                <div className={`${className} text-xs p-4 pt-0`}>{content}</div>
            )}
        </Card>
    );
}
