export class DefaultImageService {
  private static readonly DEFAULT_GIFT_IMAGE =
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60';

  static ensureDefaultImage(imageUrl?: string): string {
    return imageUrl || this.DEFAULT_GIFT_IMAGE;
  }
}
