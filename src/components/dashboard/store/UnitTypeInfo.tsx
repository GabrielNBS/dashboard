'use client';

import { UnitType } from '@/types/ingredients';
import { getBaseUnit } from '@/utils/normalizeQuantity';

interface UnitTypeInfoProps {
  unit: UnitType;
}

export default function UnitTypeInfo({ unit }: UnitTypeInfoProps) {
  const getUnitDescription = (unit: UnitType) => {
    switch (unit) {
      case 'kg':
        return {
          title: 'Quilos (kg)',
          description:
            'Medida de peso. Convertida para gramas internamente para cálculos precisos.',
          examples: ['1 kg = 1000g', '0.5 kg = 500g', '0.001 kg = 1g'],
          minValue: '0.001 kg',
          maxValue: '1000 kg',
          step: '0.001',
        };

      case 'l':
        return {
          title: 'Litros (l)',
          description:
            'Medida de volume. Convertida para mililitros internamente para cálculos precisos.',
          examples: ['1 l = 1000ml', '0.5 l = 500ml', '0.001 l = 1ml'],
          minValue: '0.001 l',
          maxValue: '1000 l',
          step: '0.001',
        };

      case 'un':
        return {
          title: 'Unidades (un)',
          description: 'Medida de quantidade discreta. Valores inteiros apenas.',
          examples: ['1 un = 1 item', '10 un = 10 items', '100 un = 100 items'],
          minValue: '1 un',
          maxValue: '10000 un',
          step: '1',
        };

      default:
        return {
          title: 'Unidade',
          description: 'Medida padrão.',
          examples: [],
          minValue: '1',
          maxValue: '1000',
          step: '1',
        };
    }
  };

  const unitInfo = getUnitDescription(unit);

  return (
    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 font-semibold text-blue-800">{unitInfo.title}</h3>
      <p className="mb-3 text-sm text-blue-700">{unitInfo.description}</p>

      <div className="space-y-2">
        <div className="text-sm">
          <span className="font-medium text-blue-800">Valor mínimo:</span> {unitInfo.minValue}
        </div>
        <div className="text-sm">
          <span className="font-medium text-blue-800">Valor máximo:</span> {unitInfo.maxValue}
        </div>
        <div className="text-sm">
          <span className="font-medium text-blue-800">Incremento:</span> {unitInfo.step}
        </div>
      </div>

      {unitInfo.examples.length > 0 && (
        <div className="mt-3">
          <span className="text-sm font-medium text-blue-800">Exemplos:</span>
          <ul className="mt-1 space-y-1 text-sm text-blue-700">
            {unitInfo.examples.map((example, index) => (
              <li key={index} className="text-xs">
                • {example}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 text-xs text-blue-600">
        <span className="font-medium">Unidade base para cálculos:</span> {getBaseUnit(unit)}
      </div>
    </div>
  );
}
