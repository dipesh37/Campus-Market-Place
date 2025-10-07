import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, ShoppingBag, MessageCircle, Star, Mail, Phone, MapPin, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

// API URL - change this when deploying
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showSellModal, setShowSellModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  


  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // Sell product form
  const [sellFormData, setSellFormData] = useState({
    name: '',
    category: '',
    price: '',
    condition: '',
    description: '',
    phone: '',
    year: '',
    branch: '',
    image: ''
  });
  
  const [errors, setErrors] = useState({});
  const [sellErrors, setSellErrors] = useState({});

  // Fetch products when user logs in
  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  };

  const validateEmail = (email) => {
    return email.endsWith('@nitj.ac.in');
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSellErrors({ ...sellErrors, image: 'Please upload a valid image file (JPG, PNG, GIF, WEBP)' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSellErrors({ ...sellErrors, image: 'Image size should be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setSellFormData({ ...sellFormData, image: base64String });
      setSellErrors({ ...sellErrors, image: undefined });
      setUploadingImage(false);
    };
    reader.onerror = () => {
      setSellErrors({ ...sellErrors, image: 'Failed to read image file' });
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Please use your NITJ email (@nitj.ac.in)';
    }
    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          token: response.data.data.token
        });
        setCurrentPage('browse');
        setErrors({});
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.response?.data?.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Please use your NITJ email (@nitj.ac.in)';
    }
    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          token: response.data.data.token
        });
        setCurrentPage('browse');
        setErrors({});
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        general: error.response?.data?.message || 'Signup failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setFormData({ name: '', email: '', password: '' });
    setProducts([]);
  };

  const handleSellProduct = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!sellFormData.name || sellFormData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }
    if (!sellFormData.category || sellFormData.category.trim().length < 2) {
      newErrors.category = 'Please enter a category';
    }
    if (!sellFormData.price || parseFloat(sellFormData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!sellFormData.condition) {
      newErrors.condition = 'Please select condition';
    }
    if (!sellFormData.description || sellFormData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!sellFormData.phone || sellFormData.phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!sellFormData.year) {
      newErrors.year = 'Please enter your year';
    }
    if (!sellFormData.branch || sellFormData.branch.trim().length < 2) {
      newErrors.branch = 'Please enter your branch';
    }
    if (!sellFormData.image) {
      newErrors.image = 'Please upload a product image';
    }

    if (Object.keys(newErrors).length > 0) {
      setSellErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/products`,
        {
          name: sellFormData.name,
          category: sellFormData.category,
          price: parseFloat(sellFormData.price),
          condition: sellFormData.condition,
          description: sellFormData.description,
          phone: sellFormData.phone,
          year: sellFormData.year,
          branch: sellFormData.branch,
          image: sellFormData.image
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        // Reset form
        setSellFormData({
          name: '',
          category: '',
          price: '',
          condition: '',
          description: '',
          phone: '',
          year: '',
          branch: '',
          image: ''
        });
        setImagePreview(null);
        setSellErrors({});
        setShowSellModal(false);
        
        // Refresh products
        fetchProducts();
        
        alert('Product listed successfully!');
      }
    } catch (error) {
      console.error('Sell product error:', error);
      setSellErrors({
        general: error.response?.data?.message || 'Failed to list product. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Login/Signup Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Campus Kart</h1>
            <p className="text-xl text-gray-600">Dr. B.R. Ambedkar National Institute of Technology</p>
            <p className="text-lg text-gray-500 mt-1">Jalandhar, Punjab</p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {isSignup ? 'Create Your Account' : 'Welcome Back!'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isSignup ? 'Join the campus marketplace' : 'Sign in to access the marketplace'}
              </p>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="yourname@nitj.ac.in"
                  disabled={loading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (minimum 8 characters)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter password (min 8 characters)"
                  disabled={loading}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="button"
                onClick={isSignup ? handleSignup : handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-orange-600 hover:text-orange-700 font-medium"
                disabled={loading}
              >
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Buy & Sell</h3>
              <p className="text-sm text-gray-600">Trade items with fellow students safely</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Direct Connect</h3>
              <p className="text-sm text-gray-600">Chat directly with sellers</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Trusted Community</h3>
              <p className="text-sm text-gray-600">Verified NITJ students only</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Browse Page
  if (currentPage === 'browse' && !selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Campus Kart</h1>
                  <p className="text-xs text-gray-500">NIT Jalandhar</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSellModal(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Sell Item</span>
                </button>
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Hello, {user?.name}! 👋</h2>
            <p className="text-lg opacity-90">Welcome to our campus marketplace. Find great deals from fellow students!</p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <User className="w-4 h-4" />
                    <span>{product.owner.name} • {product.owner.year}</span>
                  </div>
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {product.condition}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found. Try a different search!</p>
            </div>
          )}
        </div>

        {showSellModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-8">
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">List Your Item for Sale</h2>
              <button
                onClick={() => {
                  setShowSellModal(false);
                  setSellErrors({});
                  setImagePreview(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSellProduct} className="p-6 overflow-y-auto flex-1">
                {sellErrors.general && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {sellErrors.general}
                  </div>
                )}

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setSellFormData({ ...sellFormData, image: '' });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <label className="cursor-pointer">
                          <span className="text-orange-600 hover:text-orange-700 font-medium">
                            {uploadingImage ? 'Uploading...' : 'Click to upload'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={uploadingImage || loading}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                  {sellErrors.image && <p className="text-red-500 text-sm mt-1">{sellErrors.image}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={sellFormData.name}
                      onChange={(e) => setSellFormData({ ...sellFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Study Lamp - LED Desk Light"
                      disabled={loading}
                    />
                    {sellErrors.name && <p className="text-red-500 text-sm mt-1">{sellErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={sellFormData.category}
                      onChange={(e) => setSellFormData({ ...sellFormData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., lamp, book, fan"
                      disabled={loading}
                    />
                    {sellErrors.category && <p className="text-red-500 text-sm mt-1">{sellErrors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={sellFormData.price}
                      onChange={(e) => setSellFormData({ ...sellFormData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., 350"
                      disabled={loading}
                    />
                    {sellErrors.price && <p className="text-red-500 text-sm mt-1">{sellErrors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      value={sellFormData.condition}
                      onChange={(e) => setSellFormData({ ...sellFormData, condition: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select condition</option>
                      <option value="Like New">Like New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                    {sellErrors.condition && <p className="text-red-500 text-sm mt-1">{sellErrors.condition}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={sellFormData.phone}
                      onChange={(e) => setSellFormData({ ...sellFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 1234567890"
                      disabled={loading}
                    />
                    {sellErrors.phone && <p className="text-red-500 text-sm mt-1">{sellErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <select
                      value={sellFormData.year}
                      onChange={(e) => setSellFormData({ ...sellFormData, year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                    {sellErrors.year && <p className="text-red-500 text-sm mt-1">{sellErrors.year}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch *
                    </label>
                    <input
                      type="text"
                      value={sellFormData.branch}
                      onChange={(e) => setSellFormData({ ...sellFormData, branch: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Computer Science, ECE"
                      disabled={loading}
                    />
                    {sellErrors.branch && <p className="text-red-500 text-sm mt-1">{sellErrors.branch}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={sellFormData.description}
                    onChange={(e) => setSellFormData({ ...sellFormData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="4"
                    placeholder="Describe your item in detail..."
                    disabled={loading}
                  />
                  {sellErrors.description && <p className="text-red-500 text-sm mt-1">{sellErrors.description}</p>}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSellModal(false);
                      setSellErrors({});
                      setImagePreview(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Listing...' : 'List Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Product Detail Page
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Back to Browse</span>
              </button>
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-8">
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="max-w-full max-h-96 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-9xl">📦</div>
                  )}
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h1>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl font-bold text-orange-600">₹{selectedProduct.price}</span>
                    </div>
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Condition: {selectedProduct.condition}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Seller Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{selectedProduct.owner.name}</p>
                          <p className="text-sm text-gray-600">{selectedProduct.owner.year} • {selectedProduct.owner.branch}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-700">
                        <Mail className="w-5 h-5 text-orange-600" />
                        <a href={`mailto:${selectedProduct.owner.email}`} className="hover:text-orange-600">
                          {selectedProduct.owner.email}
                        </a>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-700">
                        <Phone className="w-5 h-5 text-orange-600" />
                        <a href={`tel:${selectedProduct.owner.phone}`} className="hover:text-orange-600">
                          {selectedProduct.owner.phone}
                        </a>
                      </div>

                      <div className="flex items-center space-x-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        <span>NIT Jalandhar Campus</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <a
                        href={`mailto:${selectedProduct.owner.email}?subject=Interest in ${selectedProduct.name}`}
                        className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                      >
                        Contact Seller via Email
                      </a>
                      <a
                        href={`tel:${selectedProduct.owner.phone}`}
                        className="block w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-600 transition-all shadow-md"
                      >
                        Call Seller
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3">🛡️ Safety Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Meet in public campus locations (library, canteen, academic blocks)</li>
                <li>• Verify the item condition before making payment</li>
                <li>• Use your NITJ email for all communications</li>
                <li>• Report any suspicious activity to campus authorities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;