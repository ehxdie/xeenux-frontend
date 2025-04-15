import { Gift } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { useIncomeDistribution } from "@/hooks/use-income-distribution";

const IncomeCard = ({
    targetDate = new Date(),
    distributeAction,
    isLoading,
    name = "Income",
}: {
    targetDate?: Date;
    distributeAction: () => void;
    isLoading: boolean;
    name?: string;
}) => {
    return (
        <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-500/20">
                    <Gift className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                    {name} Distribution
                </h2>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col items-center justify-between gap-4">
                    <span className="text-sm text-gray-400">
                        {targetDate > new Date()
                            ? `Next ${name} Distribution in: `
                            : `${name} Distribution elapsed: `}
                        {formatDistanceToNow(targetDate)}{" "}
                        {targetDate > new Date() ? "time" : "ago"}
                    </span>
                    <Button
                        onClick={distributeAction}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 w-full !rounded-xl"
                    >
                        Distribute {name} Now
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export function IncomeDistribution() {
    const { data, isLoading, distributeROI, distributeBinaryIncome } = useIncomeDistribution();

    if (!data) return null;

    return (
        <>
            <IncomeCard
                name="ROI"
                distributeAction={distributeROI}
                isLoading={isLoading}
                targetDate={
                    new Date(
                        (Number(data.roiIncomeLastDist || 0) +
                            Number(data.allIncomeDistTime || 0)) *
                        1000
                    )
                }
            />
            <IncomeCard
                name="Binary Income"
                distributeAction={distributeBinaryIncome}
                isLoading={isLoading}
                targetDate={
                    new Date(
                        (Number(data.binaryIncomeLastDist || 0) +
                            Number(data.allIncomeDistTime || 0)) *
                        1000
                    )
                }
            />
        </>
    );
}