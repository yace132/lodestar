/**
 * @module sync
 */

import {EventEmitter} from "events";
import {BeaconChain} from "../chain";
import {INetwork} from "../network";
import {OpPool} from "../opPool";
import {IEth1Notifier} from "../eth1";
import {IBeaconDb} from "../db";
import {RpcHandler} from "./rpc";
import {RegularSync} from "./regular";

/**
 * The Sync service syncing data between the network and the local chain
 * The strategy may differ depending on whether the chain is synced or not
 */
export class Sync extends EventEmitter {
  private opts;
  private chain: BeaconChain;
  private network: INetwork;
  private opPool: OpPool;
  private eth1: IEth1Notifier;
  private db: IBeaconDb;
  private rpc: RpcHandler;
  private syncer;

  public constructor(opts, {chain, db, eth1, network, opPool}) {
    super();
    this.opts = opts;
    this.chain = chain;
    this.db = db;
    this.eth1 = eth1;
    this.network = network;
    this.opPool = opPool;
    this.rpc = new RpcHandler(opts, {db, chain, network});
  }

  public async isSynced(): Promise<boolean> {
    if (!await this.eth1.isAfterEth2Genesis()) {
      return true;
    }
    try {
      const bestSlot = await this.db.getChainHeadSlot();
      const bestSlotByPeers = this.network.getPeers()
        .map((peer) => peer.latestHello ? peer.latestHello.bestSlot : 0)
        .reduce((a, b) => Math.max(a, b), 0);
      if (bestSlot >= bestSlotByPeers) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  public async start(): Promise<void> {
    await this.rpc.start();
    await this.rpc.refreshPeerHellos();
    if (await this.isSynced()) {
      this.syncer = new RegularSync(this.opts, {
        db: this.db,
        chain: this.chain,
        network: this.network,
        opPool: this.opPool,
      });
      this.syncer.start();
    } else {
      /*
      this.syncer = new InitialSync(this.opts, {
        db: this.db,
        chain: this.chain,
        network: this.network,
        opPool: this.opPool,
      });
       */
    }
  }

  public async stop(): Promise<void> {
    await this.rpc.stop();
    await this.syncer.stop();
  }
}
