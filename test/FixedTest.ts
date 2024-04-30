import { hold, test, report } from "zora";
import { FixedMath } from "../src/FixedMath";
import { FixedNumber } from "../src/FixedNumber";

class FixedTest {
  static testAll() {
    test("constructors", (t) => {
      t.equal(new FixedNumber(2n).bn, 2n, "2n bigint");
      t.equal(new FixedNumber(2.22222).bn, 22222n, "2.22222 bigint");
      t.equal(new FixedNumber(20).bn, 200000n, "20 bigint)");
      t.equal(new FixedNumber(2.2).bn, 22000n, "2.2 bigint");
      t.equal(new FixedNumber(0.22).bn, 2200n, "0.22 bigint");
      t.equal(new FixedNumber(-0.01).bn, -100n, "-0.01 bigint");
      t.equal(new FixedNumber(0.0).bn, 0n, "0.0 bigint");
      t.equal(new FixedNumber(new FixedNumber(2n)).bn, 2n, "fixed 2n bigint");
    });

    test("fromString", (t) => {
      t.equal(new FixedNumber("2").bn, 20000n, "fromString 2)");
      t.equal(new FixedNumber("0.2").bn, 2000n, "fromString 0.2");
      t.equal(new FixedNumber("-0.2").bn, -2000n, "fromString -0.2)");
      t.equal(new FixedNumber("2.2").bn, 22000n, "fromString 2.2");
      t.equal(new FixedNumber("0.22222").bn, 2222n, "fromString 0.22222");
      t.equal(new FixedNumber("0x10").bn, 160000n, "fromString 0x10");
      t.equal(new FixedNumber("0o10").bn, 80000n, "fromString 0o10");
      t.equal(new FixedNumber("0b10").bn, 20000n, "fromString 0b10");
      try {
        new FixedNumber(NaN);
      } catch (e) {
        if (e instanceof Error) t.equal(e.message, "Cannot convert NaN to a BigInt", "NaN");
      }
      try {
        new FixedNumber("Infinity");
      } catch (e) {
        if (e instanceof Error) t.equal(e.message, "Cannot convert Infinity to a BigInt", "Inf");
      }
      try {
        new FixedNumber(Infinity);
      } catch (e) {
        if (e instanceof Error) t.equal(e.message, "Cannot convert Infinity to a BigInt", "Inf");
      }
    });

    test("toString", (t) => {
      t.equal(new FixedNumber("20").toString(), "20.0000", "20 toString");
      t.equal(new FixedNumber("2.2").toString(), "2.2000", "2.2 toString");
      t.equal(new FixedNumber("2.22222").toString(), "2.2222", "2.22222 toString");
      t.equal(new FixedNumber("0.01").toString(), "0.0100", "0.01 toString");
    });

    test("toNumber", (t) => {
      t.equal(new FixedNumber("20").toNumber(), 20, "20 toNumber");
      t.equal(new FixedNumber("2.2").toNumber(), 2.2, "2.2 toNumber");
      t.equal(new FixedNumber("2.22222").toNumber(), 2.2222, "2.22222 toNumber");
      t.equal(new FixedNumber("0.01").toNumber(), 0.01, "0.01 toNumber");
    });

    test("arithmetic", (t) => {
      t.equal(new FixedNumber(10).add(0.2).toNumber(), 10.2, "10 + 0.2");
      t.equal(new FixedNumber(0.2).add(-0.2).toNumber(), 0, "0.2 + (-0.2)");
      t.equal(new FixedNumber(0.3).sub("0.1").toNumber(), 0.2, "0.3 - 0.1");
      t.equal(new FixedNumber(0.3).sub(30).toNumber(), -29.7, "0.3 - 30");
    });

    test("multiplication", (t) => {
      t.equal(new FixedNumber(0.0011).mul(0.22).toNumber(), 0.0002, "0.0011 * 0.22");
      t.equal(new FixedNumber(0.11).mul(-0.0033).toNumber(), -0.0003, "0.11 * -0.0033");
      t.equal(new FixedNumber(-0.11).mul(-0.0033).toNumber(), 0.0003, "-0.11 * -0.0033");
    });

    test("division", (t) => {
      t.equal(new FixedNumber(2.3333).div(0.4).toNumber(), 5.8332, "2.3333 / 0.4");
      t.equal(new FixedNumber(2.3333).div(-0.04).toNumber(), -58.3325, "2.3333 / -0.04");
    });

    test("comparisons", (t) => {
      t.ok(new FixedNumber(3.14).eq(3.14) && new FixedNumber(3.14).ne(2), "eq, ne (true)");
      t.ok(!new FixedNumber(3.14).eq("4") && !new FixedNumber(3.14).ne(3.14), "eq, ne (false)");
      t.ok(new FixedNumber(3.14).lt("4") && new FixedNumber(3.14).le(4) && new FixedNumber(4).le(4), "lt, le (true)");
      t.ok(!new FixedNumber(3.14).lt("3.14") && !new FixedNumber(3.14).lt(1) && !new FixedNumber(3.14).le(1), "lt, le (false)");
      t.ok(new FixedNumber(3.14).gt("1") && new FixedNumber(1).ge(1) && new FixedNumber(3.14).ge(1), "gt, ge (true)");
      t.ok(!new FixedNumber(1).gt(1) && !new FixedNumber(3.14).gt(4) && !new FixedNumber(3.14).ge(4), "gt, ge (false)");
    });

    test("math", (t) => {
      t.equal(FixedMath.abs(-1.2).toNumber(), 1.2, "abs(-1.2) = 1.2");
      t.equal(FixedMath.sign(-1.2), -1, "sign(-1.2) = -1");
      t.equal(FixedMath.sin(-1.2).toNumber(), -0.932, `sin(-1.2) = -0.932, real ${Math.sin(-1.2)}`);
      t.equal(FixedMath.cos(-1.2).toNumber(), 0.3624, `cos(-1.2) = 0.3624, real ${Math.cos(-1.2)}`);
      t.equal(FixedMath.tan(1.2).toNumber(), 2.5717, `tan(1.2) = 2.5717, real ${Math.tan(1.2)}`);
      t.equal(FixedMath.atan(1.2).toNumber(), 0.8785, `atan(1.2) = 0.8785, real ${Math.atan(1.2)}`);
      t.equal(FixedMath.atan2(1.2, 1).toNumber(), 0.8785, `atan2(1.2, 1) = 0.8785, real ${Math.atan2(1.2, 1)}`);
      t.equal(FixedMath.ln(1.2).toNumber(), 0.1822, `ln(1.2) = 0.1822, real ${Math.log(1.2)}`);
      t.equal(FixedMath.exp(-1.2).toNumber(), 0.3012, `exp(-1.2) = 0.3012, real ${Math.exp(-1.2)}`);
      t.equal(FixedMath.sqrt(3.3).toNumber(), 1.8165, `sqrt(3.3) = 1.8165, real ${Math.sqrt(3.3)}`);
      t.equal(FixedMath.max(-1.2, 2, 1).toNumber(), 2, "max(-1.2, 2, 1) = 2");
      t.equal(FixedMath.min(-1.2, 2, 1).toNumber(), -1.2, "min(-1.2, 2, 1) = -1.2");
    });
  }
}

FixedTest.testAll();
