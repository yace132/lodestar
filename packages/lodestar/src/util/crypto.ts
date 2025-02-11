/**
 * @module util/crypto
 */

import {bytes, bytes32,} from "@chainsafe/eth2.0-types";
import {hash as hash256} from "@chainsafe/ssz";

export function hash(value: bytes): bytes32 {
  return hash256(value);
}
