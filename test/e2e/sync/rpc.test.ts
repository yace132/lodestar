import {expect} from "chai";
import sinon from "sinon";
import BN from "bn.js";

import {SyncRpc} from "../../../src/sync/rpc";
import {Libp2pNetwork, INetworkOptions} from "../../../src/network";
import {BeaconDB, LevelDbController} from "../../../src/db";
import {Method} from "../../../src/network/codec";

import {MockBeaconChain} from "../../utils/mocks/chain/chain";
import {createNode} from "../../unit/network/libp2p/util";

const multiaddr = "/ip4/127.0.0.1/tcp/0";
const opts: INetworkOptions = {
  maxPeers: 1,
  bootnodes: [],
  rpcTimeout: 5000,
  connectTimeout: 5000,
  disconnectTimeout: 5000,
  multiaddrs: [],
};

describe("[sync] rpc", () => {
  const sandbox = sinon.createSandbox();

  let rpcHandlerA: SyncRpc, netA: Libp2pNetwork;
  let rpcHandlerB: SyncRpc, netB: Libp2pNetwork;
  beforeEach(async () => {
    netA = new Libp2pNetwork(opts, {libp2p: createNode(multiaddr)});
    netB = new Libp2pNetwork(opts, {libp2p: createNode(multiaddr)});
    await Promise.all([
      netA.start(),
      netB.start(),
    ]);
    rpcHandlerA = new SyncRpc({}, {
      db: new BeaconDB({
        controller: sandbox.createStubInstance(LevelDbController),
      }),
      chain: new MockBeaconChain({
        genesisTime: 0,
        chainId: 0,
        networkId: new BN(0),
      }),
      network: netA,
    });
    rpcHandlerB = new SyncRpc({}, {
      db: new BeaconDB({
        controller: sandbox.createStubInstance(LevelDbController),
      }),
      chain: new MockBeaconChain({
        genesisTime: 0,
        chainId: 0,
        networkId: new BN(0),
      }),
      network: netB,
    });
    netA.on("request", rpcHandlerA.onRequest.bind(rpcHandlerA));
    netB.on("request", rpcHandlerB.onRequest.bind(rpcHandlerB));
    await Promise.all([
      rpcHandlerA.start(),
      rpcHandlerB.start(),
    ]);
  });
  afterEach(async () => {
    await Promise.all([
      netA.stop(),
      netB.stop(),
    ]);
    await Promise.all([
      rpcHandlerA.stop(),
      rpcHandlerB.stop(),
    ]);
    netA.removeListener("request", rpcHandlerA.onRequest.bind(rpcHandlerA));
    netB.removeListener("request", rpcHandlerB.onRequest.bind(rpcHandlerB));
  });

  it("hello handshake on peer connect", async function() {
    this.timeout(6000);
    await netA.connect(netB.peerInfo);
    await Promise.all([
      new Promise((resolve) => netA.once("peer:connect", resolve)),
      new Promise((resolve) => netB.once("peer:connect", resolve)),
    ]);
    expect(netA.getPeer(netB.peerInfo)).to.not.equal(undefined);
    expect(netB.getPeer(netA.peerInfo)).to.not.equal(undefined);
    await new Promise((resolve) => {
      netA.once("request", resolve);
      netB.once("request", resolve);
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(netA.getPeer(netB.peerInfo).latestHello).to.not.equal(null);
    expect(netB.getPeer(netA.peerInfo).latestHello).to.not.equal(null);
  });

  it("goodbye on rpc stop", async function() {
    this.timeout(6000);
    await netA.connect(netB.peerInfo);
    await Promise.all([
      new Promise((resolve) => netA.once("peer:connect", resolve)),
      new Promise((resolve) => netB.once("peer:connect", resolve)),
    ]);
    await new Promise((resolve) => {
      netA.once("request", resolve);
      netB.once("request", resolve);
    });
    await new Promise((resolve) => setTimeout(resolve, 200));
    const goodbyeEvent = new Promise((resolve) => netB.once("request", resolve));
    await rpcHandlerA.stop();
    const goodbye = await goodbyeEvent;
    expect(goodbye).to.equal(Method.Goodbye);
  });
});
