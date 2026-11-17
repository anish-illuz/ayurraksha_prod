/**
 * Node ESM resolve hook: maps the project's "@/..." TS path alias to the real
 * source files under ./src so the test runner can import real source modules
 * (which use @/ imports) under Node's native type-stripping.
 *
 * Registered from run-tests.mjs via node:module register(). Without this hook
 * Node cannot resolve "@/lib/..." specifiers, because the alias only exists in
 * tsconfig paths (used by the Next build, not by raw Node).
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(projRoot, 'src');

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const rest = specifier.slice(2);
    const base = path.join(srcDir, rest);
    const candidates = [
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      `${base}.mjs`,
      path.join(base, 'index.ts'),
      path.join(base, 'index.tsx'),
      base,
    ];
    for (const c of candidates) {
      if (existsSync(c)) {
        return nextResolve(pathToFileURL(c).href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
