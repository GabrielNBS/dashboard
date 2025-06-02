// src/components/molecules/CategoryList.tsx
import CategoryTag from '@/components/atoms/CategoryTag';

const categories = ['Tradicionais', 'Especiais', 'Gourmet', 'Bebidas'];

export default function CategoryList() {
  return (
    <div className="p-default text-paragraph flex gap-4 text-base">
      {categories.map(category => (
        <CategoryTag key={category} label={category} />
      ))}
    </div>
  );
}
