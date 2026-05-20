import { EMPTY_STRING } from "./constants";
import { int, toInt, uint } from "./types";

/**
 * Classe utilitaire pour générer des nombres et des chaînes aléatoires.
 */
export class Random {
  /**
   * Génère un entier aléatoire entre deux bornes.
   * @param min Valeur minimale incluse
   * @param max Valeur maximale exclue
   * @returns Un entier aléatoire
   */
  static intRange(min: int, max: int): int {
    min = toInt(Math.ceil(min));
    max = toInt(Math.floor(max));
    return toInt(~~(Math.random() * (max - min) + min));
  }

  /**
   * Génère un nombre à virgule flottante aléatoire entre deux bornes.
   * @param min Valeur minimale
   * @param max Valeur maximale
   * @returns Un nombre aléatoire
   */
  static range(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * @deprecated utilisez {@link Random.randomString} plutôt.
   * @param size Taille de la chaîne aléatoire
   * @returns Une chaîne aléatoire
   */
  static random_string(size: uint): string {
    return this.randomString(size);
  }

  /**
   * Génère une chaîne de caractères aléatoire de la longueur indiquée.
   * @param size Taille de la chaîne
   * @returns Une chaîne aléatoire composée de lettres minuscules
   */
  static randomString(size: uint): string {
    const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

    const chars: string[] = [];

    for (let index = 0; index < size; ++index) {
      chars.push(ALPHA[this.intRange(toInt(0), toInt(ALPHA.length))]);
    }

    return chars.join(EMPTY_STRING);
  }
}