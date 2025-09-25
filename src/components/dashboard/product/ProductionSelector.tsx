import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import { QuantityInput } from '@/components/ui/forms';

export default function ProductionSelector() {
  const { state, dispatch } = useProductBuilderContext();
  const { production } = state;

  return (
    <>
      <div>
        <label className="mb-1 block font-medium">Modo de produção:</label>
        <select
          title="Selecione o modo de produção"
          value={production.mode}
          onChange={e =>
            dispatch({
              type: 'SET_PRODUCTION_MODE',
              payload: e.target.value as 'individual' | 'lote',
            })
          }
          className="w-full rounded border p-2"
          required
        >
          <option value="individual">Individual</option>
          <option value="lote">Lote</option>
        </select>
      </div>

      {production.mode === 'lote' && (
        <div>
          <label className="mb-1 block font-medium">Rendimento do lote:</label>
          <QuantityInput
            value={production.yieldQuantity?.toString() || '1'}
            onChange={value => {
              const numValue = parseFloat(value) || 1;
              dispatch({
                type: 'SET_YIELD_QUANTITY',
                payload: numValue,
              });
            }}
            placeholder="Quantidade total produzida"
            className="w-full"
            unit="un"
            allowDecimals={false}
            maxValue={10000} // Limite: 10.000 unidades por lote
            minValue={1}
          />
        </div>
      )}
    </>
  );
}
