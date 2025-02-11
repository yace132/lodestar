import {bytes32, MerkleTree, number64} from "@chainsafe/eth2.0-types";

export interface IProgressiveMerkleTree {

  depth(): number;

  /**
   * push new item into the tree
   */
  push(item: bytes32): void;

  add(index: number64, item: bytes32): void;

  getProof(index: number64): bytes32[];

  /**
   * The merkle root of the tree
   */
  root(): bytes32;

  toObject(): MerkleTree;
}
