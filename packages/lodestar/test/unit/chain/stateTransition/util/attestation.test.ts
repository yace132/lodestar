import {expect} from "chai";
import sinon from "sinon";

import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import * as committee from "../../../../../src/chain/stateTransition/util/committee";

import {generateState} from "../../../../utils/state";
import {generateEmptyAttestation} from "../../../../utils/attestation";
import {getAttestationDataSlot} from "../../../../../src/chain/stateTransition/util";

describe('getAttestationDataSlot',()=>{
	let getCommitteeCountStub,getStartShardStub;
	const sandbox = sinon.createSandbox();
	
	beforeEach(() => {
    	getCommitteeCountStub = sandbox.stub(committee, 'getCommitteeCount');
	    getStartShardStub = sandbox.stub(committee, 'getStartShard');
	})

	afterEach(() => {
    	sandbox.restore();
  	});
	
	it(' should compute the correct slot ',()=>{
		const state = generateState();
		const attestation = generateEmptyAttestation();
		getCommitteeCountStub.returns(6400);
		getStartShardStub.returns(0);
		attestation.data.target.epoch = 10;
		attestation.data.crosslink.shard = 123;
		expect(getAttestationDataSlot(config,state,attestation.data)).to.be.equal(641);
	})
})