import { EMPTY_STRING } from "./constants";
import { int, uint } from "./types";

/**
 * Donne des éléments pour générer de l'aléatoire
 */
export default class Random {
  /**
   * Génère une nombre entier entre 2 limites.
   * @param min Valeur minimum
   * @param max Valeur maximum
   */
  static intRange(min: int, max: int): int {
    min = Math.ceil(min) as unknown as int;
    max = Math.floor(max) as unknown as int;
    return ~~(Math.random() * (max - min) + min) as unknown as int;
  }

  /**
   * Génère une nombre entre 2 limites
   * @param min Valeur minimum
   * @param max Valeur maximum
   */
  static range(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * @deprecated utilisez {@link Random.randomString} plutôt
   * @param size 
   * @returns 
   */
  static random_string(size: uint): string {
    return this.randomString(size);
  }

  /**
   * Génère une chaîne aléatoire d'une taille définie
   * @param size
   */
  static randomString(size: uint): string {
    const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

    let str = EMPTY_STRING;

    for (let index = 0; index < size; ++index) {
      str += ALPHA[this.intRange(0 as unknown as int, ALPHA.length as unknown as int)];
    }

    return str;
  }
}