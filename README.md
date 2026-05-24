# @rotomeca/utils

[![npm version](https://img.shields.io/npm/v/@rotomeca/utils)](https://www.npmjs.com/package/@rotomeca/utils)
[![CI](https://github.com/Rotomeca/node-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/Rotomeca/node-utils/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

Bibliothèque TypeScript utilitaire pensée pour un usage professionnel et en entreprise. Fournit un ensemble cohérent de fonctions pures, types brandés et helpers couvrant les besoins quotidiens des projets Node.js et navigateur.

---

## Installation

```bash
# pnpm
pnpm add @rotomeca/utils

# npm
npm install @rotomeca/utils

# yarn
yarn add @rotomeca/utils
```

---

## Compatibilité

| Environnement | Support |
|---|---|
| Node.js | ≥ 18 |
| ESM | ✅ |
| CommonJS | ✅ |
| TypeScript | ✅ (types inclus) |
| Navigateur (bundler) | ✅ |

---

## Modules

### `array` — Manipulation de tableaux

```ts
import { chunk, unique, uniqueBy, groupBy, sortBy, flatten, flattenDeep,
         compact, partition, partitionToObject, intersection, difference,
         union, zip, take, drop, shuffle, minBy, maxBy,
         first, last, sum } from '@rotomeca/utils';

// Découper un tableau
chunk([1, 2, 3, 4, 5], 2)         // → [[1,2],[3,4],[5]]

// Dédupliquer
unique([1, 2, 2, 3])               // → [1, 2, 3]
uniqueBy([{id:1},{id:1}], x=>x.id) // → [{id:1}]

// Regrouper
groupBy(['a','ab','b'], s => s[0]) // → { a:['a','ab'], b:['b'] }

// Trier (Schwartz transform — fn appelée une fois par élément)
sortBy(users, u => u.name)

// Aplatir
flatten([[1,2],[3,4]])             // → [1,2,3,4]
flattenDeep([1,[2,[3,[4]]]])       // → [1,2,3,4]

// Filtrer les falsy
compact([1, null, 0, 'a', false])  // → [1, 'a']

// Séparer en deux
partition([1,2,3,4], x => x%2===0) // → [[2,4],[1,3]]
partitionToObject([1,2,3], x => x>1) // → { pass:[2,3], fail:[1] }

// Opérations ensemblistes
intersection([1,2,3], [2,3,4])    // → [2,3]
difference([1,2,3], [2,3])        // → [1]
union([1,2], [2,3])               // → [1,2,3]

// Combiner
zip([1,2,3], ['a','b','c'])       // → [[1,'a'],[2,'b'],[3,'c']]

// Trancher
take([1,2,3,4,5], 3)             // → [1,2,3]
drop([1,2,3,4,5], 2)             // → [3,4,5]

// Extrêmes
minBy(users, u => u.age)
maxBy(users, u => u.score)
```

---

### `object` — Manipulation d'objets

```ts
import { pick, omit, deepClone, deepMerge, isEmpty,
         mapValues, mapKeys, filterKeys, filterValues,
         flattenObject, unflattenObject, invert } from '@rotomeca/utils';

pick({ a:1, b:2, c:3 }, ['a','c'])   // → { a:1, c:3 }
omit({ a:1, b:2, c:3 }, ['b'])       // → { a:1, c:3 }

// Clone profond (structuredClone si dispo, fallback JSON)
const clone = deepClone({ a: { b: 1 } });

// Fusion récursive (protégée contre la pollution de prototype)
deepMerge({ a:1, b:{ c:2 } }, { b:{ d:3 } }) // → { a:1, b:{ c:2, d:3 } }

// Transformer
mapValues({ a:1, b:2 }, x => x*2)    // → { a:2, b:4 }
mapKeys({ a:1 }, k => k.toUpperCase()) // → { A:1 }

// Filtrer
filterKeys({ a:1, b:2 }, k => k !== 'b') // → { a:1 }
filterValues({ a:1, b:2 }, v => v > 1)   // → { b:2 }

// Aplatir / reconstituer
flattenObject({ a: { b: { c: 1 } } })    // → { 'a.b.c': 1 }
unflattenObject({ 'a.b.c': 1 })          // → { a: { b: { c: 1 } } }

// Inverser clés/valeurs
invert({ a:'x', b:'y' })                 // → { x:'a', y:'b' }
```

---

### `string` — Manipulation de chaînes

```ts
import { capitalize, capitalizeLine, slugify, toCamelCase, toSnakeCase,
         toPascalCase, truncate, isNullOrWhiteSpace, template,
         countOccurrences, reverse, words } from '@rotomeca/utils';

capitalize('bonjour')                    // → 'Bonjour'
capitalizeLine('bonjour le monde')       // → 'Bonjour Le Monde'
slugify('Élève en été')                  // → 'eleve-en-ete'
toCamelCase('hello_world')              // → 'helloWorld'
toSnakeCase('helloWorld')               // → 'hello_world'
toPascalCase('hello-world')             // → 'HelloWorld'
truncate('Bonjour le monde', 10)        // → 'Bonjour...'
isNullOrWhiteSpace('   ')               // → true

// Interpolation de template
template('Bonjour {name} !', { name: 'Alice' }) // → 'Bonjour Alice !'

countOccurrences('abcabc', 'bc')        // → 2
reverse('hello')                        // → 'olleh'
words('helloWorld')                     // → ['hello', 'World']
```

---

### `async` — Utilitaires asynchrones

```ts
import { sleep, retry, timeout, parallel, sequential } from '@rotomeca/utils';

// Pause
await sleep(toUint(500));

// Réessayer automatiquement
const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  toUint(3),   // 3 tentatives
  toUint(500), // 500ms entre chaque
);

// Timeout sur une promesse
await timeout(fetchSomething(), toUint(3000));

// Exécution parallèle
const [a, b] = await parallel([
  () => fetchUsers(),
  () => fetchPosts(),
]);

// Exécution séquentielle
const results = await sequential([
  () => step1(),
  () => step2(),
]);
```

---

### `function` — Utilitaires fonctionnels

```ts
import { debounce, throttle, memoize, once, noop, identity } from '@rotomeca/utils';

// Débounce (remet le timer à zéro à chaque appel)
const onSearch = debounce(fetchResults, toUint(300));

// Throttle (au plus une fois par intervalle)
const onScroll = throttle(updateScrollbar, toUint(100));

// Mémoïsation (cache les résultats par arguments)
const fib = memoize((n: number) => ...);

// Une seule exécution
const init = once(() => setupApp());

// Valeurs neutres utiles en pipeline
onClick={noop}
[1, 2, 3].map(identity) // → [1, 2, 3]
```

---

### `pipe` — Composition de fonctions

```ts
import { pipe } from '@rotomeca/utils';

// Jusqu'à 10 fonctions chaînées, entièrement typé
const result = pipe(
  '  Bonjour Le Monde  ',
  s => s.trim(),
  s => s.toLowerCase(),
  slugify,
); // → 'bonjour-le-monde'
```

---

### `types` — Types brandés & constructeurs

Les types brandés préviennent les confusions entre `int`, `uint` et `float` à la compilation.

```ts
import { toInt, toUint, toFloat, toUfloat } from '@rotomeca/utils';
import type { int, uint, float, ufloat, MayBe, Nullable, Optional } from '@rotomeca/utils';

const age: uint = toUint(25);    // lève une erreur si négatif ou non entier
const delta: int = toInt(-5);
const ratio: float = toFloat(0.75);

// Proxies de conversion (évitent les appels répétitifs à toUint etc.)
import { Uint, Int, Float, Ufloat } from '@rotomeca/utils';
const n = Uint[42]; // uint — validé et mis en cache
```

---

### `guard` — Type guards

```ts
import { isDefined, isNullOrUndefined, isNonEmptyString,
         isNonEmptyArray, isObject, isPlainObject } from '@rotomeca/utils';

if (isDefined(value)) {
  // value est NonNullable<T> ici
}

if (isNonEmptyArray<User>(data)) {
  // data est [User, ...User[]] ici — data[0] toujours défini
}
```

---

### `validator` — Validation de formats

```ts
import { isEmail, isURL, isUUID, isNumeric, isAlpha, isHexColor } from '@rotomeca/utils';

isEmail('user@example.com')              // → true
isURL('https://example.com')            // → true
isUUID('550e8400-e29b-41d4-a716-...')   // → true
isNumeric('3.14')                        // → true
isAlpha('Éric')                          // → true
isHexColor('#FF5733')                    // → true
```

---

### `number` — Utilitaires numériques

```ts
import { clamp, roundTo, isInRange, average } from '@rotomeca/utils';

clamp(15, 0, 10)                    // → 10
roundTo(toFloat(3.14159), toUint(2)) // → 3.14
isInRange(5, 1, 10)                 // → true
average([1, 2, 3, 4])               // → 2.5
```

---

### `constants` — Constantes typées

```ts
import { EMPTY_STRING, SPACE, UI_ZERO, UI_ONE, I_MINUS_ONE,
         F_HALF, UF_ONE } from '@rotomeca/utils';
```

---

## Ecosystème Rotomeca

Ce package fait partie d'un écosystème cohérent :

| Package | Description |
|---|---|
| [`@rotomeca/utils`](https://www.npmjs.com/package/@rotomeca/utils) | Ce package |
| `@rotomeca/rop` | Gestion d'erreurs typée (Result\<T, E\>) |
| `@rotomeca/event` | Système d'événements typés à la C# |
| `@rotomeca/jsenumerable` | LINQ lazy en TypeScript |

---

## Contribuer

```bash
git clone https://github.com/Rotomeca/node-utils.git
cd node-utils
pnpm install
pnpm test
```

Les contributions sont les bienvenues via Pull Request sur la branche `dev`.

---

## Licence

[ISC](LICENSE) © Rotomeca
