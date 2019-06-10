/**
 * @module sync
 */

import {hashTreeRoot} from "@chainsafe/ssz";

import {BeaconBlock, Attestation} from "../types";
import {IBeaconDb} from "../db";
import {BeaconChain} from "../chain";
import {INetwork} from "../network";
import {OpPool} from "../opPool";

import {BLOCK_TOPIC, ATTESTATION_TOPIC} from "../network/constants";
import {slotToEpoch} from "../chain/stateTransition/util";

export class RegularSync {
  private db: IBeaconDb;
  private chain: BeaconChain;
  private network: INetwork;
  private opPool: OpPool;
  private rpc;

  public constructor(opts, {db, chain, network, opPool}) {
    this.db = db;
    this.chain = chain;
    this.network = network;
    this.opPool = opPool;
  }

  public async receiveBlock(block: BeaconBlock): Promise<void> {
    // TODO: skip block if its a known bad block
    // skip block if it already exists
    try {
      const root = hashTreeRoot(block, BeaconBlock);
      await this.db.getBlock(root);
      return;
    } catch (e) {}
    await this.chain.receiveBlock(block);
  }

  public async receiveAttestation(attestation: Attestation): Promise<void> {
    // skip attestation if it already exists
    try {
      const root = hashTreeRoot(attestation, Attestation);
      await this.db.getAttestation(root);
      return;
    } catch (e) {}
    // skip attestation if its too old
    const state = await this.db.getState();
    if (attestation.data.targetEpoch < slotToEpoch(state.finalizedEpoch)) {
      return;
    }
    // send attestation on to other modules
    await Promise.all([
      this.opPool.receiveAttestation(attestation),
      this.chain.receiveAttestation(attestation),
    ]);
  }

  public async start(): Promise<void> {
    this.network.subscribe(BLOCK_TOPIC);
    this.network.subscribe(ATTESTATION_TOPIC);
    this.network.on(BLOCK_TOPIC, this.receiveBlock.bind(this));
    this.network.on(ATTESTATION_TOPIC, this.receiveAttestation.bind(this));
  }
  public async stop(): Promise<void> {
    this.network.unsubscribe(BLOCK_TOPIC);
    this.network.unsubscribe(ATTESTATION_TOPIC);
    this.network.removeListener(BLOCK_TOPIC, this.receiveBlock.bind(this));
    this.network.removeListener(ATTESTATION_TOPIC, this.receiveAttestation.bind(this));
  }
}
