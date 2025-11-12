# Componente de Upload de Imagem para Produtos

## ImageUpload

Componente para seleção e upload de imagens de produtos com preview.

### Características

- Preview da imagem selecionada
- Validação de tipo de arquivo (apenas imagens)
- Validação de tamanho (máximo 5MB)
- Conversão automática para base64
- Botão para remover imagem
- Interface responsiva

### Uso

```tsx
import { ImageUpload } from '@/components/products/ImageUpload';

function MyComponent() {
  const [image, setImage] = useState<string>('');

  return <ImageUpload value={image} onChange={setImage} label="Imagem do Produto" />;
}
```

### Props

- `value?: string` - URL ou base64 da imagem atual
- `onChange: (imageUrl: string) => void` - Callback chamado quando a imagem é alterada
- `label?: string` - Label do campo (padrão: "Imagem do Produto")

### Formatos Aceitos

- JPG/JPEG
- PNG
- GIF
- WebP
- Outros formatos de imagem suportados pelo navegador

### Limitações

- Tamanho máximo: 5MB
- A imagem é armazenada como base64 no estado do produto
