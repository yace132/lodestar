import {join} from "path";
import {describeSpecTest} from "@chainsafe/eth2.0-spec-test-util";
import {expect} from "chai";
// @ts-ignore
import {restore, rewire} from "@chainsafe/bls-js";
import sinon from "sinon";
import {equals} from "@chainsafe/ssz";

import {BeaconState, Transfer} from "@chainsafe/eth2.0-types";
import {config} from "@chainsafe/eth2.0-config/lib/presets/minimal";
import {processTransfer} from "../../../../src/chain/stateTransition/block/operations";
import {expandYamlValue} from "../../../utils/expandYamlValue";

describeSpecTest(
  join(__dirname, "../../test-cases/tests/operations/transfer/transfer_minimal.yaml"),
  (state, transfer) => {
    processTransfer(config, state, transfer);
    return state;
  },
  (input) => {
    if(input.bls_setting && input.bls_setting.toNumber() === 2) {
      rewire({
        verify: sinon.stub().returns(true),
        verifyMultiple: sinon.stub().returns(true)
      });
    }
    return [expandYamlValue(input.pre, config.types.BeaconState), expandYamlValue(input.transfer, config.types.Transfer)];
  },
  (expected) => {
    return expandYamlValue(expected.post, config.types.BeaconState);
  },
  result => result,
  (testCase) => {
    return !testCase.post;
  },
  () => false,
  (_1, _2, expected, actual) => {
    expect(equals(expected, actual, config.types.BeaconState)).to.be.true;
    restore();
  },
  0
);

