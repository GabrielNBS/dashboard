import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuração do ESLint para o projeto
 *
 * Integra Next.js, TypeScript e Prettier para garantir
 * qualidade de código e formatação consistente.
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Configurações base do Next.js e TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Integração recomendada do Prettier (plugin + config + rules)
  eslintPluginPrettierRecommended,
];

export default eslintConfig;
