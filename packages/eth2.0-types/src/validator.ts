/**
 * @module types
 */

import {BLSPubkey, bytes48, number64, Shard, Slot, uint64} from "./primitive";

export interface ValidatorDuty {
  // The validator's public key, uniquely identifying them
  validatorPubkey: BLSPubkey;
  // The index of the validator in the committee
  committeeIndex: number64;
  // The slot at which the validator must attest
  attestationSlot: Slot;
  // The shard in which the validator must attest
  attestationShard: Shard;
  // The slot in which a validator must propose a block, this field can be Null
  blockProductionSlot: Slot;
}

export interface SyncingStatus {
  // The block at which syncing started (will only be reset, after the sync reached his head)
  startingBlock: uint64;
  // Current Block
  currentBlock: uint64;
  // The estimated highest block, or current target block number
  highestBlock: uint64;
}
