import CategoryList from '@/components/molecules/CategoryList';

export default function CategorySection() {
  return (
    <div className="inline-flex max-h-[512px] min-h-[400px] w-full flex-col items-center gap-4 rounded-lg shadow-md">
      <CategoryList />
    </div>
  );
}
