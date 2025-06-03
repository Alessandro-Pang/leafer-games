/*
 * @Author: zi.yang
 * @Date: 2024-07-14 21:46:47
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-04 01:36:01
 * @Description:
 * @FilePath: /leafer-games/src/utils/index.ts
 */
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
