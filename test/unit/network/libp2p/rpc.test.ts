import {assert} from "chai";
import BN from "bn.js";
import promisify from "promisify-es6";

import {NetworkRpc} from "../../../../src/network/libp2p/rpc";

import {createNode} from "./util";
import {NodejsNode} from "../../../../src/network/libp2p/nodejs";
import {Method} from "../../../../src/network/codec";
import {Hello} from "../../../../src/types";

const multiaddr = "/ip4/127.0.0.1/tcp/0";

describe("[network] rpc", () => {
  let nodeA: NodejsNode, nodeB: NodejsNode,
    rpcA: NetworkRpc, rpcB: NetworkRpc;
  beforeEach(async () => {
    // setup
    nodeA = await createNode(multiaddr);
    nodeB = await createNode(multiaddr);
    await Promise.all([
      promisify(nodeA.start.bind(nodeA))(),
      promisify(nodeB.start.bind(nodeB))(),
    ]);
    rpcA = new NetworkRpc(nodeA);
    rpcB = new NetworkRpc(nodeB);
    await Promise.all([
      rpcA.start(),
      rpcB.start(),
    ]);
  });
  afterEach(async () => {
    // teardown
    await Promise.all([
      rpcA.stop(),
      rpcB.stop(),
    ]);
    await Promise.all([
      promisify(nodeA.stop.bind(nodeA))(),
      promisify(nodeB.stop.bind(nodeB))(),
    ]);
  });
  it("creates a peer when when new libp2p peers are added", async function () {
    this.timeout(3000);
    await promisify(nodeA.dial.bind(nodeA))(nodeB.peerInfo);
    try {
      await new Promise((resolve, reject) => {
        const t = setTimeout(reject, 2000);
        rpcA.once("peer:connect", () => {
          clearTimeout(t);
          resolve();
        });
      });
    } catch (e) {
      assert.fail("no peer connected");
    }
  });
  it("can list peers", async function () {
    this.timeout(3000);
    await promisify(nodeA.dial.bind(nodeA))(nodeB.peerInfo);
    try {
      await new Promise((resolve, reject) => {
        const t = setTimeout(reject, 2000);
        rpcA.once("peer:connect", () => {
          clearTimeout(t);
          resolve();
        });
      });
      assert.equal(rpcA.getPeers().length, 1);
    } catch (e) {
      assert.fail(e, null, "connection event not triggered");
    }
  });
  it("can remove a peer", async function () {
    this.timeout(3000)
    await promisify(nodeA.dial.bind(nodeA))(nodeB.peerInfo);
    try {
      await new Promise((resolve, reject) => {
        const t = setTimeout(reject, 2000);
        rpcA.once("peer:connect", () => {
          clearTimeout(t);
          resolve();
        });
      });
    } catch (e) {
      assert.fail(e, null, "connection event not triggered");
    }
    try {
      const p = new Promise((resolve, reject) => {
        const t = setTimeout(reject, 2000);
        rpcA.once("peer:disconnect", () => {
          clearTimeout(t);
          resolve();
        });
      });
      promisify(nodeA.hangUp.bind(nodeA))(nodeB.peerInfo);
      await p
    } catch (e) {
      assert.fail(e, null, "disconnection event not triggered");
    }
  });
  it("can send/receive messages from connected peers", async function () {
    this.timeout(6000);
    await promisify(nodeA.dial.bind(nodeA))(nodeB.peerInfo);
    try {
      await new Promise((resolve, reject) => {
        const t = setTimeout(reject, 2000);
        rpcB.once("peer:connect", () => {
          clearTimeout(t);
          resolve();
        });
      });
    } catch (e) {
      assert.fail(e, null, "connection event not triggered");
    }
    // send hello from A to B, await hello response
    rpcB.once("request", (method, id, body) => {
      rpcB.sendResponse(id, 0, body)
    });
    try {
      const helloExpected: Hello = {
        networkId: new BN(0),
        chainId: 0,
        latestFinalizedRoot: Buffer.alloc(32),
        latestFinalizedEpoch: 0,
        bestRoot: Buffer.alloc(32),
        bestSlot: 0,
      };
      const helloActual = await rpcA.getPeers()[0].sendRequest<Hello>(Method.Hello, helloExpected);
      assert.deepEqual(helloActual, helloExpected);
    } catch (e) {
      assert.fail("hello not received");
    }
    // send hello from B to A, await hello response
    rpcA.once("request", (method, id, body) => {
      rpcA.sendResponse(id, 0, body)
    });
    try {
      const helloExpected: Hello = {
        networkId: new BN(0),
        chainId: 0,
        latestFinalizedRoot: Buffer.alloc(32),
        latestFinalizedEpoch: 0,
        bestRoot: Buffer.alloc(32),
        bestSlot: 0,
      };
      const helloActual = await rpcB.getPeers()[0].sendRequest<Hello>(Method.Hello, helloExpected);
      assert.deepEqual(helloActual, helloExpected);
    } catch (e) {
      assert.fail("hello not received");
    }
  });
});
