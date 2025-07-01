export default function ImageBox() {
  return (
    <div className="aspect-square w-full max-w-[256px] rounded-lg shadow-md">
      <img
        src="https://placehold.co/600x600"
        alt="Product"
        className="h-full w-full rounded-lg object-cover"
      />
    </div>
  );
}
