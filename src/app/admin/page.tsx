"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { categories } from '@/data/categories';
import { createProduct, uploadImages, getProducts, deleteProduct,updateProduct,updateSlider,deleteSlider, } from '@/lib/api';

interface ImagePreview {
  file: File;
  preview: string;
}

interface SliderImagePreview extends ImagePreview {
  title?: string;
  subtitle?: string;
}

interface SliderBanner {
  _id: string;
  url: string;
  title?: string;
  subtitle?: string;
}

interface Product {
  _id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  launchDate: string;
  description: string;
  brand: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsByCategory {
  [category: string]: Product[];
}

type SliderImage = {
  file: File;
  preview: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
};



const AdminPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'add'
  const [products, setProducts] = useState<Product[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
const [editProductId, setEditProductId] = useState<string | null>(null);
const [productsLoading, setProductsLoading] = useState(true);
  
const [sliderImages, setSliderImages] = useState<SliderBanner[]>([]);
const [deletingSliderImage, setDeletingSliderImage] = useState<string | null>
(null);

const [sliderUploadImages, setSliderUploadImages] = useState<SliderImagePreview[]>([]);
  // Form state
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [brand, setBrand] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [sliderTitle, setSliderTitle] = useState('');
  const [sliderSubtitle, setSliderSubtitle] = useState('');

  const updateSliderImageField = (index: number, key: keyof SliderImage, value: string) => {
    setSliderUploadImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  useEffect(() => {
    console.log("🔥 useEffect fired on client");
  
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
      console.log("🔐 Auth check - adminLoggedIn:", isLoggedIn);
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
  
      if (!isLoggedIn) {
        router.push('/admin/login');
      }
    }
  }, []);

  // Fetch products when authenticated
  useEffect(() => {
    console.log("✅ useEffect triggered, isAuthenticated:", isAuthenticated); 
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'slider') {
      fetchSliderImages();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchSliderImages();
  }, []);
  
  const fetchSliderImages = async () => {
    try {
      const res = await fetch('/api/slider');
      if (!res.ok) throw new Error('Failed to fetch slider images');
      const data = await res.json();
  
      // ✅ Use correct shape based on what your backend returns
      setSliderImages(Array.isArray(data) ? data : data.sliderImages || []);
    } catch (err) {
      console.error("Failed to fetch slider images", err);
    }
  };

  const updateSliderImageFieldById = (id: string, field: 'title' | 'subtitle', value: string) => {
    setSliderImages(prev =>
      prev.map(img =>
        img._id === id ? { ...img, [field]: value } : img
      )
    );
  };

  const handleUpdateSlider = async (banner: SliderBanner) => {
    try {
      await updateSlider({
        id: banner._id,
        title: banner.title,
        subtitle: banner.subtitle,
      });
      alert("Slider updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDeleteSliderImage = async (id: string) => {
    try {
      await deleteSlider(id);
      setSliderImages(prev => prev.filter(img => img._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    setProductsLoading(true); // ⏳ Start loading
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
  
      // Organize by category
      const productsByCat: ProductsByCategory = {};
      fetchedProducts.forEach((product: Product) => {
        if (!productsByCat[product.category]) {
          productsByCat[product.category] = [];
        }
        productsByCat[product.category].push(product);
      });
  
      setProductsByCategory(productsByCat);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false); // ✅ Stop loading
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: ImagePreview[] = [];
      
      Array.from(e.target.files).forEach(file => {
        newImages.push({
          file,
          preview: URL.createObjectURL(file)
        });
      });
      
      setImages([...images, ...newImages]);
    }
  };

  const handleSliderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: ImagePreview[] = [];
  
      Array.from(e.target.files).forEach((file) => {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
        });
      });
  
      setSliderUploadImages([...sliderUploadImages, ...newImages]);
    }
  };
  // Remove image
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  const removeSliderImage = (index: number) => {
    const updated = [...sliderUploadImages];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setSliderUploadImages(updated);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      const newImageFiles = images.filter(img => img.file.name).map(img => img.file);
      let imageUrls = images.filter(img => !img.file.name).map(img => img.preview); // existing URLs
  
      if (newImageFiles.length > 0) {
        const uploaded = await uploadImages(newImageFiles);
        imageUrls = [...imageUrls, ...uploaded];
      }
  
      const productData = {
        productId,
        name: productName,
        category,
        price: parseFloat(price),
        launchDate,
        description,
        brand,
        images: imageUrls,
      };
  
      if (isEditing && editProductId) {
        await updateProduct(editProductId, productData);
        setSuccessMessage('Product updated successfully!');
        setActiveTab('manage'); // ✅ Switch to manage tab
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Optional scroll
      } else {
        await createProduct(productData);
        setSuccessMessage('Product added successfully!');
        setActiveTab('manage'); // ✅ Switch to manage tab
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Optional scroll
      }
  
      // Reset form
      setProductId('');
      setProductName('');
      setCategory('');
      setPrice('');
      setLaunchDate('');
      setDescription('');
      setBrand('');
      setImages([]);
      setSliderUploadImages([]); 
      setIsEditing(false);
      setEditProductId(null);
      fetchProducts();
  
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setIsDeleting(productId);
      
      try {
        await deleteProduct(productId);
        
        // Refresh products list
        fetchProducts();
        
        // Show success message
        setSuccessMessage('Product deleted successfully!');
        
        // Clear any previous error message
        setErrorMessage('');
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error: any) {
        console.error('Error deleting product:', error);
        setErrorMessage(error.message || 'Failed to delete product. Please try again.');
        
        // Auto-hide error message after 3 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  // Toggle product details
  const toggleProductDetails = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, this will redirect to login page
  if (!isAuthenticated) {
    return null;
  }

  // Get category name from ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-800">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>
      
      {/* Success and Error Messages */}
      {successMessage && (
  <div className="mb-6 p-3 bg-green-100 text-green-700 rounded flex justify-between items-center">
    <span>{successMessage}</span>
    <button
      onClick={() => setSuccessMessage('')}
      className="ml-4 text-green-700 hover:text-green-900 font-bold text-xl"
    >
      ×
    </button>
  </div>
)}
      
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'manage'
              ? 'border-b-2 border-amber-600 text-amber-600'
              : 'text-gray-500 hover:text-amber-500'
          }`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Products
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'add'
              ? 'border-b-2 border-amber-600 text-amber-600'
              : 'text-gray-500 hover:text-amber-500'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add New Product
        </button>
        <button
    className={`py-2 px-4 font-medium text-sm ${
      activeTab === 'slider'
        ? 'border-b-2 border-amber-600 text-amber-600'
        : 'text-gray-500 hover:text-amber-500'
    }`}
    onClick={() => setActiveTab('slider')}
  >
    Slider Images
  </button>
  <button className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'manageSlider'
              ? 'border-b-2 border-amber-600 text-amber-600'
              : 'text-gray-500 hover:text-amber-500'
          }`} onClick={() => setActiveTab('manageSlider')}>
  Manage Slider Images
</button>
      </div>
      
