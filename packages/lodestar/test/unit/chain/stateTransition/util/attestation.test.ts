import {expect} from "chai";
import sinon from "sinon";

import {config} from "@chainsafe/eth2.0-config/lib/presets/mainnet";
import * as utils from "../../../../../src/chain/stateTransition/util";

import {generateState} from "../../../../utils/state";
import {generateEmptyAttestation} from "../../../../utils/attestation";
import {getAttestationDataSlot} from "../../../../../src/chain/stateTransition/util";

describe('getAttestationDataSlot',()=>{
	let getCommitteeCountStub,getStartShardStub;
	const sandbox = sinon.createSandbox();
	
	beforeEach(() => {
    	getCommitteeCountStub = sandbox.stub(utils, 'getCommitteeCount');
	    getStartShardStub = sandbox.stub(utils, 'getStartShard');
	})

	afterEach(() => {
    	sandbox.restore();
  	});
	
	it(' should compute the correct slot',()=>{
		const attestation = generateEmptyAttestation();
		const state = generateState();
		attestation.data.target.epoch = 10;
		getCommitteeCountStub.returns(6400);
		attestation.data.crosslink.shard = 123;
		getStartShardStub.returns(0);
		expect(getAttestationDataSlot(config,state,attestation.data)).to.be.equal(641);

	})
})