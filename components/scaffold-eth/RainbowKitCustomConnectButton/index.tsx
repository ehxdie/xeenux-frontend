"use client";

// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
    const { targetNetwork } = useTargetNetwork();
    const { isConnected, isConnecting, isDisconnected } = useAccount();
    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
                const connected = mounted && account && chain;

                return (
                    <>
                        {(() => {
                            if (!connected) {
                                return (
                                    <button
                                        className="btn bg-purple-500/50 text-white btn-sm"
                                        onClick={openConnectModal}
                                        type="button"
                                        disabled={isConnecting || isConnected}
                                    >
                                        {isConnected
                                            ? "Connected"
                                            : "Connect Wallet"}
                                    </button>
                                );
                            }

                            if (
                                chain.unsupported ||
                                chain.id !== targetNetwork.id
                            ) {
                                return <WrongNetworkDropdown />;
                            }

                            return (
                                <>
                                    <AddressInfoDropdown
                                        address={account.address as Address}
                                        displayName={account.displayName}
                                        ensAvatar={account.ensAvatar}
                                    />
                                </>
                            );
                        })()}
                    </>
                );
            }}
        </ConnectButton.Custom>
    );
};
