export function sleep(time: number) {
  return new Promise<void>((reslove) => {
    setTimeout(reslove, time);
  });
}

export class HeartBeat {
  constructor(
    public time: number,
    public timeout: number,
    public success: () => void,
    public fail: () => void,
    public beat: () => Promise<void>
  ) {}

  private status = false;

  private manulStopHandler:
    | null
    | [resolve: () => void, reject: () => void] = null;
  private timeoutHandler:
    | null
    | [resolve: () => void, reject: () => void] = null;

  private watchBeat() {
    return new Promise<void>((reslove, reject) => {
      this.timeoutHandler = [reslove, reject];
      setTimeout(() => {
        this.rejectWatchBeat();
      }, this.timeout);
    });
  }

  private watchManulStop() {
    return new Promise<void>((reslove, reject) => {
      this.manulStopHandler = [reslove, reject];
    });
  }

  private rejectWatchBeat() {
    if (this.timeoutHandler) {
      this.timeoutHandler[1]();
      this.timeoutHandler = null;
    }
  }

  private resloveWatchBeat() {
    if (this.timeoutHandler) {
      this.timeoutHandler[0]();
      this.timeoutHandler = null;
    }
  }

  private async tryBeat() {
    try {
      await Promise.race([this.beat(), this.watchBeat()]);
      this.resloveWatchBeat();
      this.success();
    } catch (error) {
      this.timeoutHandler = null;
      this.fail();
    }
  }

  public async start() {
    this.status = true;
    try {
      while (this.status) {
        await Promise.race([this.tryBeat(), this.watchManulStop()]);
        this.resolveManulStop();
        await sleep(this.time);
      }
    } catch {
      console.log("manulStop");
    }
  }

  private resolveManulStop() {
    if (this.manulStopHandler) {
      this.manulStopHandler[0]();
      this.manulStopHandler = null;
    }
  }

  private rejectManulStop() {
    if (this.manulStopHandler) {
      this.manulStopHandler[1]();
      this.manulStopHandler = null;
    }
  }

  public stop() {
    this.status = false;
    this.rejectManulStop();
  }
}
