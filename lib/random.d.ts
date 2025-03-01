declare abstract class Random {
  static intRange(min: number, max: number): number;
  static range(min: Rotomeca.Utils.Helper.Float, max: Rotomeca.Utils.Helper.Float): Rotomeca.Utils.Helper.Float;
  static random_string(size: number): string;
}

export = Random;