/**
 * @module eth1
 */

import defaults from "./defaults";
import {ContractTransaction, ethers, Wallet} from "ethers";
import {Provider} from "ethers/providers";
import {DepositData, number64} from "../types";
import BN from "bn.js";
import bls from "@chainsafe/bls-js";
import {hash} from "../util/crypto";
import {BLS_WITHDRAWAL_PREFIX_BYTE, Domain} from "../constants";
import {signingRoot} from "@chainsafe/ssz";
import {BigNumber} from "ethers/utils";

export class Eth1Wallet {

  private wallet: Wallet;

  public constructor(privateKey: string, provider?: Provider) {
    if(!provider) {
      provider = ethers.getDefaultProvider();
    }
    this.wallet = new Wallet(privateKey, provider);
  }

  /**
   * Will deposit 32 ETH to eth2.0 deposit contract.
   * @param address address of deposit contract
   * @param amount amount to wei to deposit on contract
   */
  public async createValidatorDeposit(address: string, value: BigNumber): Promise<string> {
    // Minor hack, no real performance loss
    const amount = new BN(value.toString()).div(new BN(1000000000));

    let contract = new ethers.Contract(address, defaults.depositContract.abi, this.wallet);
    const privateKey = hash(Buffer.from(address, 'hex'));
    const pubkey = bls.generatePublicKey(privateKey);
    const withdrawalCredentials = Buffer.concat([
      BLS_WITHDRAWAL_PREFIX_BYTE,
      hash(pubkey).slice(1),
    ]);

    // Create deposit data
    const depositData: DepositData = {
      pubkey,
      withdrawalCredentials,
      amount,
      signature: Buffer.alloc(96)
    };

    const signature = bls.sign(
      privateKey,
      signingRoot(depositData, DepositData),
      Buffer.from([0, 0, 0, Domain.DEPOSIT]));
    console.log('xx')
    console.log(amount.toString())
    console.log(pubkey.length)
    console.log(withdrawalCredentials.length)
    console.log(signature.length)
    // Send TX
    try {
      const tx: ContractTransaction = await contract.deposit(
        pubkey,
        withdrawalCredentials,
        signature,
        {value});
      await tx.wait();
      return tx.hash;
    } catch(e) {
      console.log(e)
    }
  }
}
