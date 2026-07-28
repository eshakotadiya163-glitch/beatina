export const getImageUrl = (product: any, index: number = 0, fallback: string = '/placeholder.png'): string => {
  if (!product) return fallback;

  // If it's an array of images (new schema)
  if (Array.isArray(product.images) && product.images.length > index) {
    if (typeof product.images[index] === 'string' && product.images[index].trim() !== '') {
      return product.images[index];
    }
    if (product.images[index]?.url && typeof product.images[index].url === 'string' && product.images[index].url.trim() !== '') {
      return product.images[index].url;
    }
  }
  
  // If it has a single image field (old schema, cart items, etc.)
  if (product.image && typeof product.image === 'string' && product.image.trim() !== '' && index === 0) {
    return product.image;
  }
  
  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '' && index === 0) {
    return product.imageUrl;
  }

  // Fallback to first image if index > 0 fails
  if (Array.isArray(product.images) && product.images.length > 0) {
    if (typeof product.images[0] === 'string' && product.images[0].trim() !== '') {
      return product.images[0];
    }
    if (product.images[0]?.url && typeof product.images[0].url === 'string' && product.images[0].url.trim() !== '') {
      return product.images[0].url;
    }
  }

  return fallback;
};
