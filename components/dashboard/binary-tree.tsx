import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useContractData } from "@/context/contract";
import { cn, bigIntToString } from "@/lib/utils";
// import Image from "next/image";
import { ChevronDown, User, Star, RotateCcw } from "lucide-react";
import { useGetUserBinaryTree, useUserInfo } from "@/hooks/use-user";
import { useUser } from "@/context/user";

interface BinaryNode {
  id: bigint;
  name: string;
  leftCount: bigint;
  rightCount: bigint;
  leftCarryForward: bigint;
  rightCarryForward: bigint;
  leftChildId: bigint;
  rightChildId: bigint;
}

const BinaryTreeNode = ({
  userId,
  setUserId,
  level = 1,
  isRoot = false,
}: {
  userId: bigint;
  setUserId: (id: bigint) => void;
  level?: number;
  isRoot?: boolean;
}) => {
  const { userInfo } = useUser();
  const [expanded, setExpanded] = useState(false);
  const { data: treeData, isLoading, error } = useGetUserBinaryTree(userId);
  const { tokenInfo } = useContractData();
  useEffect(() => {
    console.log({ treeData });
  }, [treeData]);

  if (userId === BigInt(0)) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 w-full justify-center">
        <Card className="py-4 border border-gray-600 bg-gray-800 shadow-md flex flex-col items-center gap-1 min-w-48 rounded-xl">
          <h2 className="text-xs text-gray-400 font-semibold flex items-center gap-2">
            <User size={12} /> Empty Node
          </h2>
          <h3 className="text-sm text-gray-500 font-bold">No User</h3>
          <button className="text-xs text-purple-200 mt-2 flex items-center gap-1 rounded px-2 py-1">
            EMPTY
            <ChevronDown className="w-4 h-4 transition-transform" />
          </button>
        </Card>

        {level < 3 && (
          <>
            <div className="flex flex-col items-center">
              <div className="h-4 w-1 bg-purple-500"></div>
              <div className="flex justify-center items-center gap-6">
                <div className="w-8 h-1 bg-purple-500"></div>
                <div className="text-purple-500 font-bold">↓</div>
                <div className="w-8 h-1 bg-purple-500"></div>
              </div>
            </div>
            <div className="flex gap-4 w-full items-start justify-center">
              <BinaryTreeNode
                userId={BigInt(0)}
                level={level + 1}
                setUserId={setUserId}
              />
              <BinaryTreeNode
                userId={BigInt(0)}
                level={level + 1}
                setUserId={setUserId}
              />
            </div>
          </>
        )}
      </div>
    );
  }
  if (isLoading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500 text-sm">Failed to load tree</p>;
  if (!treeData) return null;

  return (
    <div className=" flex flex-col items-center gap-0 py-4 w-full justify-center rounded-full">
      {/* User Card */}
      <Card className="relative py-4 border border-purple-500 bg-primary-900 shadow-md flex flex-col items-center gap-1 min-w-48 rounded-xl">
        {/* <Image src="/images/xeenux.png" alt="Icon" width={30} height={30} /> */}
        {isRoot && userId !== userInfo?.id && (
          <button
            className="absolute -top-2 -right-2 p-1 border border-purple-500/50 bg-purple-500 rounded-full"
            onClick={() => setUserId(userInfo?.id || BigInt(0))}
          >
            <RotateCcw size={16} />
          </button>
        )}
        <button
          onClick={() => {
            if (!isRoot) setUserId(userId);
          }}
        >
          <h2 className="text-xs text-purple-300 font-semibold flex items-center gap-2">
            <User size={12} />
            USER{Number(treeData.id)}
          </h2>
          <h3 className="text-sm text-purple-400 font-bold">
            {treeData.name} {userInfo?.id === userId && "(You)"}
          </h3>
        </button>
        <button
          className="text-xs text-purple-200 mt-2 flex items-center gap-1 bg-purple-500/50 rounded px-2 py-1"
          onClick={() => setExpanded(!expanded)}
        >
          Left: {bigIntToString(treeData.leftVolume, tokenInfo?.decimals, 0)} /
          Right: {bigIntToString(treeData.rightVolume, tokenInfo?.decimals, 0)}
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      </Card>
      {expanded && (
        <div className="relative min-w-56 top-4 h-0 text-xs">
          <div className="w-full border border-purple-500 z-50 absolute -top-5  flex flex-col items-center px-2 gap-2 py-2 justify-center rounded-none bg-gray-900">
            <div className="flex gap-1 items-center">
              <Star size={12} />
              Left Count: {treeData.leftCount.toString()}
            </div>
            <div className="flex gap-1 items-center">
              <Star size={12} />
              Right COUNT: {treeData.rightCount.toString()}
            </div>
            <div className="flex gap-1 items-center tracking-tighter">
              <Star size={12} />
              Left Carryforward:{" "}
              {bigIntToString(
                treeData.leftCarryForward,
                tokenInfo?.decimals,
                0,
              )}{" "}
              {tokenInfo?.symbol}
            </div>
            <div className="flex gap-1 items-center tracking-tighter">
              <Star size={12} />
              Right Carryforward:{" "}
              {bigIntToString(
                treeData.rightCarryForward,
                tokenInfo?.decimals,
                0,
              )}{" "}
              {tokenInfo?.symbol}
            </div>
          </div>
        </div>
      )}
      {/* Render Connection Line */}
      {/* extract to it's own component */}
      {level < 3 && (
        <>
          <div className="flex flex-col items-center">
            {/* Vertical Line (Arrow Indicator) */}
            <div className="h-4 w-1 bg-purple-500"></div>
            {/* Horizontal Line Between Children */}
            <div className="flex justify-center items-center gap-6">
              <div className="w-8 h-1 bg-purple-500"></div>
              <div className="text-purple-500 font-bold">↓</div>
              <div className="w-8 h-1 bg-purple-500"></div>
            </div>
          </div>
          <div className="flex gap-4 w-full items-start justify-center">
            {treeData.leftChildId ? (
              <BinaryTreeNode
                userId={treeData.leftChildId}
                level={level + 1}
                setUserId={setUserId}
              />
            ) : (
              <BinaryTreeNode
                userId={BigInt(0)}
                level={level + 1}
                setUserId={setUserId}
              />
            )}
            {treeData.rightChildId ? (
              <BinaryTreeNode
                userId={treeData.rightChildId}
                level={level + 1}
                setUserId={setUserId}
              />
            ) : (
              <BinaryTreeNode
                userId={BigInt(0)}
                level={level + 1}
                setUserId={setUserId}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

// **Binary Tree Root Component**
export const BinaryTree = ({ userId: _userId }: { userId: bigint }) => {
  const [userId, setUserId] = useState(_userId);
  return <BinaryTreeNode userId={userId} setUserId={setUserId} isRoot />;
};
