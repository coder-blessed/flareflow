import { useEffect, useState } from "react";
import {
  Wallet,
  Coins,
  TrendingUp,
  ArrowDownUp,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { connectWallet } from "../services/wallet";
import { faucetFXRP, faucetFBTC } from "../services/fasset";
import {
deposit,
withdraw,
getVaultBalance,
getVaultEarnings
}
from "../services/vault";
import { CONTRACTS } from "../contracts/addresses";


export default function Dashboard() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("100");
const [loading,setLoading]=useState(false);


const [fxrpBalance,setFxrpBalance]=useState("0");


const [fxrpEarned,setFxrpEarned]=useState("0");


const [fbtcBalance,setFbtcBalance]=useState("0");


const [fbtcEarned,setFbtcEarned]=useState("0");
  const [activeTab, setActiveTab] = useState<"home" | "vaults" | "market">("home");

  async function connect() {
    try {
      const provider = await connectWallet();
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
      toast.success("Wallet connected");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function action(callback: any) {
    try {
      setLoading(true);
      const id = toast.loading("Waiting for confirmation...");
      await callback();
      toast.success("Transaction complete ", { id });
    } catch (e: any) {
      toast.error(e.reason || e.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }


  async function loadVaultData(){

if(!address)
return;


try{


const fxrpBal =
await getVaultBalance(
CONTRACTS.XRP_VAULT,
address
);



const fxrpEarn =
await getVaultEarnings(
CONTRACTS.XRP_VAULT,
address
);



const fbtcBal =
await getVaultBalance(
CONTRACTS.BTC_VAULT,
address
);



const fbtcEarn =
await getVaultEarnings(
CONTRACTS.BTC_VAULT,
address
);



setFxrpBalance(
fxrpBal
);



setFxrpEarned(
fxrpEarn
);



setFbtcBalance(
fbtcBal
);



setFbtcEarned(
fbtcEarn
);



}
catch(e){

console.log(e);

}

}

useEffect(()=>{

loadVaultData();

},[address]);

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-neutral-900">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-3">
          <img
            src="https://flare.network/wp-content/uploads/2024/01/flare-logo.png"
            className="h-9 w-9 rounded-full ring-2 ring-pink-100"
            alt="FlareFlow"
          />
          <div>
            <h1 className="text-lg font-semibold leading-tight">FlareFlow</h1>
            <p className="text-xs text-neutral-400">Yield on Flare</p>
          </div>
        </div>

        <button
          onClick={connect}
          className="flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-100 active:scale-95"
        >
          <Wallet size={16} />
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect"}
        </button>
      </header>

      {/* Balance card */}
      <section className="mx-5 mt-6 rounded-3xl bg-gradient-to-br from-pink-500 to-pink-400 p-6 text-white shadow-lg shadow-pink-200/60">
        <p className="text-sm text-pink-100">Total Portfolio</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">$0.00</h2>
        <span className="mt-1 inline-block text-xs text-pink-100">
          Across FlareFlow Vaults
        </span>
      </section>

      {/* Amount input */}
      <div className="mx-5 mt-6">
        <label className="mb-1 block text-xs font-medium text-neutral-400">
          Amount
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          inputMode="decimal"
          className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
        />
      </div>

      {/* Vaults */}
      {(activeTab === "home" || activeTab === "vaults") && (
        <div className="mx-5 mt-6 space-y-4">
         <VaultCard
title="FXRP Vault"
apy="14%"
earnings={`${fxrpEarned} FXRP`}
balance={`${fxrpBalance} FXRP`}
            onFaucet={() => action(faucetFXRP)}
            onDeposit={() =>
              action(() => deposit(CONTRACTS.FXRP, CONTRACTS.XRP_VAULT, amount))
            }
            onWithdraw={() => action(() => withdraw(CONTRACTS.XRP_VAULT, amount))}
          />
     <VaultCard
title="FBTC Vault"
apy="12%"
earnings={`${fbtcEarned} FBTC`}
balance={`${fbtcBalance} FBTC`}
            onFaucet={() => action(faucetFBTC)}
            onDeposit={() =>
              action(() => deposit(CONTRACTS.FBTC, CONTRACTS.BTC_VAULT, amount))
            }
            onWithdraw={() => action(() => withdraw(CONTRACTS.BTC_VAULT, amount))}
          />
        </div>
      )}

      {/* Market */}
      {(activeTab === "home" || activeTab === "market") && (
        <section className="mx-5 mt-6 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <TrendingUp size={16} className="text-pink-500" />
            Market
          </h2>
          <div className="space-y-2">
            <MarketRow label="BTC" value="--" />
            <MarketRow label="XRP" value="--" />
          </div>
        </section>
      )}

      {/* Processing indicator */}
      {loading && (
        <div className="fixed left-1/2 top-6 -translate-x-1/2 rounded-full bg-neutral-900/90 px-4 py-2 text-xs text-white shadow-lg">
          Processing...
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-neutral-100 bg-white/90 py-3 backdrop-blur-lg">
        <TabButton
          icon={<Sparkles size={20} />}
          label="Home"
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <TabButton
          icon={<ArrowDownUp size={20} />}
          label="Vaults"
          active={activeTab === "vaults"}
          onClick={() => setActiveTab("vaults")}
        />
        <TabButton
          icon={<TrendingUp size={20} />}
          label="Market"
          active={activeTab === "market"}
          onClick={() => setActiveTab("market")}
        />
      </nav>
    </div>
  );
}

function VaultCard({

title,
apy,
earnings,
balance,
onFaucet,
onDeposit,
onWithdraw

}:{

title:string;
apy:string;
earnings:string;
balance:string;
onFaucet:()=>void;
onDeposit:()=>void;
onWithdraw:()=>void;

}){
  return (
    <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50">
          <Coins size={16} className="text-pink-500" />
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>

      <div className="mb-4 flex justify-between text-sm">
        <div>
          <p className="text-neutral-400">APY</p>
          <p className="font-semibold text-pink-500">{apy}</p>
        </div>
       <div className="text-right">

<p className="text-neutral-400">
Balance
</p>

<p className="font-semibold">
{balance}
</p>


<p className="mt-2 text-neutral-400">
Earnings
</p>

<p className="font-semibold">
{earnings}
</p>


</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onFaucet}
          className="rounded-xl bg-neutral-50 py-2 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 active:scale-95"
        >
          Faucet
        </button>
        <button
          onClick={onDeposit}
          className="rounded-xl bg-pink-500 py-2 text-xs font-medium text-white transition hover:bg-pink-600 active:scale-95"
        >
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          className="rounded-xl border border-pink-200 py-2 text-xs font-medium text-pink-500 transition hover:bg-pink-50 active:scale-95"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}

function MarketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-xl bg-neutral-50 px-4 py-3 text-sm">
      <span className="font-medium text-neutral-600">{label}</span>
      <span className="text-neutral-400">{value}</span>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-xs transition ${
        active ? "text-pink-500" : "text-neutral-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}