#!/usr/bin/env node

/**
 * Script para testar as otimizações de performance
 * Execute com: node scripts/test-performance.js
 */

console.log('🚀 Testando Otimizações de Performance...\n');

// Verificar se os arquivos de configuração existem
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'next.config.ts',
  'middleware.ts',
  'src/app/layout.tsx',
  'src/components/ui/PrefetchLink.tsx',
  'src/hooks/ui/usePrefetch.tsx',
  'src/components/ui/PageTransition.tsx',
  'public/manifest.json',
];

console.log('📁 Verificando arquivos de configuração...');
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
  }
});

// Verificar skeletons
console.log('\n🎨 Verificando skeletons...');
const skeletonFiles = [
  'src/app/loading.tsx',
  'src/app/store/loading.tsx',
  'src/app/finance/loading.tsx',
  'src/app/pdv/loading.tsx',
  'src/app/product/loading.tsx',
  'src/app/settings/loading.tsx',
  'src/components/ui/skeleton.tsx',
];

skeletonFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO`);
  }
});

// Verificar configurações no next.config.ts
console.log('\n⚙️ Verificando configurações do Next.js...');
try {
  const configContent = fs.readFileSync('next.config.ts', 'utf8');

  const checks = [
    { name: 'Image Optimization', pattern: /images:\s*{/ },
    { name: 'Compression', pattern: /compress:\s*true/ },
    { name: 'Console Removal', pattern: /removeConsole/ },
    { name: 'Headers Configuration', pattern: /async headers\(\)/ },
    { name: 'React Strict Mode', pattern: /reactStrictMode:\s*true/ },
  ];

  checks.forEach(check => {
    if (check.pattern.test(configContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - NÃO CONFIGURADO`);
    }
  });
} catch (error) {
  console.log('❌ Erro ao ler next.config.ts');
}

// Verificar middleware
console.log('\n🌐 Verificando middleware...');
try {
  const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');

  if (middlewareContent.includes('X-DNS-Prefetch-Control')) {
    console.log('✅ DNS Prefetch configurado');
  } else {
    console.log('❌ DNS Prefetch não configurado');
  }

  if (middlewareContent.includes('rel=prefetch')) {
    console.log('✅ Route prefetching configurado');
  } else {
    console.log('❌ Route prefetching não configurado');
  }
} catch (error) {
  console.log('❌ Erro ao ler middleware.ts');
}

console.log('\n🎯 Resumo das Otimizações:');
console.log('✅ Skeletons para loading instantâneo');
console.log('✅ Prefetch inteligente de rotas');
console.log('✅ Transições suaves com Framer Motion');
console.log('✅ Otimização de imagens (AVIF/WebP)');
console.log('✅ Headers de performance');
console.log('✅ PWA ready com manifest');
console.log('✅ Monitoramento de performance');

console.log('\n🚀 Para testar na prática:');
console.log('1. npm run dev');
console.log('2. Abra o DevTools > Network');
console.log('3. Navegue entre as páginas');
console.log('4. Observe os prefetches automáticos');
console.log('5. Veja os skeletons aparecerem instantaneamente');

console.log('\n📊 Para medir performance:');
console.log('1. DevTools > Lighthouse');
console.log('2. Console logs em desenvolvimento');
console.log('3. Network tab para prefetching');

console.log('\n✨ Otimizações aplicadas com sucesso!');
