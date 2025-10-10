import MultiStepProductForm from './MultiStepProductForm';
import { useProductContext } from '@/contexts/products/ProductContext';
import { useProductBuilderContext } from '@/contexts/products/ProductBuilderContext';

export default function ProductForm() {
  const { dispatch } = useProductContext();
  const { dispatch: builderDispatch } = useProductBuilderContext();

  const handleCloseForm = () => {
    // Reset completo do builder context para garantir dados limpos
    builderDispatch({ type: 'RESET_PRODUCT' });

    // Limpar produto em edição e fechar formulário
    dispatch({ type: 'CLEAR_PRODUCT_TO_EDIT' });
    dispatch({ type: 'TOGGLE_FORM_VISIBILITY' });
  };

  const { state } = useProductContext();

  return <MultiStepProductForm key={state.productToEdit?.uid || 'new'} onClose={handleCloseForm} />;
}
