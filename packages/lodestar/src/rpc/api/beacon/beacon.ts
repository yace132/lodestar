/**
 * @module rpc/api
 */

import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {BeaconBlock, BeaconState, bytes32, Fork, number64, SyncingStatus} from "@chainsafe/eth2.0-types";
import {IBeaconApi} from "./interface";
import {BeaconChain} from "../../../chain";
import {BeaconDb} from "../../../db";

export class BeaconApi implements IBeaconApi {

  public namespace: string;

  private config: IBeaconConfig;
  private chain: BeaconChain;
  private db: BeaconDb;

  public constructor(opts, {config, chain, db}) {
    this.namespace = 'beacon';
    this.config = config;
    this.db = db;
    this.chain = chain;
  }


  public async getClientVersion(): Promise<bytes32> {
    return Buffer.from(`lodestar-${process.env.npm_package_version}`, 'utf-8');
  }

  public async getFork(): Promise<Fork> {
    const state: BeaconState = await this.db.state.getLatest();
    return state.fork;
  }

  public async getGenesisTime(): Promise<number64> {
    return await this.chain.latestState.genesisTime;
  }

  public async getSyncingStatus(): Promise<boolean | SyncingStatus> {
    // TODO: change this after sync service is implemented
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    return false;
  }

  public async getBeaconState(): Promise<BeaconState> {
    return await this.db.state.getLatest();
  }

  public async getChainHead(): Promise<BeaconBlock> {
    return await this.db.block.getChainHead();
  }

}
