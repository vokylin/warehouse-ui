import { Decimal } from "decimal.js";

// 减法
export function sub(x, args = []) {
  if (args.length > 0) {
    args.forEach((arg) => {
      x = new Decimal(x).sub(arg);
    });
  }
  return x;
}

export function subtract(...args) {
  if (args.length === 0) {
    return 0;
  }
  return args.reduce((acc, cur) => {
    return Decimal.sub(acc, cur).toNumber();
  });
}

// 加法
export function add(x, args = []) {
  if (args.length > 0) {
    args.forEach((arg) => {
      x = new Decimal(x).add(arg);
    });
  }
  return x;
}

export function addition(...args) {
  if (args.length === 0) {
    return 0;
  }
  return args.reduce((acc, cur) => {
    return Decimal.add(acc, cur).toNumber();
  });
}

// 乘法
export function mul(...args) {
  // 判断是否有参数
  if (args.length === 0) {
    return 0;
  }
  if (args.some((arg) => arg === null)) {
    return 0;
  }
  // 所有参数相乘
  return args.reduce((acc, cur) => {
    return Decimal.mul(acc, cur).toNumber();
  });
}

// 除法
export function div(...args) {
  // 判断是否有参数
  if (args.length === 0) {
    return 0;
  }
  if (args.some((arg) => arg === null)) {
    return 0;
  }
  // 所有参数相除
  return args.reduce((acc, cur) => {
    return Decimal.div(acc, cur).toNumber();
  });
}

export function toNumber(number) {
  return new Decimal(number)
}
