import { HeartBeat, sleep } from "./heartBeat.ts";

const heartBeat = new HeartBeat(
  1000,
  1000,
  () => {
    console.log("scuuess");
  },
  () => {
    console.log("fail");
  },
  async () => {
    await sleep(Math.random() * 2000);
  }
);

heartBeat.start();

await sleep(10000);

heartBeat.stop();
