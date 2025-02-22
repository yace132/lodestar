/**
 * @module params
 */
import BN from "bn.js";

import {Epoch, Gwei, Slot, Shard} from "@chainsafe/eth2.0-types";

export interface IBeaconParams {
  // Misc
  SHARD_COUNT: number;
  TARGET_COMMITTEE_SIZE: number;
  MAX_VALIDATORS_PER_COMMITTEE: number;
  MIN_PER_EPOCH_CHURN_LIMIT: number;
  CHURN_LIMIT_QUOTIENT: number;
  SHUFFLE_ROUND_COUNT: number;
  MIN_GENESIS_TIME: number;
  MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: number;

  // Deposit contract
  DEPOSIT_CONTRACT_ADDRESS: number;

  // Gwei Values
  MIN_DEPOSIT_AMOUNT: Gwei;
  MAX_EFFECTIVE_BALANCE: Gwei;
  EJECTION_BALANCE: Gwei;
  EFFECTIVE_BALANCE_INCREMENT: Gwei;

  // Initial values
  GENESIS_SLOT: Slot;
  GENESIS_EPOCH: Epoch;
  BLS_WITHDRAWAL_PREFIX_BYTE: Buffer;
  GENESIS_FORK_VERSION: Buffer;
  GENESIS_START_SHARD: Shard;

  // Time parameters
  SECONDS_PER_SLOT: number;
  MIN_ATTESTATION_INCLUSION_DELAY: number;
  SLOTS_PER_EPOCH: number;
  MIN_SEED_LOOKAHEAD: number;
  ACTIVATION_EXIT_DELAY: number;
  SLOTS_PER_ETH1_VOTING_PERIOD: number;
  ETH1_FOLLOW_DISTANCE: number;
  SLOTS_PER_HISTORICAL_ROOT: number;
  MIN_VALIDATOR_WITHDRAWAL_DELAY: number;
  PERSISTENT_COMMITTEE_PERIOD: number;
  MAX_EPOCHS_PER_CROSSLINK: number;

  MIN_EPOCHS_TO_INACTIVITY_PENALTY: number;

  // State list lengths
  EPOCHS_PER_HISTORICAL_VECTOR: number;
  EPOCHS_PER_SLASHINGS_VECTOR: number;
  HISTORICAL_ROOTS_LIMIT: number;
  VALIDATOR_REGISTRY_LIMIT: number;

  // Reward and penalty quotients
  BASE_REWARD_FACTOR: number;
  BASE_REWARDS_PER_EPOCH: number;
  WHISTLEBLOWING_REWARD_QUOTIENT: number;
  PROPOSER_REWARD_QUOTIENT: number;
  INACTIVITY_PENALTY_QUOTIENT: BN;
  MIN_SLASHING_PENALTY_QUOTIENT: number;

  // Max operations per block
  MAX_PROPOSER_SLASHINGS: number;
  MAX_ATTESTER_SLASHINGS: number;
  MAX_ATTESTATIONS: number;
  MAX_DEPOSITS: number;
  MAX_VOLUNTARY_EXITS: number;
  MAX_TRANSFERS: number;
}
