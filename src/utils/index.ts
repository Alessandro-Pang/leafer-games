/**
 * 随机整数
 * @param min
 * @param max
 */
export const randomInt = (min: number, max: number) => {
  const random = Math.random();
  return Math.floor(random * (max - min + 1) + min);
};

/**
 * @param val
 */
export const isNil = (val: any) => !val && val !== 0;
