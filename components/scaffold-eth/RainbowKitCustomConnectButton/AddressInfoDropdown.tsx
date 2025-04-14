import { getAddress } from "viem";
import { Address } from "viem";
import { BlockieAvatar, isENS } from "~~/components/scaffold-eth";
import { useAccountModal } from "@rainbow-me/rainbowkit";

type AddressInfoDropdownProps = {
  address: Address;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
}: AddressInfoDropdownProps) => {
  const checkSumAddress = getAddress(address);
  const { openAccountModal } = useAccountModal();

  return (
    <>
      <details className="leading-3" onClick={openAccountModal}>
        <summary tabIndex={0} className="btn bg-purple-500/20 text-white btn-sm pl-2 pr-2 border border-white/10 gap-0 !h-auto">
          <BlockieAvatar address={checkSumAddress} size={20} ensImage={ensAvatar} />
          <span className="ml-2 mr-1">
            {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
          </span>
        </summary>
      </details>
    </>
  );
};
