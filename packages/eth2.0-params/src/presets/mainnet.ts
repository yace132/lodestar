/**
 * @module params/presets/mainnet
 */
import BN from "bn.js";

// Misc
export const SHARD_COUNT = 2 ** 10; // 1024 shards
export const TARGET_COMMITTEE_SIZE = 2 ** 7; // 128 validators
export const MAX_VALIDATORS_PER_COMMITTEE = 2 ** 12; // 4096
export const MIN_PER_EPOCH_CHURN_LIMIT = 2 ** 2; // 4
export const CHURN_LIMIT_QUOTIENT = 2 ** 16; // 65536
export const BASE_REWARDS_PER_EPOCH = 5;
export const SHUFFLE_ROUND_COUNT = 90;
export const MIN_GENESIS_ACTIVE_VALIDATOR_COUNT = 2 ** 16;
export const MIN_GENESIS_TIME = 1578009600;

// Deposit contract
export const DEPOSIT_CONTRACT_ADDRESS = 0;
export const DEPOSIT_CONTRACT_TREE_DEPTH = 2 ** 5; // 32

// Gwei Values
export const MIN_DEPOSIT_AMOUNT = new BN(2 ** 0 * 1e9); // 1,000,000,000 Gwei
export const MAX_EFFECTIVE_BALANCE = new BN(2 ** 5 * 1e9); // 32,000,000,000 Gwei
export const EJECTION_BALANCE = new BN(2 ** 4 * 1e9); // 16,000,000,000 Gwei
export const EFFECTIVE_BALANCE_INCREMENT = new BN(2 ** 0 * 1e9); // 1,000,000,000 Gwei

// Initial values
export const GENESIS_SLOT = 0;
export const GENESIS_EPOCH = 0;
export const BLS_WITHDRAWAL_PREFIX_BYTE = Buffer.alloc(1, 0);
export const GENESIS_FORK_VERSION = Buffer.alloc(4, 0);
export const GENESIS_START_SHARD = 0;

// Time parameters
export const SECONDS_PER_SLOT = 6;
export const MIN_ATTESTATION_INCLUSION_DELAY = 2 ** 0; // slots || 6 seconds
export const SLOTS_PER_EPOCH = 2 ** 6; // slots || 6.4 minutes
export const MIN_SEED_LOOKAHEAD = 2 ** 0; // epochs || 6.4 minutes
export const ACTIVATION_EXIT_DELAY = 2 ** 2; // epochs || 25.6 minutes
export const SLOTS_PER_ETH1_VOTING_PERIOD = 2 ** 10; // slots || ~1.7 hours
export const ETH1_FOLLOW_DISTANCE = 2 ** 10; // blocks || ~4 hours
export const SLOTS_PER_HISTORICAL_ROOT = 2 ** 13; // slots || ~13 hours
export const MIN_VALIDATOR_WITHDRAWAL_DELAY = 2 ** 8; // epochs || ~27 hours
export const PERSISTENT_COMMITTEE_PERIOD = 2 ** 11; // epochs || 9 days
export const MAX_EPOCHS_PER_CROSSLINK = 2**6; //epochs	|| ~7 hours

// should be a small constant times SHARD_COUNT // SLOTS_PER_EPOCH
export const MAX_CROSSLINK_EPOCHS = 2 ** 6; // 64
export const MIN_EPOCHS_TO_INACTIVITY_PENALTY = 2 ** 2; // 25.6 minutes

// State list lengths
export const EPOCHS_PER_HISTORICAL_VECTOR = 2 ** 16;
export const EPOCHS_PER_SLASHINGS_VECTOR = 2 ** 13;
export const HISTORICAL_ROOTS_LIMIT = 2 ** 24;
export const VALIDATOR_REGISTRY_LIMIT = 2 ** 40;

// Reward and penalty quotients
export const BASE_REWARD_FACTOR = 2 ** 6; // 32
export const WHISTLEBLOWING_REWARD_QUOTIENT = 2 ** 9; // 512
export const PROPOSER_REWARD_QUOTIENT = 2 ** 3; // 8
export const INACTIVITY_PENALTY_QUOTIENT = new BN(2 ** 25); // 33,554,432
export const MIN_SLASHING_PENALTY_QUOTIENT = 2 ** 5; // 32

// Max operations per block
export const MAX_PROPOSER_SLASHINGS = 2 ** 4; // 16
export const MAX_ATTESTER_SLASHINGS = 2 ** 0; // 1
export const MAX_ATTESTATIONS = 2 ** 7; // 128
export const MAX_DEPOSITS = 2 ** 4; // 16
export const MAX_VOLUNTARY_EXITS = 2 ** 4; // 16
export const MAX_TRANSFERS = 0;
