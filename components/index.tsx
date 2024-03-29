import {
  useState,
  useEffect,
  SetStateAction,
  ReactEventHandler,
  FormEvent,
  ChangeEvent,
} from 'react';
import { toast } from 'react-toastify';
import React from 'react';
import { Noir } from '@noir-lang/noir_js';
import { BarretenbergBackend, flattenPublicInputs } from '@noir-lang/backend_barretenberg';
import { CompiledCircuit, ProofData } from '@noir-lang/types';
import { compile, PathToFileSourceMap } from '@noir-lang/noir_wasm';
import { useAccount, useConnect, useContractWrite } from 'wagmi';
import { contractCallConfig } from '../utils/wagmi.jsx';
import { bytesToHex } from 'viem';
import { ConnectKitButton } from 'connectkit';
import Qr from './qr.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card.jsx';
import Dashboard from './dashboard.jsx';

function Component() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [recheck, setRecheck] = useState(false);
  const [user, setUser] = useState<any>({ category: '', loggedIn: false });
  const { isConnected } = useAccount();

  useEffect(() => {
    console.log('useEffect called');

    if (isConnected) {
      setWalletConnected(true);
      const user = localStorage.getItem('user');
      if (user) {
        setUser(JSON.parse(user));
      }
    } else {
      setWalletConnected(false);
    }
  }, [isConnected, recheck]);

  return (
    <>
      <div className="p-4 flex justify-between bg-slate-50 rounded-lg my-2 mx-10 shadow-lg">
        <div className="flex gap-2 items-center">
          <img src="/logo.svg" className="h-10 w-10" />
          <h1 className="font-bold">zkCreditScore</h1>
        </div>
        <ConnectKitButton showBalance />
      </div>
      {walletConnected ? (
        user.loggedIn ? (
          <Dashboard />
        ) : (
          <div className="flex justify-center mx-auto mt-40">
            <Card>
              <CardHeader>
                <CardTitle>Credit Score</CardTitle>
                <CardDescription>
                  Click the button below to generate your credit score proof.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Qr setRecheck={setRecheck} />
              </CardContent>
            </Card>
          </div>
        )
      ) : (
        <div className="mt-40 w-full flex flex-col items-center justify-center">
          <div className="text-center text-4xl font-bold">Welcome to zkCreditScore</div>
          <div className="text-center text-xl font-bold">
            A privacy-preserving credit score system
          </div>
          {/* <div className="flex justify-center w-full">
            {' '}
            <img src="/intro.png" className="w-[60%] rounded-lg shadow-lg" />
          </div> */}
        </div>
      )}
    </>
  );
}

export default Component;