      {/* Manage Products Tab */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-amber-700 mb-4">Manage Products</h2>
          
          {Object.keys(productsByCategory).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found. Add some products to get started.</p>
              <button
                onClick={() => setActiveTab('add')}
                className="mt-4 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => (
              <div key={categoryId} className="mb-8">
                <h3 className="text-lg font-semibold text-amber-600 mb-3 border-b pb-2">
                  {getCategoryName(categoryId)} ({categoryProducts.length})
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Launch Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryProducts.map((product) => (
                        <React.Fragment key={product._id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {product.images && product.images.length > 0 ? (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      width={40}
                                      height={40}
                                      className="object-cover rounded"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                      No img
                                    </div>
                                    
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.brand}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.productId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{product.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(product.launchDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex space-x-2">
    <button
      onClick={() => toggleProductDetails(product._id)}
      className="text-amber-600 hover:text-amber-900"
    >
      {expandedProduct === product._id ? 'Hide' : 'View'}
    </button>

    <button
      onClick={() => {
        setActiveTab('add');
        setIsEditing(true);
        setEditProductId(product.productId); // ✅ correct
        setProductId(product.productId);
        setProductName(product.name);
        setCategory(product.category);
        setPrice(product.price.toString());
        setLaunchDate(product.launchDate.substring(0, 10));
        setDescription(product.description);
        setBrand(product.brand);
        setImages(
          product.images.map((url) => ({
            file: new File([], ''), // dummy file, not for re-upload
            preview: url,
          }))
        );
      }}
      className="text-blue-600 hover:text-blue-900"
    >
      Edit
    </button>

    <button
      onClick={() => handleDeleteProduct(product.productId)}
      className="text-red-600 hover:text-red-900"
      disabled={isDeleting === product.productId}
    >
      {isDeleting === product.productId ? 'Deleting...' : 'Delete'}
    </button>
  </div>
</td>
                          </tr>
                          
                          {/* Expanded product details */}
                          {expandedProduct === product._id && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>
                                    
                                    <h4 className="font-medium text-gray-900 mt-4 mb-2">Details</h4>
                                    <ul className="text-sm text-gray-600">
                                      <li><span className="font-medium">ID:</span> {product.productId}</li>
                                      <li><span className="font-medium">Category:</span> {getCategoryName(product.category)}</li>
                                      <li><span className="font-medium">Brand:</span> {product.brand}</li>
                                      <li><span className="font-medium">Price:</span> ₹{product.price.toLocaleString()}</li>
                                      <li><span className="font-medium">Launch Date:</span> {formatDate(product.launchDate)}</li>
                                      <li><span className="font-medium">Added on:</span> {formatDate(product.createdAt)}</li>
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                                    {product.images && product.images.length > 0 ? (
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {product.images.map((image, index) => (
                                          <div key={index} className="relative aspect-square">
                                            <Image
                                              src={image}
                                              alt={`${product.name} - Image ${index + 1}`}
                                              fill
                                              className="object-cover rounded"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No images available</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Add New Product Tab */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-amber-700 mb-4">Add New Product</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="productId" className="block text-gray-700 mb-1">Product ID*</label>
                <input
                  type="text"
                  id="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting || isEditing}
                />
              </div>
              
              <div>
                <label htmlFor="productName" className="block text-gray-700 mb-1">Product Name*</label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-gray-700 mb-1">Category*</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="brand" className="block text-gray-700 mb-1">Brand*</label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-gray-700 mb-1">Price (₹)*</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="launchDate" className="block text-gray-700 mb-1">Launch Date*</label>
                <input
                  type="date"
                  id="launchDate"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 mb-1">Description*</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">Product Images*</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="images"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                  multiple
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="images"
                  className={`cursor-pointer inline-block bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Upload Images
                </label>
                <p className="mt-2 text-sm text-gray-500">Click to upload multiple images</p>
              </div>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
  {isEditing && (
    <button
      type="button"
      onClick={() => {
        setIsEditing(false);
        setEditProductId(null);
        setProductId('');
        setProductName('');
        setCategory('');
        setPrice('');
        setLaunchDate('');
        setDescription('');
        setBrand('');
        setImages([]);
        setActiveTab('manage'); 
      }}
      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
      disabled={isSubmitting}
    >
      Cancel Edit
    </button>
  )}

  <button
    type="submit"
    disabled={isSubmitting}
    className={`bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isSubmitting ? (
      <>
        <span className="inline-block animate-spin mr-2">⟳</span>
        {isEditing ? 'Updating Product...' : 'Adding Product...'}
      </>
    ) : (
      isEditing ? 'Update Product' : 'Add Product'
    )}
  </button>
</div>
          </form>
        </div>
      )}
{activeTab === 'slider' && (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-xl font-bold text-amber-700 mb-4">Upload Slider Images</h2>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
          const files = sliderUploadImages.map(img => img.file);
          const uploadedUrls = await uploadImages(files);
          if (!uploadedUrls || !Array.isArray(uploadedUrls)) {
            throw new Error('Image upload failed — no URLs returned');
          }

          const payload = uploadedUrls.map((url:string, i:number) => ({
            url,
            title: sliderUploadImages[i].title || '',
            subtitle: sliderUploadImages[i].subtitle || '',
          }));

          const res = await fetch('/api/slider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error?.error || 'Failed to upload slider images');
          }

          setSliderUploadImages([]);
          setSuccessMessage('Slider images uploaded successfully!');
          fetchSliderImages();
        } catch (err: any) {
          setErrorMessage(err.message || 'Upload failed');
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {sliderUploadImages.map((img, index) => (
        <div key={index} className="relative group border rounded-lg p-2 shadow-md mb-4">
          <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-300 mb-2">
            <Image
              src={img.preview}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>

          <input
            type="text"
            placeholder="Title"
            className="w-full mb-2 p-2 border rounded"
            value={img.title || ''}
            onChange={(e) => updateSliderImageField(index, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="Subtitle"
            className="w-full mb-2 p-2 border rounded"
            value={img.subtitle || ''}
            onChange={(e) => updateSliderImageField(index, 'subtitle', e.target.value)}
          />
        

          <button
            type="button"
            onClick={() => removeSliderImage(index)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ))}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSliderImageUpload}
        className="mb-4"
      />

      <button
        type="submit"
        className={`bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Uploading...' : 'Upload to Slider'}
      </button>
    </form>

    {sliderImages.length > 0 && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-amber-700 mb-2">Uploaded Slider Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sliderImages.map((banner, index) => (
  <div key={banner._id} className="relative group border rounded-lg overflow-hidden">
    <Image
      src={banner.url}
      alt={`Slider ${index + 1}`}
      width={300}
      height={200}
      className="object-cover w-full h-40"
    />
    <button
      onClick={() => handleDeleteSliderImage(banner._id)}
      className="absolute top-2 right-2 bg-red-500 text-white text-sm rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
      disabled={deletingSliderImage === banner._id}
    >
      {deletingSliderImage === banner._id ? 'Deleting...' : 'Delete'}
    </button>
  </div>
))}
        </div>
      </div>
    )}
  </div>
)}

{activeTab === 'manageSlider' && (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-xl font-bold text-amber-700 mb-4">Manage Slider Images</h2>

    {sliderImages.length === 0 ? (
      <p>No slider images uploaded yet.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {sliderImages.map((banner) => (
  <div key={banner._id} className="border rounded-lg overflow-hidden shadow">
    <Image
      src={banner.url}
      alt={banner.title || "Slider"}
      width={400}
      height={250}
      className="object-cover w-full h-48"
    />
    <div className="p-4">
      <input
        className="w-full mb-2 p-2 border rounded"
        value={banner.title || ''}
        placeholder="Title"
        onChange={(e) => updateSliderImageFieldById(banner._id, 'title', e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        value={banner.subtitle || ''}
        placeholder="Subtitle"
        onChange={(e) => updateSliderImageFieldById(banner._id, 'subtitle', e.target.value)}
      />
      <div className="flex justify-between">
        <button
          className="bg-amber-600 text-white px-4 py-1 rounded hover:bg-amber-700"
          onClick={() => handleUpdateSlider(banner)}
        >
          Save
        </button>
        <button
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          onClick={() => handleDeleteSliderImage(banner._id)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
))}
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default AdminPage;
