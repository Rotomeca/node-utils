#!/usr/bin/env node

/**
 * Script pour compiler tous les fichiers TypeScript en un seul fichier bundle
 * Ajoute le chemin relatif du fichier en commentaire avant chaque module
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = __dirname;
const outDir = path.join(srcDir, 'dist-bundle');
const bundleFile = path.join(outDir, 'bundle.js');

// Créer le dossier de sortie
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Trouver tous les fichiers TypeScript source
console.log('\n📂 Recherche des fichiers TypeScript...');

function findTypeScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist-bundle') {
      findTypeScriptFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      const relativePath = path.relative(srcDir, filePath);
      fileList.push({
        path: filePath,
        relativePath: relativePath,
      });
    }
  });

  return fileList;
}

const sourceFiles = findTypeScriptFiles(path.join(srcDir, 'lib')).sort((a, b) =>
  a.relativePath.localeCompare(b.relativePath)
);

if (sourceFiles.length === 0) {
  console.error('❌ Aucun fichier TypeScript trouvé');
  process.exit(1);
}

console.log(`✅ ${sourceFiles.length} fichier(s) trouvé(s)`);

// Créer le bundle
console.log('\n🔗 Création du bundle TypeScript...');
let bundleContent = '// ============================================================\n';
bundleContent += '// Bundle TypeScript généré automatiquement - Ne pas modifier manuellement\n';
bundleContent += `// Généré le: ${new Date().toISOString()}\n`;
bundleContent += `// Nombre de fichiers: ${sourceFiles.length}\n`;
bundleContent += '// ============================================================\n\n';

sourceFiles.forEach((file) => {
  const fileContent = fs.readFileSync(file.path, 'utf-8');
  const separator = '// ' + '='.repeat(60);

  bundleContent += separator + '\n';
  bundleContent += `// Fichier: ${file.relativePath}\n`;
  bundleContent += separator + '\n';
  bundleContent += fileContent;
  bundleContent += '\n\n';
});

fs.writeFileSync(bundleFile, bundleContent);

console.log(`✅ Bundle créé avec succès: ${bundleFile}`);
console.log(`📊 Taille du bundle: ${(fs.statSync(bundleFile).size / 1024).toFixed(2)} KB`);
console.log('\n📋 Fichiers inclus:');
sourceFiles.forEach((file) => {
  console.log(`  - ${file.relativePath}`);
});
