import { FixedMath } from "./FixedMath";
import { FixedInputType, FixedNumber } from "./FixedNumber";
import { FixedVec3 } from "./FixedVec3";

export class FixedMatrix33 {
  /**
   *  - - - - - - - - -
   * | m00 | m01 | m02 |
   * | m10 | m11 | m12 |
   * | m20 | m21 | m22 |
   *  - - - - - - - - -
   */
  m00: FixedNumber;
  m01: FixedNumber;
  m02: FixedNumber;
  m10: FixedNumber;
  m11: FixedNumber;
  m12: FixedNumber;
  m20: FixedNumber;
  m21: FixedNumber;
  m22: FixedNumber;

  constructor(
    m00?: FixedInputType,
    m01?: FixedInputType,
    m02?: FixedInputType,
    m10?: FixedInputType,
    m11?: FixedInputType,
    m12?: FixedInputType,
    m20?: FixedInputType,
    m21?: FixedInputType,
    m22?: FixedInputType
  ) {
    this.m00 = FixedNumber.new(m00);
    this.m01 = FixedNumber.new(m01);
    this.m02 = FixedNumber.new(m02);
    this.m10 = FixedNumber.new(m10);
    this.m11 = FixedNumber.new(m11);
    this.m12 = FixedNumber.new(m12);
    this.m20 = FixedNumber.new(m20);
    this.m21 = FixedNumber.new(m21);
    this.m22 = FixedNumber.new(m22);
  }

  clone(): FixedMatrix33 {
    return new FixedMatrix33(this.m00, this.m01, this.m02, this.m10, this.m11, this.m12, this.m20, this.m21, this.m22);
  }

  add(other: FixedMatrix33): FixedMatrix33 {
    this.m00 = this.m00.add(other.m00);
    this.m01 = this.m01.add(other.m01);
    this.m02 = this.m02.add(other.m02);
    this.m10 = this.m10.add(other.m10);
    this.m11 = this.m11.add(other.m11);
    this.m12 = this.m12.add(other.m12);
    this.m20 = this.m20.add(other.m20);
    this.m21 = this.m21.add(other.m21);
    this.m22 = this.m22.add(other.m22);
    return this;
  }

  sub(other: FixedMatrix33): FixedMatrix33 {
    this.m00 = this.m00.sub(other.m00);
    this.m01 = this.m01.sub(other.m01);
    this.m02 = this.m02.sub(other.m02);
    this.m10 = this.m10.sub(other.m10);
    this.m11 = this.m11.sub(other.m11);
    this.m12 = this.m12.sub(other.m12);
    this.m20 = this.m20.sub(other.m20);
    this.m21 = this.m21.sub(other.m21);
    this.m22 = this.m22.sub(other.m22);
    return this;
  }

  mul(other: FixedMatrix33): FixedMatrix33 {
    // row 1
    this.m00 = this.m00.mul(other.m00).add(this.m01.mul(other.m10)).add(this.m02.mul(other.m20));
    this.m01 = this.m00.mul(other.m01).add(this.m01.mul(other.m11)).add(this.m02.mul(other.m21));
    this.m02 = this.m00.mul(other.m02).add(this.m01.mul(other.m12)).add(this.m02.mul(other.m22));
    // row 2
    this.m10 = this.m10.mul(other.m00).add(this.m11.mul(other.m10)).add(this.m12.mul(other.m20));
    this.m11 = this.m10.mul(other.m01).add(this.m11.mul(other.m11)).add(this.m12.mul(other.m21));
    this.m11 = this.m10.mul(other.m02).add(this.m11.mul(other.m12)).add(this.m12.mul(other.m22));
    // row 3
    this.m20 = this.m20.mul(other.m00).add(this.m21.mul(other.m10)).add(this.m22.mul(other.m20));
    this.m21 = this.m20.mul(other.m01).add(this.m21.mul(other.m11)).add(this.m22.mul(other.m21));
    this.m22 = this.m20.mul(other.m02).add(this.m21.mul(other.m12)).add(this.m22.mul(other.m22));
    return this;
  }

  mulScalar(scalar: FixedInputType): FixedMatrix33 {
    this.m00 = this.m00.mul(scalar);
    this.m01 = this.m01.mul(scalar);
    this.m02 = this.m02.mul(scalar);
    this.m10 = this.m10.mul(scalar);
    this.m11 = this.m11.mul(scalar);
    this.m12 = this.m12.mul(scalar);
    this.m20 = this.m20.mul(scalar);
    this.m21 = this.m21.mul(scalar);
    this.m22 = this.m22.mul(scalar);
    return this;
  }

  mulVector(vec: FixedVec3): FixedVec3 {
    let x = this.m00.mul(vec.x).add(this.m01.mul(vec.y)).add(this.m02.mul(vec.z));
    let y = this.m10.mul(vec.x).add(this.m11.mul(vec.y)).add(this.m12.mul(vec.z));
    let z = this.m20.mul(vec.x).add(this.m21.mul(vec.y)).add(this.m22.mul(vec.z));
    return FixedVec3.new(x, y, z);
  }

  transpose(): FixedMatrix33 {
    // switch 01 with 10
    let tmp = this.m01;
    this.m01 = this.m10;
    this.m10 = tmp;
    // switch 02 with 20
    tmp = this.m02;
    this.m02 = this.m20;
    this.m20 = tmp;
    // switch 12 with 21
    tmp = this.m12;
    this.m12 = this.m21;
    this.m21 = tmp;
    return this;
  }

  determinant(): FixedNumber {
    let t1 = this.m00.mul(this.m11).mul(this.m22);
    let t2 = this.m01.mul(this.m12).mul(this.m20);
    let t3 = this.m02.mul(this.m10).mul(this.m21);
    let t4 = this.m20.mul(this.m11).mul(this.m02);
    let t5 = this.m21.mul(this.m12).mul(this.m00);
    let t6 = this.m22.mul(this.m10).mul(this.m01);
    return t1.add(t2).add(t3).sub(t4).sub(t5).sub(t6);
  }

  inverse(): FixedMatrix33 {
    let det = this.determinant();
    let detInv = det.eq(FixedMath.ZERO) ? FixedMath.ZERO : FixedMath.ONE.div(det);
    let detInvNeg = detInv.neg();

    let m00 = this.m11.mul(this.m22).sub(this.m12.mul(this.m21)).mul(detInv);
    let m01 = this.m01.mul(this.m22).sub(this.m21.mul(this.m02)).mul(detInvNeg);
    let m02 = this.m01.mul(this.m12).sub(this.m11.mul(this.m02)).mul(detInv);

    let m10 = this.m10.mul(this.m22).sub(this.m20.mul(this.m12)).mul(detInvNeg);
    let m11 = this.m00.mul(this.m22).sub(this.m20.mul(this.m02)).mul(detInv);
    let m12 = this.m00.mul(this.m12).sub(this.m10.mul(this.m02)).mul(detInvNeg);

    let m20 = this.m10.mul(this.m21).sub(this.m20.mul(this.m11)).mul(detInv);
    let m21 = this.m00.mul(this.m21).sub(this.m20.mul(this.m01)).mul(detInvNeg);
    let m22 = this.m00.mul(this.m11).sub(this.m10.mul(this.m01)).mul(detInv);
    
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    return this;
  }
}
