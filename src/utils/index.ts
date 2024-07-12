export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const isNil = (val: any) => !val && val !== 0;
