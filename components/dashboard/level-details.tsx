import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useContractData } from "@/context/contract";
import { useUser } from "@/context/user";
import { useGetAllUserLevels, useGetUserLevelDetails } from "@/hooks/use-user";
import { bigIntToString, shortenAddress } from "@/lib/utils";
import { UserLevelDetail } from "@/types";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Type for a single user level
interface Level {
  level: bigint;
  userCount: bigint;
  totalAmount: bigint;
}

// Type for the cache object
interface LevelDetailsCache {
  [key: string]: UserLevelDetail[] | undefined;
}
export function LevelDetailsAccordion({}: {}) {
  const LevelRequiredReferrals = [5, 1, 1, 1, 1, 1, 5];
  const { tokenInfo } = useContractData();
  const { userInfo } = useUser();
  const { data: userLevels } = useGetAllUserLevels(userInfo?.id || BigInt(0));
  const {
    data: levelDetails,
    setLevel,
    isLoading: isLoadingLevelDetails,
  } = useGetUserLevelDetails(userInfo?.id || BigInt(0));

  return (
    <Accordion type="single" collapsible>
      {userLevels && userLevels?.length > 0 ? (
        userLevels.map((level, index) => {
          const levelId = `level-${index}`;
          return (
            <AccordionItem
              value={levelId}
              key={index}
              onClick={() => setLevel(level.level)}
              className="flex flex-col gap-2 px-3 "
            >
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-medium">
                    Level {Number(level.level)}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {level.userCount.toString()} users
                </div>
                {/* <div className="text-sm font-medium">
                  {bigIntToString(
                    level?.totalAmount,
                    Number(tokenInfo?.decimals || 0),
                    0
                  )}{" "}
                  {tokenInfo?.symbol}
                </div> */}
              </AccordionTrigger>
              <AccordionContent className="px-1 font-bold">
                {Number(level.userCount) === 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-500">
                      No users in this level
                    </div>
                    {/* {LevelRequiredReferrals[index] >
                      Number(level.userCount) && (
                      <span className="text-sm font-light text-orange-500">
                        you need minimum {LevelRequiredReferrals[index]} direct
                        referrals earn from this level
                      </span>
                    )} */}
                  </div>
                ) : isLoadingLevelDetails ? (
                  <div className="text-sm">Loading...</div>
                ) : levelDetails ? (
                  <Table className="w-full">
                    <TableHeader className="bg-purple-500/50">
                      <TableRow>
                        <TableHead className="">S/N</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Email/Wallet</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levelDetails.map((detail, i) => (
                        <TableRow key={i} className="">
                          <TableCell className="font-medium tracking-tighter">
                            {i + 1}
                          </TableCell>
                          <TableCell>USER-{Number(detail.userId)}</TableCell>
                          <TableCell className="font-medium">
                            {shortenAddress(detail.userEmail)} (
                            {shortenAddress(detail.userAddress)})
                          </TableCell>
                          <TableCell className="text-right">
                            {bigIntToString(
                              detail.userDeposit,
                              Number(tokenInfo?.decimals || 0),
                              0
                            )}{" "}
                            {tokenInfo?.symbol}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">
                          {bigIntToString(
                            levelDetails.reduce(
                              (acc, curr) => acc + curr.userDeposit,
                              BigInt(0)
                            ),
                            tokenInfo?.decimals || 0,
                            0
                          )}{" "}
                          {tokenInfo?.symbol}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                ) : (
                  <div className="text-sm">Click to load details</div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })
      ) : (
        <>
          <div className="text-sm text-gray-500">No levels available</div>
        </>
      )}
    </Accordion>
  );
}
