import { Gift } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
    useDistributeIncome,
    useIncomeDistributionData,
} from "@/hooks/use-admin";
import { CountdownTimer } from "../ui/countdown-timer";
import { formatDistanceToNow, formatDistance } from "date-fns"; // To format timestamps
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
                {/* <p className="text-sm text-gray-400">
          Trigger the distribution of weekly bonuses to eligible users.
        </p> */}

                <div className="flex flex-col items-center justify-between gap-4">
                    <span className="text-sm text-gray-400">
                        {targetDate > new Date()
                            ? `Next ${name} Distribution in: `
                            : `${name} Distribution elapsed: `}
                        {formatDistanceToNow(targetDate)}{" "}
                        {targetDate > new Date() ? "time" : "ago"}
                    </span>
                    {/* <div className="w-full">
            <CountdownTimer targetDate={targetDate} />
          </div> */}
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
    const [isLoading, setIsLoading] = useState(false);
    const { data: incomeDistData, isLoading: isLoadingWeeklyLastDist } =
        useIncomeDistributionData();

    const { distributeROI, distributeBinaryIncome, distributeWeeklyReward } =
        useDistributeIncome();
    const handleDistributeROI = async () => {
        await distributeROI();
    };
    const handleDistributeBinaryIncome = async () => {
        await distributeBinaryIncome();
    };
    const handleDistributeWeeklyReward = async () => {
        await distributeWeeklyReward();
    };

    useEffect(() => {
        console.log({ incomeDistData });
    }, [incomeDistData]);
    return (
        <>
            {/* <IncomeCard
                name="ROI"
                distributeAction={handleDistributeROI}
                isLoading={isLoading}
                targetDate={
                    new Date(
                        (Number(incomeDistData?.roiIncomeLastDist || 0) +
                            Number(incomeDistData?.allIncomeDistTime || 0)) *
                            1000,
                    )
                }
            /> */}
            <IncomeCard
                name="Weekly Reward"
                distributeAction={handleDistributeWeeklyReward}
                isLoading={isLoading}
                targetDate={
                    new Date(
                        (Number(incomeDistData?.weeklyRewardLastDist || 0) +
                            Number(incomeDistData?.weeklyRewardDistTime || 0)) *
                            1000,
                    )
                }
            />
            <IncomeCard
                name="Binary Income"
                distributeAction={handleDistributeBinaryIncome}
                isLoading={isLoading}
                targetDate={
                    new Date(
                        (Number(incomeDistData?.binaryIncomeLastDist || 0) +
                            Number(incomeDistData?.allIncomeDistTime || 0)) *
                            1000,
                    )
                }
            />
        </>
    );
}
