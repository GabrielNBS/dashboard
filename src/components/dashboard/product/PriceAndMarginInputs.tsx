import { CurrencyInput, PercentageInput } from '@/components/ui/forms';

interface PriceAndMarginInputsProps {
  mode: 'individual' | 'lote';
  sellingPrice: string;
  onSellingPriceChange: (value: string) => void;
  margin: string;
  onMarginChange: (value: string) => void;
}

export default function PriceAndMarginInputs({
  mode,
  sellingPrice,
  onSellingPriceChange,
  margin,
  onMarginChange,
}: PriceAndMarginInputsProps) {
  return (
    <>
      <div>
        <label className="mb-1 block font-medium">
          {mode === 'lote' ? 'Preço de Venda por Unidade (R$):' : 'Preço de Venda (R$):'}
        </label>
        <CurrencyInput
          value={sellingPrice}
          onChange={onSellingPriceChange}
          className="w-full"
          placeholder="R$ 0,00"
          maxValue={9999.99} // Limite: R$ 9.999,99 para produtos PME
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Margem Sugerida (%):</label>
        <PercentageInput
          value={margin}
          onChange={onMarginChange}
          className="w-full"
          placeholder="0%"
          maxValue={300} // Limite: 300% margem máxima para PME
          minValue={0}
        />
      </div>
    </>
  );
}
