# Décisions d'architecture — @rotomeca/utils

Ce document explique les choix techniques structurants du package. Chaque décision est accompagnée de son contexte, de la solution retenue et des alternatives écartées.

---

## D-001 — Types brandés (`int`, `uint`, `float`, `ufloat`)

**Contexte**
JavaScript représente tous les nombres par `number` (IEEE 754 double). Passer un float là où un entier est attendu, ou un entier négatif là où seul un positif a du sens, est une source de bugs silencieux fréquente.

**Décision**
Introduire des types brandés via intersection : `type uint = number & { readonly __brand: 'uint' }`. Les valeurs sont validées à la construction via `toUint(n)` et l'erreur est levée à l'exécution si la contrainte est violée.

**Pourquoi pas `class` ou `enum` ?**
Les classes ajoutent du poids au bundle et des problèmes de sérialisation JSON. Les enums TypeScript ont des comportements contre-intuitifs à l'exécution. Les branded types sont purement compile-time (coût runtime nul) avec validation opt-in à la construction.

**Conséquence**
Les fonctions qui attendent un `uint` refusent un `number` brut à la compilation. Les proxies `Uint`, `Int`, `Float`, `Ufloat` offrent une ergonomie de conversion avec cache intégré pour les valeurs fréquentes.

---

## D-002 — Dual build ESM + CJS

**Contexte**
L'écosystème Node.js est encore partagé entre projets ESM (`"type":"module"`) et CommonJS (`require()`). Forcer un seul format exclut une partie des consommateurs.

**Décision**
Deux compilations TypeScript distinctes : `tsconfig.json` → `dist/esm/` et `tsconfig.cjs.json` → `dist/cjs/`. Un `package.json { "type": "commonjs" }` est injecté dans `dist/cjs/` pour que Node.js interprète correctement les fichiers `.js` CJS.

**Champ `exports`**
```json
{
  "exports": {
    ".": {
      "types":   "./dist/esm/index.d.ts",
      "import":  "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  }
}
```
Les bundlers modernes (Vite, webpack 5, Rollup) utilisent `exports` en priorité. Les anciens outils tombent sur `main` (CJS).

**Pourquoi pas `tsup` ou `rollup` ?**
La compilation TypeScript native permet de conserver la structure de fichiers 1:1 avec les sources, ce qui simplifie le débogage avec les source maps. `tsup` produit un bundle concaténé qui noie les stack traces.

---

## D-003 — Fonctions pures, zéro mutation

**Contexte**
Les fonctions qui mutent leurs arguments sont une source de bugs difficiles à reproduire, notamment en React ou dans les contextes multithreadés (workers).

**Décision**
Toutes les fonctions de ce package sont **pures** : elles ne modifient jamais leurs arguments et retournent toujours de nouvelles valeurs.

```ts
// ✅ sortBy retourne un nouveau tableau
const sorted = sortBy(users, u => u.name);
// users est inchangé

// ✅ deepMerge retourne un nouvel objet
const merged = deepMerge(defaults, overrides);
// defaults et overrides sont inchangés
```

**Conséquence**
Les tests d'immutabilité font partie de la suite de tests standard du package.

---

## D-004 — `sortBy` avec transformée de Schwartz

**Contexte**
Un tri naïf `arr.sort((a, b) => fn(a) - fn(b))` appelle `fn` O(n log n) fois. Si `fn` est coûteux (accès DOM, calcul lourd), les performances se dégradent.

