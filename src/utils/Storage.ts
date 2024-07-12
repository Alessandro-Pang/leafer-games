export default class Storage {
  private namespace: string = '__leafer-games__';

  private readonly supported: boolean = true;

  constructor() {
    this.supported = this.testStorageSupported();
    if (!this.supported) {
      throw new Error('您的浏览器不支持 localStorage!');
    }
  }

  get storage() {
    return window.localStorage;
  }

  /**
   * 校验浏览器是否支持 localStorage
   */
  testStorageSupported() {
    if (!this.storage) return false;
    const testStr = '__TEST_LOCALSTORAGE__';
    try {
      this.storage.setItem(testStr, testStr);
      const isOK = testStr === this.storage.getItem(testStr);
      this.storage.removeItem(testStr);
      return isOK;
    } catch (err) {
      return false;
    }
  }

  async get(key: string) {
    const val = this.storage.getItem(`${this.namespace}${key}`);
    return val ? JSON.parse(val) : val;
  }

  async set(key: string, val: any) {
    this.storage.setItem(`${this.namespace}${key}`, JSON.stringify(val));
  }

  /**
   * 删除指定存储内容
   * @param { String } key 存储键
   */
  async remove(key: string) {
    this.storage.removeItem(`${this.namespace}${key}`);
  }
}
