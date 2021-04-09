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
    await sleep(900);
  }
);

heartBeat.start();

await sleep(3600);

heartBeat.stop();
