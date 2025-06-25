import ImageBox from '@/components/atoms/ImageBox';
import IngredientFormContainer from '@/components/organisms/IngredientFormContainer';
import CategorySection from '@/components/organisms/CategorySection';

export default function ProductTemplate() {
  return (
    <div className="p-default flex h-full min-h-screen flex-col items-center justify-center gap-24">
      <h1 className="text-hero self-start font-bold">Cadastro de produto</h1>
      <ImageBox />
      <div className="w-full max-w-7xl rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
          <IngredientFormContainer />
          {/* <CategorySection /> */}
        </div>
      </div>
    </div>
  );
}
