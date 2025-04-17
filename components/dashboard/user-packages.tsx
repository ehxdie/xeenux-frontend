import { useState } from "react";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { useUserPackages } from "@/hooks/use-user-packages";
import { Packages } from "@/lib/data/packages";

interface UserPackagesProps {
    withInactive?: boolean;
    toReversed?: boolean;
}

const UserPackages: React.FC<UserPackagesProps> = ({
    withInactive = false,
    toReversed = false,
}) => {
    const { packages: userPackages, isLoading } = useUserPackages();

    if (isLoading) {
        return <div>Loading packages...</div>;
    }

    const displayPackages = toReversed ? [...userPackages].reverse() : userPackages;

    return (
        <div className="space-y-4">
            {displayPackages && displayPackages.length > 0 ? (
                <div className="grid grid-cols-4 text-xs gap-1 font-semiboldx tracking-tight bg-purple-500/20 p-2 rounded-lg text-white">
                    <span>Value</span>
                    <span>Ceil. Limit</span>
                    <span>Earned</span>
                    <span>Progress</span>
                </div>
            ) : (
                <p className="text-muted-foreground">No active packages</p>
            )}

            {displayPackages &&
                displayPackages.map((pkg, index) => {
                    if (!withInactive && pkg.isActive === false) return null;
                    const percentageEarned = (pkg.earned / pkg.ceilingLimit) * 100;

                    return (
                        <Card
                            key={index}
                            className="p-3 rounded-lg flex flex-col bg-gray-800x relative border-purple-500/50"
                        >
                            <div className="grid grid-cols-4 gap-1 items-center text-white text-sm pb-2">
                                <span className="font-bold">
                                    {Packages.find(
                                        (p) => p.value === pkg.package
                                    )?.label}
                                </span>
                                <span className="text-yellow-400">
                                    {pkg.ceilingLimit} XEE
                                </span>
                                <span className="text-green-400">
                                    {pkg.earned} XEE
                                </span>
                                <Progress
                                    value={percentageEarned <= 0 ? 1 : percentageEarned}
                                    className="h-2 bg-gray-700"
                                />
                            </div>
                            <div className="text-xs text-center text-gray-400">
                                Purchased{" "}
                                {formatDistanceToNow(
                                    new Date(pkg.timestamp * 1000)
                                )}{" "}
                                ago
                            </div>
                        </Card>
                    );
                })}
        </div>
    );
};

export default UserPackages;