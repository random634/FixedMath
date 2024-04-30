import { FixedMath } from "./FixedMath";
import { FixedInputType, FixedNumber } from "./FixedNumber";
import { FixedVec2 } from "./FixedVec2";

export class FixedMatrix22 {
  /**
   *  - - - - - -
   * | m00 | m01 |
   * | m10 | m11 |
   *  - - - - - -
   */
  m00: FixedNumber;
  m01: FixedNumber;
  m10: FixedNumber;
  m11: FixedNumber;

  constructor(m00?: FixedInputType, m01?: FixedInputType, m10?: FixedInputType, m11?: FixedInputType) {
    this.m00 = FixedNumber.new(m00);
    this.m01 = FixedNumber.new(m01);
    this.m10 = FixedNumber.new(m10);
    this.m11 = FixedNumber.new(m11);
  }

  clone(): FixedMatrix22 {
    return new FixedMatrix22(this.m00, this.m01, this.m10, this.m11);
  }

  add(other: FixedMatrix22): FixedMatrix22 {
    this.m00 = this.m00.add(other.m00);
    this.m01 = this.m01.add(other.m01);
    this.m10 = this.m10.add(other.m10);
    this.m11 = this.m11.add(other.m11);
    return this;
  }

  sub(other: FixedMatrix22): FixedMatrix22 {
    this.m00 = this.m00.sub(other.m00);
    this.m01 = this.m01.sub(other.m01);
    this.m10 = this.m10.sub(other.m10);
    this.m11 = this.m11.sub(other.m11);
    return this;
  }

  mul(other: FixedMatrix22): FixedMatrix22 {
    this.m00 = this.m00.mul(other.m00).add(this.m01.mul(other.m10));
    this.m01 = this.m00.mul(other.m01).add(this.m01.mul(other.m11));
    this.m10 = this.m10.mul(other.m00).add(this.m11.mul(other.m10));
    this.m11 = this.m10.mul(other.m01).add(this.m11.mul(other.m11));
    return this;
  }

  mulScalar(scalar: FixedInputType): FixedMatrix22 {
    this.m00 = this.m00.mul(scalar);
    this.m01 = this.m01.mul(scalar);
    this.m10 = this.m10.mul(scalar);
    this.m11 = this.m11.mul(scalar);
    return this;
  }

  mulVector(vec: FixedVec2): FixedVec2 {
    return FixedVec2.new(this.m00.mul(vec.x).add(this.m01.mul(vec.y)), this.m10.mul(vec.x).add(this.m11.mul(vec.y)));
  }

  transpose(): FixedMatrix22 {
    // switch 01 with 10
    let tmp = this.m01;
    this.m01 = this.m10;
    this.m10 = tmp;
    return this;
  }

  determinant(): FixedNumber {
    let t1 = this.m00.mul(this.m11);
    let t2 = this.m01.mul(this.m10);
    return t1.sub(t2);
  }

  inverse(): FixedMatrix22 {
    let det = this.determinant();
    let detInv = det.eq(FixedMath.ZERO) ? FixedMath.ZERO : FixedMath.ONE.div(det);
    let detInvNeg = detInv.neg();
    let m00 = this.m11.mul(detInv);
    let m01 = this.m01.mul(detInvNeg);
    let m10 = this.m10.mul(detInvNeg);
    let m11 = this.m00.mul(detInv);

    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
    return this;
  }
}
