import FixedNumber from "./FixedNumber";

export default class FixedMath {
  static readonly ZERO: FixedNumber = FixedNumber.new(0);
  static readonly ONE: FixedNumber = FixedNumber.new(1);
  static readonly TWO: FixedNumber = FixedNumber.new(2);

  /** The mathematical constant e. This is Euler's number, the base of natural logarithms. */
  static readonly E: FixedNumber = FixedNumber.new(2.718281828459045);
  /** The natural logarithm of 2. */
  static readonly LN2: FixedNumber = FixedNumber.new(0.6931471805599453);
  /** The natural logarithm of 10. */
  static readonly LN10: FixedNumber = FixedNumber.new(2.302585092994046);
  /** The base-2 logarithm of e. */
  static readonly LOG2E: FixedNumber = FixedNumber.new(1.4426950408889634);
  /** The base-10 logarithm of e. */
  static readonly LOG10E: FixedNumber = FixedNumber.new(0.4342944819032518);
  /** Pi. This is the ratio of the circumference of a circle to its diameter. */
  static readonly PI: FixedNumber = FixedNumber.new(3.141592653589793);
  /** Half of Pi. */
  static readonly PI1_2: FixedNumber = FixedNumber.new(FixedMath.PI.bn >> 1n);
  /** Quarter of Pi. */
  static readonly PI1_4: FixedNumber = FixedNumber.new(FixedMath.PI.bn >> 2n);
  /** Double of Pi */
  static readonly PI2: FixedNumber = FixedNumber.new(FixedMath.PI.bn << 1n);
  /** The square root of 0.5, or, equivalently, one divided by the square root of 2. */
  static readonly SQRT1_2: FixedNumber = FixedNumber.new(0.7071067811865476);
  /** The square root of 2. */
  static readonly SQRT2: FixedNumber = FixedNumber.new(1.4142135623730951);

  private static _DEBUG: boolean = true;

  // the sign
  static sign(x: number | string | BigInt | FixedNumber): number {
    x = this._toFixedNumber(x);
    if (x.bn < 0n) {
      return -1;
    }
    return 1;
  }

  // the absolute
  static abs(x: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);
    if (x.bn >= 0n) {
      return FixedNumber.new(x);
    }

