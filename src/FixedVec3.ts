import { FixedMath } from "./FixedMath";
import { FixedNumber, FixedInputType } from "./FixedNumber";

export class FixedVec3 {
  static X_AXIS = new FixedVec3(1, 0, 0);
  static X_AXIS_INV = new FixedVec3(-1, 0, 0);
  static Y_AXIS = new FixedVec3(0, 1, 0);
  static Y_AXIS_INV = new FixedVec3(0, -1, 0);
  static Z_AXIS = new FixedVec3(0, 0, 1);
  static Z_AXIS_INV = new FixedVec3(0, 0, -1);

  static new(x?: FixedInputType, y?: FixedInputType, z?: FixedInputType) {
    return new FixedVec3(x, y, z);
  }

  x: FixedNumber;
  y: FixedNumber;
  z: FixedNumber;

  constructor(x?: FixedInputType, y?: FixedInputType, z?: FixedInputType) {
    this.x = FixedNumber.new(x);
    this.y = FixedNumber.new(y);
    this.z = FixedNumber.new(z);
  }

  magnitude(): FixedNumber {
    let xx = this.x.mul(this.x);
    let yy = this.y.mul(this.y);
    let zz = this.z.mul(this.z);
    return FixedMath.sqrt(xx.add(yy).add(zz));
  }

  normalize(): FixedVec3 {
    let mag = this.magnitude();
    if (mag.le(0)) {
      return FixedVec3.new();
    }
    let x = this.x.div(mag);
    let y = this.y.div(mag);
    let z = this.z.div(mag);
    return FixedVec3.new(x, y, z);
  }

  negative(): FixedVec3 {
    let x = this.x.neg();
    let y = this.y.neg();
    let z = this.z.neg();
    return FixedVec3.new(x, y, z);
  }

  distance(other: FixedVec3): FixedNumber {
    let dx = this.x.sub(other.x);
    let dy = this.y.sub(other.y);
    let dz = this.z.sub(other.z);
    let dxx = dx.mul(dx);
    let dyy = dy.mul(dy);
    let dzz = dz.mul(dz);
    return FixedMath.sqrt(dxx.add(dyy).add(dzz));
  }

  distanceSqr(other: FixedVec3): FixedNumber {
    let dx = this.x.sub(other.x);
    let dy = this.y.sub(other.y);
    let dz = this.z.sub(other.z);
    let dxx = dx.mul(dx);
    let dyy = dy.mul(dy);
    let dzz = dz.mul(dz);
    return dxx.add(dyy).add(dzz);
  }

  add(other: FixedVec3): FixedVec3 {
    let x = this.x.add(other.x);
    let y = this.y.add(other.y);
    let z = this.z.add(other.z);
    return FixedVec3.new(x, y, z);
  }

  sub(other: FixedVec3): FixedVec3 {
    let x = this.x.sub(other.x);
    let y = this.y.sub(other.y);
    let z = this.z.sub(other.z);
    return FixedVec3.new(x, y, z);
  }

  mul(scalar: FixedNumber): FixedVec3 {
    let x = this.x.mul(scalar);
    let y = this.y.mul(scalar);
    let z = this.z.mul(scalar);
    return FixedVec3.new(x, y, z);
  }

  div(scalar: FixedNumber): FixedVec3 {
    let x = this.x.div(scalar);
    let y = this.y.div(scalar);
    let z = this.z.div(scalar);
    return FixedVec3.new(x, y, z);
  }

  dot(other: FixedVec3): FixedNumber {
    let xx = this.x.mul(other.x);
    let yy = this.y.mul(other.y);
    let zz = this.z.mul(other.z);
    return xx.add(yy).add(zz);
  }

  cross(other: FixedVec3): FixedVec3 {
    let x = this.y.mul(other.z).sub(this.z.mul(other.y));
    let y = this.z.mul(other.x).sub(this.x.mul(other.z));
    let z = this.x.mul(other.y).sub(this.y.mul(other.x));
    return FixedVec3.new(x, y, z);
  }

  project(other: FixedVec3): FixedVec3 {
    // dot1 = this.dot(other) = |this| * |other| * cos
    // dot2 = other.dot(other) = |other| * |other| * 1
    // projectLen = |this| * cos
    // project = other.mul(projectLen / other.magnitude)
    //         = other.mul(|this| * cos / |other|)
    //         = other.mul(dot1 / dot2)
    let dot2 = other.dot(other);
    if (dot2.le(0)) {
      return FixedVec3.new();
    }

    let dot1 = this.dot(other);
    return other.mul(dot1.div(dot2));
  }
}
