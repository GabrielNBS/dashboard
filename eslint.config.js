import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

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

  // Integração com Prettier para formatação automática
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Aplica as regras do Prettier e desativa conflitos
  prettier,
];

export default eslintConfig;
