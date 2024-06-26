export type FixedInputType = number | string | BigInt | FixedNumber;

export class FixedNumber {
  private static _DEC_PLACE: number = 4; // decimal places after point, dp
  public static get DEC_PLACE(): number {
    return FixedNumber._DEC_PLACE;
  }

  private static _DEC_SCALE: number = 10 ** FixedNumber._DEC_PLACE; // decimal scale, 10^dp
  public static get DEC_SCALE(): number {
    return FixedNumber._DEC_SCALE;
  }

  private static _DEC_SCALE_BIG: bigint = BigInt(FixedNumber._DEC_SCALE); // decimal scale, 10^dp
  public static get DEC_SCALE_BIG(): bigint {
    return FixedNumber._DEC_SCALE_BIG;
  }

  public static new(obj?: FixedInputType) {
    return new FixedNumber(obj);
  }

  public bn: bigint = 0n;

  constructor(obj?: FixedInputType) {
    if (obj == null) {
      return;
    }

    this.init(obj);
  }

  init(obj: FixedInputType) {
    if (obj instanceof FixedNumber) {
      this.bn = obj.bn;
      return;
    }

    if (typeof obj === "bigint") {
      this.bn = obj;
      return;
    }

    if (typeof obj === "string") {
      obj = Number(obj);
    }

    if (typeof obj === "number") {
      let isNeg = obj < 0;
      let numStr = "" + Math.abs(obj);
      let nums = numStr.split(".");
      let intStr = nums[0];
      let decStr = nums[1] || "";
      let int = BigInt(intStr) * FixedNumber.DEC_SCALE_BIG;
      let dec = 0n;
      let decMult = FixedNumber.DEC_SCALE_BIG / 10n;
      for (let i = 0; i < decStr.length && i < FixedNumber.DEC_PLACE; i++) {
        dec = dec + BigInt(decStr[i]) * decMult;
        decMult = decMult / 10n;
      }

      this.bn = isNeg ? -(int + dec) : int + dec;
    }
  }

  toString(): string {
    let sign = this.bn < 0 ? "-" : "";
    let bnAbs = this.bn < 0 ? -this.bn : this.bn;
    let int = Number(bnAbs / FixedNumber.DEC_SCALE_BIG);
    let dec = Number(bnAbs % FixedNumber.DEC_SCALE_BIG);
    let decStr = `${dec}`;
    let prefixZero = FixedNumber.DEC_PLACE - decStr.length;
    if (prefixZero > 0) {
      decStr = "0".repeat(prefixZero) + decStr;
    }
    return `${sign}${int}.${decStr}`;
  }

  toNumber(): number {
    return Number(this.toString());
  }

  neg(): FixedNumber {
    return FixedNumber.new(-this.bn);
  }

  add(b: FixedInputType): FixedNumber {
    let otherBn = this._getBn(b);
    return FixedNumber.new(this.bn + otherBn);
  }

  sub(b: FixedInputType): FixedNumber {
    let otherBn = this._getBn(b);
    return FixedNumber.new(this.bn - otherBn);
  }

  mul(b: FixedInputType): FixedNumber {
    let otherBn = this._getBn(b);
    return FixedNumber.new((this.bn * otherBn) / FixedNumber.DEC_SCALE_BIG);
  }

  div(b: FixedInputType): FixedNumber {
    let otherBn = this._getBn(b);
    if (otherBn == 0n) {
      throw new Error("divide by zero");
    }
    return FixedNumber.new((this.bn * FixedNumber.DEC_SCALE_BIG) / otherBn);
  }

  eq(b: FixedInputType): boolean {
    let otherBn = this._getBn(b);
    return this.bn == otherBn;
  }

  ne(b: FixedInputType): boolean {
    let otherBn = this._getBn(b);
    return this.bn != otherBn;
  }

  gt(b: FixedInputType): boolean {
    let otherBn = this._getBn(b);
    return this.bn > otherBn;
  }

  ge(b: FixedInputType): boolean {
    let otherBn = this._getBn(b);
    return this.bn >= otherBn;
  }

  lt(b: FixedInputType): boolean {
    let otherBn = this._getBn(b);
    return this.bn < otherBn;
  }

  le(b: FixedInputType): boolean {
    let otherBn = this._getBn(b);
    return this.bn <= otherBn;
  }

  private _getBn(b: FixedInputType): bigint {
    if (b instanceof FixedNumber) {
      return b.bn;
    } else if (typeof b === "bigint") {
      return b;
    } else {
      return FixedNumber.new(b).bn;
    }
  }
}

FixedNumber.new(0.2).add(-0.2).toNumber(); // "0.0"