    return FixedNumber.new(-x.bn);
  }

  // the sine
  static sin(x: number | string | BigInt | FixedNumber): FixedNumber {
    let xOrig = this._toFixedNumber(x);
    let xRound = this._round4Sine(xOrig);
    // Taylor series.
    // sin(x) = x - x^3/3! + x^5/5! - ...
    // where |x| < pi/2

    let xStep = xRound.mul(xRound);
    let xVal = xRound;
    let nStep = 1;
    let nVal = FixedMath.ONE;
    let signVal = 1;
    let t = xVal;
    let result = FixedMath.ZERO;
    let iterateCnt = 0;
    while (FixedMath.abs(t).gt(FixedMath.ZERO)) {
      result = signVal > 0 ? result.add(t) : result.sub(t);

      iterateCnt++;

      xVal = xVal.mul(xStep);

      nStep = nStep + 1;
      nVal = nVal.mul(nStep);
      nStep = nStep + 1;
      nVal = nVal.mul(nStep);

      signVal = -signVal;
      t = xVal.div(nVal);
    }

    this._DEBUG && console.log(`[FixedMath] sin(${xOrig.toString()}) = ${result.toString()}, iterateCnt = ${iterateCnt}`);

    return result;
  }

  // the cosine
  static cos(x: number | string | BigInt | FixedNumber): FixedNumber {
    let xOrig = this._toFixedNumber(x);
    let xRound = this._round4Sine(xOrig);
    // Taylor series.
    // cos(x) = 1 - x^2/2! + x^4/4! - ...
    // where |x| < pi/2

    let xStep = xRound.mul(xRound);
    let xVal = FixedMath.ONE;
    let nStep = 0;
    let nVal = FixedMath.ONE;
    let signVal = 1;
    let t = xVal;
    let result = FixedMath.ZERO;
    let iterateCnt = 0;
    while (FixedMath.abs(t).gt(FixedMath.ZERO)) {
      result = signVal > 0 ? result.add(t) : result.sub(t);

      iterateCnt++;

      xVal = xVal.mul(xStep);

      nStep = nStep + 1;
      nVal = nVal.mul(nStep);
      nStep = nStep + 1;
      nVal = nVal.mul(nStep);

      signVal = -signVal;
      t = xVal.div(nVal);
    }

    this._DEBUG && console.log(`[FixedMath] cos(${xOrig.toString()}) = ${result.toString()}, iterateCnt = ${iterateCnt}`);

    return result;
  }

  // the tangent
  static tan(x: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);
    x = this._round4Tangent(x);
    let e = FixedMath.PI1_2.sub(x);
    if (FixedMath.abs(e).le(0.01)) {
      let sine = this.sin(e);
      let cose = this.cos(e);
      let result = cose.div(sine);
      return result;
    }

    let sinx = this.sin(x);
    let cosx = this.cos(x);
    let result = sinx.div(cosx);
    return result;
  }

  // the arc sine (or inverse sine)
  static asin(x: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);
    if (FixedMath.abs(x).gt(FixedMath.ONE)) {
      throw new Error(`[FixedMath] asin argument must be in range [-1, 1]`);
    }

    let y = FixedMath.sqrt(FixedMath.ONE.sub(x.mul(x)));
    let tan = x.div(y);
    return FixedMath.atan(tan);
  }

  // the arc cosine (or inverse cosine)
  static acos(x: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);
    if (FixedMath.abs(x).gt(FixedMath.ONE)) {
      throw new Error(`[FixedMath] acos argument must be in range [-1, 1]`);
    }

    let y = FixedMath.sqrt(FixedMath.ONE.sub(x.mul(x)));
    let tan = y.div(x);
    return FixedMath.atan(tan);
  }

  // the arc tangent (or inverse tangent)
  static atan(x: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);

    // https://www.cnblogs.com/shine-lee/p/13330676.html
    // Approximations
    // atan(x) = PI / 4 * x + 0.273 * x * (1 - |x|) where |x| <= 1

    if (FixedMath.abs(x).gt(FixedMath.ONE)) {
      // atan(x) = PI / 2 - atan(1 / x) where |x| > 1
      let result = FixedMath.PI1_2.sub(FixedMath.atan(FixedMath.ONE.div(x)));
      return result;
    }

    let result = FixedMath.PI1_4.mul(x);
    result = result.add(FixedMath.ONE.sub(FixedMath.abs(x)).mul(0.273).mul(x));
    return result;
  }

  // the natural logarithm (base e)
  static ln(y: number | string | BigInt | FixedNumber): FixedNumber {
    let yOrig = this._toFixedNumber(y);
    if (yOrig.le(FixedMath.ZERO)) {
      throw new Error(`[FixedMath] ln of negative number ${yOrig.toString()}`);
    }

    // Argument reduction
    // ln(a * 10 ^ b) = ln(a) + b * ln(10)
    let yReduce = yOrig;
    let b = 0;
    let limit10 = FixedNumber.new(10);
    while (FixedMath.abs(yReduce).ge(limit10)) {
      yReduce = yReduce.div(10);
      b++;
    }

    while (FixedMath.abs(yReduce).lt(FixedMath.ONE)) {
      yReduce = yReduce.mul(10);
      b--;
    }

    // Taylor series.
    // ln(y) = ln((1 + x)/(1 - x)) = ln(1 + x) - ln(1 - x) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
    // where x = (y - 1)/(y + 1)        // -1 < x < 1, 0 < y < inf
    let x = yReduce.sub(FixedMath.ONE).div(yReduce.add(FixedMath.ONE));

    let xStep = x.mul(x);
    let xVal = x;
    let nStep = FixedMath.TWO;
    let nVal = FixedMath.ONE;
    let t = xVal;
    let result = FixedMath.ZERO;
    let iterateCnt = 0;
    while (FixedMath.abs(t).gt(FixedMath.ZERO)) {
      result = result.add(t);

      iterateCnt++;

      xVal = xVal.mul(xStep);
      nVal = nVal.add(nStep);
      t = xVal.div(nVal);
    }

    result = result.mul(2).add(FixedMath.LN10.mul(b));

    this._DEBUG && console.log(`[FixedMath] ln(${yOrig.toString()}) = ${result.toString()}, iterateCnt = ${iterateCnt}`);

    return result;
  }

  static log2(x: number | string | BigInt | FixedNumber): FixedNumber {
    // log2(x) = ln(x) / ln(2)
    let lnx = FixedMath.ln(x);
    let ln2 = FixedMath.LN2;
    return lnx.div(ln2);
  }

  static log10(x: number | string | BigInt | FixedNumber): FixedNumber {
    // log10(x) = ln(x) / ln(10)
    let lnx = FixedMath.ln(x);
    let ln10 = FixedMath.LN10;
    return lnx.div(ln10);
  }

  // e (the base of natural logarithms) raised to a power
  static exp(x: number | string | BigInt | FixedNumber): FixedNumber {
    let xOrig = this._toFixedNumber(x);

    // Taylor series.
    // e^x = 1 + x + x^2/2! + x^3/3! + x^4/4! + ... // -inf < x < inf
    let xStep = x;
    let xVal = FixedMath.ONE;
    let nStep = FixedMath.ZERO;
    let nVal = FixedMath.ONE;
    let t = xVal;
    let result = FixedMath.ZERO;
    let iterateCnt = 0;
    while (FixedMath.abs(t).gt(FixedMath.ZERO)) {
      result = result.add(t);

      iterateCnt++;

      xVal = xVal.mul(xStep);

      nStep = nStep.add(FixedMath.ONE);
      nVal = nVal.mul(nStep);

      t = xVal.div(nVal);
    }

    this._DEBUG && console.log(`[FixedMath] exp(${xOrig.toString()}) = ${result.toString()}, iterateCnt = ${iterateCnt}`);

    return result;
  }

  // a base expression taken to a specified power
  static pow(x: number | string | BigInt | FixedNumber, y: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);
    y = this._toFixedNumber(y);
    if (x.lt(FixedMath.ZERO) && y.bn % FixedNumber.DEC_SCALE_BIG != 0n) {
      throw new Error("[FixedMath] pow argument must be integer when base is negative");
    }

    if (x.eq(FixedMath.ZERO)) {
      return FixedMath.ZERO;
    }

    // x^y = e^(y * ln(x))
    let lnx = FixedMath.ln(x);
    let result = FixedMath.exp(y.mul(lnx));
    return result;
  }

  // the square root
  static sqrt(x: number | string | BigInt | FixedNumber): FixedNumber {
    x = this._toFixedNumber(x);
    if (x.bn < 0n) {
      throw new Error(`[FixedMath] sqrt square root of negative number ${x.toString()}`);
    }

    if (x.bn == 0n) {
      return FixedNumber.new(0);
    }

    // Newton-Raphson iteration.
    // t = x / 2 + 1;
    let iterateCnt = 0;
    let t = (x.bn >> 1n) + FixedNumber.DEC_SCALE_BIG;
    while ((t * t) / FixedNumber.DEC_SCALE_BIG > x.bn) {
      // t = (t + x / t) / 2;
      t = (t + (x.bn * FixedNumber.DEC_SCALE_BIG) / t) >> 1n;
      iterateCnt++;
    }
    let result = FixedNumber.new(t);

    this._DEBUG && console.log(`[FixedMath] sqrt(${x.toString()}) = ${result.toString()}, iterateCnt = ${iterateCnt}`);

    return result;
  }

  // the largest
  static max(...values: (number | string | BigInt | FixedNumber)[]): FixedNumber {
    let maxV = this._toFixedNumber(values[0]);
    for (let i = 1; i < values.length; i++) {
      let v = this._toFixedNumber(values[i]);
      if (v.gt(maxV)) {
        maxV = v;
      }
    }
    return FixedNumber.new(maxV);
  }

  // the smallest
  static min(...values: (number | string | BigInt | FixedNumber)[]): FixedNumber {
    let minV = this._toFixedNumber(values[0]);
    for (let i = 1; i < values.length; i++) {
      let v = this._toFixedNumber(values[i]);
      if (v.lt(minV)) {
        minV = v;
      }
    }
    return FixedNumber.new(minV);
  }

  private static _toFixedNumber(x: number | string | BigInt | FixedNumber): FixedNumber {
    if (x instanceof FixedNumber) {
      return x;
    }

    return FixedNumber.new(x);
  }

  private static _round4Sine(x: FixedNumber): FixedNumber {
    let bn = x.bn % FixedMath.PI2.bn;
    let sign = 1;
    if (bn > FixedMath.PI1_2.bn) {
      bn -= FixedMath.PI.bn;
      sign = -sign;
      if (bn > FixedMath.PI1_2.bn) {
        bn -= FixedMath.PI.bn;
        sign = -sign;
      }
    } else if (bn < -FixedMath.PI1_2.bn) {
      bn += FixedMath.PI.bn;
      sign = -sign;
      if (bn < -FixedMath.PI1_2.bn) {
        bn += FixedMath.PI.bn;
        sign = -sign;
      }
    }

    return sign > 0 ? FixedNumber.new(bn) : FixedNumber.new(-bn);
  }

  private static _round4Tangent(x: FixedNumber): FixedNumber {
    let bn = x.bn % FixedMath.PI.bn;
    if (bn > FixedMath.PI1_2.bn) {
      bn -= FixedMath.PI.bn;
    } else if (bn < -FixedMath.PI1_2.bn) {
      bn += FixedMath.PI.bn;
    }
    return FixedNumber.new(bn);
  }
}
