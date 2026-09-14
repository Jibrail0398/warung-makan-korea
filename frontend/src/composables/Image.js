const base_url = import.meta.env.VITE_API_URL;

export function ResolveImageUrl(image) {
    if (!image) return null;

    const externalImage = image.match(
        /^https?:\/\/[^/]+\/storage\/(https?:\/\/.+)$/
    );

    if (externalImage) {
        return externalImage[1];
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }

    if (image.startsWith('images.')) {
        return `https://${image}`;
    }

    return `${base_url}/storage/${image}`;
}