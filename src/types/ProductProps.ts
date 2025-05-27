export type Product = {
  id: number;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  stockStatus: string;
};

export type ProductTableProps = {
  products: Product[];
  onDeleteProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
};

export type ProductEditModalProps = {
  product: Product;
  isOpen: boolean;
  onSave: (product: Product) => void;
  onClose: () => void;
};
