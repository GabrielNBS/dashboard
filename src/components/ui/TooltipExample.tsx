import React from 'react';
import { Tooltip } from './Tooltip';
import { Info, HelpCircle, AlertCircle } from 'lucide-react';

/**
 * Exemplo de uso do componente Tooltip
 * Este arquivo demonstra as diferentes formas de usar o componente Tooltip
 */
export const TooltipExample: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="mb-4 text-2xl font-bold">Exemplos do Componente Tooltip</h2>

      {/* Exemplo básico */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Exemplo Básico</h3>
        <div className="flex items-center gap-2">
          <span>Informação importante</span>
          <Tooltip content="Este é um tooltip básico com texto explicativo." />
        </div>
      </div>

      {/* Diferentes posições */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Diferentes Posições</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Top</span>
            <Tooltip content="Tooltip no topo" position="top" />
          </div>
          <div className="flex items-center gap-2">
            <span>Bottom</span>
            <Tooltip content="Tooltip embaixo" position="bottom" />
          </div>
          <div className="flex items-center gap-2">
            <span>Left</span>
            <Tooltip content="Tooltip à esquerda" position="left" />
          </div>
          <div className="flex items-center gap-2">
            <span>Right</span>
            <Tooltip content="Tooltip à direita" position="right" />
          </div>
        </div>
      </div>

      {/* Diferentes tamanhos */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Diferentes Tamanhos</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Pequeno</span>
            <Tooltip content="Ícone pequeno" iconSize="sm" />
          </div>
          <div className="flex items-center gap-2">
            <span>Médio</span>
            <Tooltip content="Ícone médio (padrão)" iconSize="md" />
          </div>
          <div className="flex items-center gap-2">
            <span>Grande</span>
            <Tooltip content="Ícone grande" iconSize="lg" />
          </div>
        </div>
      </div>

      {/* Ícones personalizados */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Ícones Personalizados</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Ajuda</span>
            <Tooltip
              content="Este é um ícone de ajuda personalizado"
              icon={<HelpCircle className="text-accent h-4 w-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Alerta</span>
            <Tooltip
              content="Este é um ícone de alerta personalizado"
              icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
            />
          </div>
        </div>
      </div>

      {/* Largura personalizada */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Largura Personalizada</h3>
        <div className="flex items-center gap-2">
          <span>Tooltip largo</span>
          <Tooltip
            content="Este é um tooltip com largura personalizada para acomodar textos mais longos e explicativos."
            maxWidth="w-64"
          />
        </div>
      </div>

      {/* Estilos personalizados */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Estilos Personalizados</h3>
        <div className="flex items-center gap-2">
          <span>Tooltip customizado</span>
          <Tooltip
            content="Tooltip com estilos personalizados"
            iconClassName="text-purple-500"
            tooltipClassName="bg-purple-900 text-purple-100"
          />
        </div>
      </div>
    </div>
  );
};
