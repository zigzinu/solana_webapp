import { FC, useEffect, useState } from 'react';
import web3, { PublicKey, Transaction } from '@solana/web3.js';
import Airdrop from './Airdrop';
import TransferSol from './TransferSol';

type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

export interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, callback: (args:any) => void) => void;
    isPhantom: boolean;
    publicKey: PublicKey;
    signTransaction: (t: Transaction) => {}
}

type WindowWithSolana = Window & {
    solana?: PhantomProvider;
}

const ConnectPhantomWallet: FC = () => {

    const [ walletAvailable, setWalletAvailable ] = useState(false);
    const [ provider, setProvider ] = useState<PhantomProvider | null>(null);
    const [ connected, setConnected ] = useState(false);

    useEffect( () => {
        if ("solana" in window) {
            const solWindow = window as WindowWithSolana;
            if (solWindow?.solana?.isPhantom) {
                setProvider(solWindow.solana); // wallet object
                setWalletAvailable(true);
                // Attempt an eager connection if app is already in Phantom's list of trusted apps.
                solWindow.solana.connect({ onlyIfTrusted: true });
            }
        }
    }, []);

    useEffect( () => {
        provider?.on("connect", (publicKey: PublicKey) => {
            console.log(`connect event: ${publicKey}`);
            setConnected(true);
        });
        provider?.on("disconnect", () => {
            console.log("disconnect event");
            setConnected(false);
        })
    }, [provider]);

    const connectHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log("connect handler");
        provider?.connect()
        .catch((err) => {
            console.error("connect ERROR:", err);
        });
    }

    const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log("disconnect handler");
        provider?.disconnect()
        .catch((err) => {
            console.error("disconnect ERROR:", err);
        });
    }

    return (
        <div>
            { walletAvailable ?
                <>
                <button disabled={connected} onClick={connectHandler}>Connect to Phantom</button>
                <button disabled={!connected} onClick={disconnectHandler}>Disconnect from Phantom</button>
                <hr/>
                { connected && provider ? 
                    <div>
                    <Airdrop pubkey={provider.publicKey} />
                    <TransferSol provider={provider} />
                    </div> : null }
                </>
            :
                <>
                <p>Oops!! Phantom is not available. Go get it <a href="https://phantom.app/">https://phantom.app/</a>.</p></>}
        </div>
    )
}

export default ConnectPhantomWallet;