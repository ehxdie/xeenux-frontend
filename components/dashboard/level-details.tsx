import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { shortenAddress } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLevelData } from "@/hooks/use-level-data";

export function LevelDetailsAccordion() {
  const {
    levels,
    levelDetails,
    isLoading,
    setLevel,
    currentLevel
  } = useLevelData();

  if (isLoading && !levels.length) {
    return <div>Loading levels...</div>;
  }

  return (
    <Accordion type="single" collapsible>
      {levels && levels.length > 0 ? (
        levels.map((level, index) => {
          const levelId = `level-${index}`;
          const isCurrentLevel = currentLevel === level.level;

          return (
            <AccordionItem
              value={levelId}
              key={index}
              onClick={() => setLevel(level.level)}
              className="flex flex-col gap-2 px-3"
            >
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-medium">
                    Level {level.level}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {level.userCount} users
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1 font-bold">
                {level.userCount === 0 ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-gray-500">
                      No users in this level
                    </div>
                  </div>
                ) : isLoading && isCurrentLevel ? (
                  <div className="text-sm">Loading...</div>
                ) : levelDetails ? (
                  <Table className="w-full">
                    <TableHeader className="bg-purple-500/50">
                      <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Email/Wallet</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levelDetails.map((detail, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium tracking-tighter">
                            {i + 1}
                          </TableCell>
                          <TableCell>USER-{detail.userId}</TableCell>
                          <TableCell className="font-medium">
                            {shortenAddress(detail.userEmail)} (
                            {shortenAddress(detail.userAddress)})
                          </TableCell>
                          <TableCell className="text-right">
                            {detail.userDeposit} XNX
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">
                          {levelDetails.reduce(
                            (acc, curr) => acc + curr.userDeposit,
                            0
                          )}{" "}
                          XNX
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
        <div className="text-sm text-gray-500">No levels available</div>
      )}
    </Accordion>
  );
}