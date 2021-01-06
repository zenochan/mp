// eslint-disable-next-line import/no-unresolved
const automator: MiniProgramAutomator = require('miniprogram-automator');

export default class ZzTester {
  pagePath: string;

  app: MiniProgram;

  page: MiniPage;

  constructor(name: string, tests: (zz: ZzTester) => void) {
    // @ts-ignore
    describe(name, () => {
      // @ts-ignore
      beforeAll(async () => {
        this.app = await this.connect();
      }, 30000);
      // @ts-ignore
      afterAll(() => {
        this.app.disconnect();
      }, 30000);
      tests(this);
    });
  }

  static connect(port: number = 9420): Promise<MiniProgram> {
    return automator.connect({ wsEndpoint: `ws://localhost:${port}` });
  }

  connect(port: number = 9420): Promise<MiniProgram> {
    return automator.connect({ wsEndpoint: `ws://localhost:${port}` });
  }

  input(values: { [key: string]: string }) {
    return this.app.currentPage().then((page) => {
      Object.keys(values).forEach(async (key) => {
        await page.$(key).then((el) => el.input(values[key]));
      });
    });
  }

  tap(selector: string): Promise<void> {
    return this.app.currentPage()
      .then((page) => page.$(selector))
      .then((el) => el.tap());
  }

  wait(time: number = 1000) {
    return this.app.currentPage().then((page) => page.waitFor(time));
  }

  screenshot(path: string = 'screenshot/'): Promise<any> {
    const today = new Date();
    return this.app.screenshot({ path: `${path}/${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}/` });
  }
}
