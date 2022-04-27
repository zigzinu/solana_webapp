import { Connection, PublicKey, clusterApiUrl, RpcResponseAndContext, SignatureResult } from '@solana/web3.js';
import React, { FC, useEffect, useRef, useState } from 'react';

interface AirdropProps {
    pubkey: PublicKey;
}

const network = "devnet";

const Airdrop: FC<AirdropProps> = ({ pubkey }) => {

    // Create a connection to blockchain and make it persistent across reders
    const connection = useRef(new Connection(clusterApiUrl(network)));

    const [ publickey ] = useState<string>(pubkey.toBase58());
    const [ sol, setSol ] = useState(1);
    const [ txid, setTxid] = useState<string | null>(null);
    const [ slot, setSlot ] = useState<number | null>(null);
    const [ balance, setBalance ] = useState(0);

    // Retrieve the balance when mounting the component
    useEffect( () => {
        connection.current.getBalance(pubkey).then(setBalance);
    }, [pubkey]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        setTxid(null);
        setSlot(null);
        var lamports = sol * 1000000000;
        pubkey && connection.current.requestAirdrop(pubkey, lamports)
        .then((id: string) => {
            console.log(`Transaction ID ${id}`);
            setTxid(id);
            connection.current.confirmTransaction(id)
            .then((confirmation: RpcResponseAndContext<SignatureResult>) => {
                console.log(`Confirmation slot: ${confirmation.context.slot}`);
                setSlot(confirmation.context.slot);
                connection.current.getBalance(pubkey).then(setBalance);
            });
        })
        .catch(console.error);
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSol(parseInt(event.target.value));
    }

    return (
        <div>
            <p className="p15">&nbsp;</p>
            <form onSubmit={handleSubmit}>
                <label>Public Key to receive airdrop</label><br/>
                <input type="text" readOnly={true} value={publickey} className="input-text" /><br/>
                <label>SOL to request</label><br/>
                <input type="number" value={sol} onChange={handleChange} className="input-text" /><br/>
                <input type="submit" value="Request airdrop" className="input-submit" />
            </form>
            Transaction: { txid ? <p>{txid}</p> : null }
            <br/>
            Confirmation slot: { slot ? <p>{slot}</p> : null }
            <hr />
            <p>Your current balance is: {balance}</p>
        </div>
    )
}

export default Airdrop;