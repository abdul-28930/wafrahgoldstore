// API utility functions for interacting with the backend

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''; // In browser, use relative URL
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

/**
 * Fetch all products or filter by category
 */
export async function getProducts(options: { sort?: string; category?: string } = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (options.sort) queryParams.set('sort', options.sort);
    if (options.category) queryParams.set('category', options.category);

    const queryString = queryParams.toString();
    const url = `${getBaseUrl()}/api/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 60 }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch products');

    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(productId: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/${productId}`, {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    const data = await response.json();

    if (!data.success) throw new Error(data.error || 'Failed to fetch product');

    trackProductVisit(productId).catch(console.error);
    return data.data;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}

/**
 * Track a product visit
 */
export async function trackProductVisit(productId: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/track-visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to track product visit');

    return data.data;
  } catch (error) {
    console.error('Error in trackProductVisit:', error);
    return null;
  }
}

/**
 * Create a new product
 */
export async function createProduct(productData: any) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to create product');

    return data.data;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, productData: any) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to update product');

    return data.data;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/products/${productId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete product');

    return data.data;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}

/**
 * Upload product images
 */
export async function uploadImages(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const res = await fetch(`${getBaseUrl()}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Failed to upload images');
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

// -----------------------------
// ✅ Slider Banner API Helpers
// -----------------------------

export async function getSliders() {
  const res = await fetch(`${getBaseUrl()}/api/slider`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch sliders');
  return await res.json();
}

export async function createSlider(sliderData: {
  url: string;
  title?: string;
  subtitle?: string;
}) {
  const res = await fetch(`${getBaseUrl()}/api/slider`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sliderData),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Failed to create slider');
  }

  return await res.json();
}

export async function updateSlider(sliderData: {
  id: string;
  url?: string;
  title?: string;
  subtitle?: string;
}) {
  const res = await fetch(`${getBaseUrl()}/api/slider`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sliderData),
  });

  if (!res.ok) throw new Error('Failed to update slider');
  return await res.json();
}

export async function deleteSlider(id: string) {
  const res = await fetch(`${getBaseUrl()}/api/slider`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error('Failed to delete slider');
  return await res.json();
}