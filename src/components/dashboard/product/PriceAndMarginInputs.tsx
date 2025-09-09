import Input from '@/components/ui/base/Input';

interface PriceAndMarginInputsProps {
  mode: 'individual' | 'lote';
  sellingPrice: number;
  onSellingPriceChange: (value: number) => void;
  margin: number;
  onMarginChange: (value: number) => void;
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
        <Input
          type="number"
          min={0.01}
          step={0.01}
          value={sellingPrice}
          onChange={e => onSellingPriceChange(Number(e.target.value))}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Margem Sugerida (%):</label>
        <Input
          type="number"
          min={0}
          max={99}
          value={margin}
          onChange={e => onMarginChange(Number(e.target.value))}
          className="w-full rounded border p-2"
        />
      </div>
    </>
  );
}