**Décision**
Implémentation de la [Transformée de Schwartz](https://en.wikipedia.org/wiki/Schwartzian_transform) (Decorate-Sort-Undecorate) : `fn` est appelé exactement une fois par élément.

```ts
// fn est appelé 3 fois, pas 3*log(3) fois
sortBy([{name:'Zoe'},{name:'Alice'},{name:'Éric'}], u => u.name)
```

Les strings sont triées via `localeCompare` pour gérer correctement les accents.

---

## D-005 — `deepMerge` avec protection contre la pollution de prototype

**Contexte**
Un merge récursif naïf est vulnérable à la pollution de prototype (`__proto__`, `constructor`, `prototype`). Un objet JSON malveillant pourrait altérer le comportement de tous les objets de l'application.

**Décision**
Les clés `__proto__`, `constructor` et `prototype` sont explicitement ignorées lors du merge. Seuls les objets plain (vérifiés via `isPlainObject`) sont mergés récursivement ; les tableaux et primitives sont écrasés.

```ts
// Cette entrée malveillante est ignorée
deepMerge({}, JSON.parse('{"__proto__":{"polluted":true}}'));
({} as any).polluted; // → undefined ✅
```

---

## D-006 — `reverse` avec `Intl.Segmenter`

**Contexte**
`str.split('').reverse().join('')` est la solution naïve, mais elle casse les emojis composés (séquences Unicode multi-codepoints comme 👨‍👩‍👧).

**Décision**
Utiliser `Intl.Segmenter` quand disponible (Node 16+, navigateurs modernes) pour découper par graphème avant de renverser. Fallback sur `[...str]` (qui gère les surrogate pairs mais pas les séquences ZWJ) pour les environnements anciens.

**Limitation documentée**
Le fallback ne gère pas correctement les emojis composés. Ce cas est considéré hors scope pour un usage standard.

---

## D-007 — `lib/private/` — internals non exposés

**Contexte**
Certaines constantes internes (`DEFAULT_ELLIPSIS`) n'ont pas vocation à être utilisées directement par les consommateurs mais doivent être partagées entre modules.

**Décision**
Le dossier `lib/private/` contient les fichiers internes. Il est exclu des exports de `index.ts` — les consommateurs ne peuvent pas l'importer directement. Le build le compile quand même (nécessaire pour les dépendances), mais il n'apparaît pas dans l'API publique.

---

## D-008 — Tests avec Vitest 4.x (Node 20.12+ requis pour les tests)

**Contexte**
Vitest 4.x utilise Vite 8 + rolldown, qui appelle `node:util.styleText` — une API introduite en Node 20.12. Le package lui-même fonctionne sur Node 18+, mais les tests ne peuvent pas tourner sur Node 18.

**Décision**
Séparer dans la CI : les **tests** tournent sur Node 20 et 22 uniquement, tandis qu'un job **compat** séparé vérifie que le `dist/` s'importe correctement sur Node 18 sans faire tourner Vitest.

```
CI : typecheck → test (20, 22) → build → compat (18) → publish-check
```

**Conséquence**
`engines` du package reste `>=18` pour les consommateurs. La contrainte Vitest 4 est une contrainte de **développement** uniquement, transparente pour les utilisateurs finaux.

---

## D-009 — Pas de dépendances de production

**Contexte**
Chaque dépendance ajoutée au bundle d'un consommateur est un risque (sécurité, compatibilité, poids).

**Décision**
`@rotomeca/utils` n'a **aucune dépendance de production**. Tout est implémenté natif ou avec des API standard Node.js/navigateur. Les `devDependencies` (TypeScript, Vitest, ESLint…) ne sont jamais embarquées dans le build final.

**`sideEffects: false`**
Déclaré dans `package.json` pour permettre aux bundlers (Vite, webpack) de tree-shaker agressivement les exports non utilisés.

---

## D-010 — `AStartObject` — pattern initialisation/exécution

**Contexte**
En TypeScript, les constructeurs ne peuvent pas être `async` et leur surcharge est limitée. Pour les classes qui nécessitent une phase d'initialisation distincte de la phase d'exécution, un pattern structuré est préférable à des constructeurs surchargés.

**Décision**
La classe abstraite `AStartObject` impose un cycle de vie en deux phases via `_p_init()` et `_p_main()`. L'entrée unique est la méthode statique `Start()` qui instancie, initialise et exécute dans l'ordre.

```ts
class MonService extends AStartObject {
  protected _p_init(port: number) { this.port = port; }
  protected _p_main() { this.server.listen(this.port); }
}

const service = MonService.Start(3000);
```
