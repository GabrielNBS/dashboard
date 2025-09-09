import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';
import Input from '@/components/ui/base/Input';

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
          <Input
            type="number"
            min={1}
            value={production.yieldQuantity || 1}
            onChange={e =>
              dispatch({
                type: 'SET_YIELD_QUANTITY',
                payload: Number(e.target.value),
              })
            }
            placeholder="Quantidade total produzida"
            className="w-full rounded border p-2"
          />
        </div>
      )}
    </>
  );
}
