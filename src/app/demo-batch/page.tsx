// src/app/demo-batch/page.tsx
'use client';

import React from 'react';
import { Package, Info, ArrowRight } from 'lucide-react';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useIngredientContext } from '@/contexts/Ingredients/useIngredientContext';
import BatchSaleDemo from '@/components/features/demo/BatchSaleDemo';
import Button from '@/components/ui/base/Button';
import Link from 'next/link';

export default function DemoBatchPage() {
  const { state: productState } = useProductContext();
  const { state: ingredientState } = useIngredientContext();

  const batchProducts = productState.products.filter(product => product.production.mode === 'lote');

  return (
    <div className="bg-background min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-full p-3">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Demonstração - Vendas de Lotes Parciais</h1>
              <p className="text-muted-foreground">
                Funcionalidade para vender quantidades específicas de produtos em lote
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="text-blue-800">
                <h3 className="mb-2 font-medium">Como Funciona a Venda Parcial de Lotes</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Produtos em Lote:</strong> Permitem venda de quantidades menores que o
                    rendimento total
                  </li>
                  <li>
                    • <strong>Cálculo Proporcional:</strong> Ingredientes e custos são descontados
                    proporcionalmente
                  </li>
                  <li>
                    • <strong>Controle de Estoque:</strong> Sistema valida disponibilidade antes da
                    venda
                  </li>
                  <li>
                    • <strong>Margem Dinâmica:</strong> Margem de lucro é calculada em tempo real
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex gap-3">
          <Link href="/pdv-batch">
            <Button variant="default">
              <ArrowRight className="mr-2 h-4 w-4" />
              Ir para PDV com Lotes
            </Button>
          </Link>
          <Link href="/pdv">
            <Button variant="outline">PDV Original</Button>
          </Link>
        </div>

        {/* Demo Content */}
        {batchProducts.length === 0 ? (
          <div className="bg-surface rounded-lg border p-8 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">Nenhum Produto em Lote Encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Para testar a funcionalidade, você precisa criar produtos com modo de produção "lote".
            </p>
            <Link href="/product">
              <Button>Criar Produto em Lote</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-semibold">
                Produtos em Lote Disponíveis ({batchProducts.length})
              </h2>
              <p className="text-muted-foreground text-sm">
                Selecione diferentes quantidades para ver como os cálculos se ajustam
                automaticamente.
              </p>
            </div>

            {batchProducts.map(product => (
              <BatchSaleDemo
                key={product.uid}
                product={product}
                availableIngredients={ingredientState.ingredients}
              />
            ))}
          </div>
        )}

        {/* Features Summary */}
        <div className="bg-surface mt-8 rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">Recursos Implementados</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Seleção de Quantidade</p>
                  <p className="text-muted-foreground text-xs">
                    Interface para escolher quantas unidades vender do lote
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Cálculo Proporcional</p>
                  <p className="text-muted-foreground text-xs">
                    Custos e ingredientes calculados proporcionalmente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Validação de Estoque</p>
                  <p className="text-muted-foreground text-xs">
                    Verifica disponibilidade antes de permitir venda
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Desconto Automático</p>
                  <p className="text-muted-foreground text-xs">
                    Ingredientes descontados automaticamente do estoque
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Margem Dinâmica</p>
                  <p className="text-muted-foreground text-xs">
                    Margem de lucro calculada em tempo real
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-1 text-green-600">
                  <Package className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Compatibilidade Total</p>
                  <p className="text-muted-foreground text-xs">
                    Funciona junto com produtos individuais
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
