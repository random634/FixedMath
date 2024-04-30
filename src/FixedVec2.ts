import { FixedMath } from "./FixedMath";
import { FixedInputType, FixedNumber } from "./FixedNumber";

export class FixedVec2 {
  static X_AXIS = new FixedVec2(1, 0);
  static X_AXIS_INV = new FixedVec2(-1, 0);
  static Y_AXIS = new FixedVec2(0, 1);
  static Y_AXIS_INV = new FixedVec2(0, -1);

  static new(x?: FixedInputType, y?: FixedInputType): FixedVec2 {
    return new FixedVec2(x, y);
  }

  x: FixedNumber;
  y: FixedNumber;

  constructor(x?: FixedInputType, y?: FixedInputType) {
    this.x = FixedNumber.new(x);
    this.y = FixedNumber.new(y);
  }

  magnitude(): FixedNumber {
    let xx = this.x.mul(this.x);
    let yy = this.y.mul(this.y);
    return FixedMath.sqrt(xx.add(yy));
  }

  normalize(): FixedVec2 {
    let mag = this.magnitude();
    if (mag.le(0)) {
      return FixedVec2.new();
    }
    let x = this.x.div(mag);
    let y = this.y.div(mag);
    return FixedVec2.new(x, y);
  }

  negative(): FixedVec2 {
    let x = this.x.neg();
    let y = this.y.neg();
    return FixedVec2.new(x, y);
  }

  distance(other: FixedVec2): FixedNumber {
    let dx = this.x.sub(other.x);
    let dy = this.y.sub(other.y);
    let dxx = dx.mul(dx);
    let dyy = dy.mul(dy);
    return FixedMath.sqrt(dxx.add(dyy));
  }

  distanceSqr(other: FixedVec2): FixedNumber {
    let dx = this.x.sub(other.x);
    let dy = this.y.sub(other.y);
    let dxx = dx.mul(dx);
    let dyy = dy.mul(dy);
    return dxx.add(dyy);
  }

  add(other: FixedVec2): FixedVec2 {
    let x = this.x.add(other.x);
    let y = this.y.add(other.y);
    return FixedVec2.new(x, y);
  }

  sub(other: FixedVec2): FixedVec2 {
    let x = this.x.sub(other.x);
    let y = this.y.sub(other.y);
    return FixedVec2.new(x, y);
  }

  mul(scalar: FixedInputType): FixedVec2 {
    let x = this.x.mul(scalar);
    let y = this.y.mul(scalar);
    return FixedVec2.new(x, y);
  }

  div(scalar: FixedInputType): FixedVec2 {
    let x = this.x.div(scalar);
    let y = this.y.div(scalar);
    return FixedVec2.new(x, y);
  }

  dot(other: FixedVec2): FixedNumber {
    let xx = this.x.mul(other.x);
    let yy = this.y.mul(other.y);
    return xx.add(yy);
  }

  cross(other: FixedVec2): FixedNumber {
    return this.x.mul(other.y).sub(this.y.mul(other.x));
  }

  angle(other: FixedVec2): FixedNumber {
    let angle1 = FixedMath.atan2(this.y, this.x);
    let angle2 = FixedMath.atan2(other.y, other.x);
    let angle = angle2.sub(angle1);
    return angle;
  }

  project(other: FixedVec2): FixedVec2 {
    // dot1 = this.dot(other) = |this| * |other| * cos
    // dot2 = other.dot(other) = |other| * |other| * 1
    // projectLen = |this| * cos
    // project = other.mul(projectLen / other.magnitude)
    //         = other.mul(|this| * cos / |other|)
    //         = other.mul(dot1 / dot2)
    let dot2 = other.dot(other);
    if (dot2.le(0)) {
      return FixedVec2.new();
    }

    let dot1 = this.dot(other);
    return other.mul(dot1.div(dot2));
  }
}
