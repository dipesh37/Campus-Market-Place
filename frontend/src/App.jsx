import React, { useState, useEffect } from 'react';
import { Search, User, LogOut, ShoppingBag, MessageCircle, Star, Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

// API URL - change this when deploying
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Expanded mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Study Lamp - LED Desk Light",
    category: "lamp",
    price: 350,
    owner: {
      name: "Rahul Sharma",
      year: "4th Year",
      branch: "Computer Science",
      email: "rahul.sharma@nitj.ac.in",
      phone: "+91 98765 43210"
    },
    condition: "Excellent",
    description: "Barely used LED desk lamp with adjustable brightness. Perfect for late-night study sessions!",
    image: "💡",
    rating: 4.8
  },
  {
    id: 2,
    name: "Engineering Mathematics Textbook",
    category: "book",
    price: 200,
    owner: {
      name: "Priya Verma",
      year: "3rd Year",
      branch: "Electronics",
      email: "priya.verma@nitj.ac.in",
      phone: "+91 98765 43211"
    },
    condition: "Good",
    description: "Complete textbook with all chapters. Minor highlighting included.",
    image: "📚",
    rating: 4.5
  },
  {
    id: 3,
    name: "Ceiling Fan - High Speed",
    category: "fan",
    price: 800,
    owner: {
      name: "Amit Kumar",
      year: "4th Year",
      branch: "Mechanical",
      email: "amit.kumar@nitj.ac.in",
      phone: "+91 98765 43212"
    },
    condition: "Very Good",
    description: "3-blade ceiling fan, works perfectly. Selling due to hostel change.",
    image: "🌀",
    rating: 4.7
  },
  {
    id: 4,
    name: "Study Table - Wooden",
    category: "table",
    price: 1200,
    owner: {
      name: "Sneha Patel",
      year: "Final Year",
      branch: "Civil",
      email: "sneha.patel@nitj.ac.in",
      phone: "+91 98765 43213"
    },
    condition: "Good",
    description: "Sturdy wooden study table with drawer. Ideal for hostel room.",
    image: "🪑",
    rating: 4.6
  },
  {
    id: 5,
    name: "Winter Blanket - Warm & Cozy",
    category: "blanket",
    price: 450,
    owner: {
      name: "Vikram Singh",
      year: "2nd Year",
      branch: "Electrical",
      email: "vikram.singh@nitj.ac.in",
      phone: "+91 98765 43214"
    },
    condition: "Excellent",
    description: "Thick winter blanket, freshly washed. Perfect for Punjab winters!",
    image: "🛏️",
    rating: 4.9
  },
  {
    id: 6,
    name: "Data Structures Book",
    category: "book",
    price: 350,
    owner: {
      name: "Ananya Reddy",
      year: "3rd Year",
      branch: "IT",
      email: "ananya.reddy@nitj.ac.in",
      phone: "+91 98765 43215"
    },
    condition: "Like New",
    description: "Latest edition with solved examples. Minimal wear and tear.",
    image: "📖",
    rating: 4.8
  },
  {
    id: 7,
    name: "Window Curtains - Blue",
    category: "curtain",
    price: 600,
    owner: {
      name: "Neha Gupta",
      year: "2nd Year",
      branch: "CSE",
      email: "neha.gupta@nitj.ac.in",
      phone: "+91 98765 43216"
    },
    condition: "Excellent",
    description: "Beautiful blue curtains, 2 panels. Fits standard hostel windows.",
    image: "🪟",
    rating: 4.7
  },
  {
    id: 8,
    name: "Scientific Calculator - Casio",
    category: "calculator",
    price: 400,
    owner: {
      name: "Rohan Mehta",
      year: "3rd Year",
      branch: "Mechanical",
      email: "rohan.mehta@nitj.ac.in",
      phone: "+91 98765 43217"
    },
    condition: "Very Good",
    description: "Casio fx-991EX scientific calculator. All functions working perfectly.",
    image: "🔢",
    rating: 4.9
  },
  {
    id: 9,
    name: "Geometry Box Set",
    category: "geometry",
    price: 100,
    owner: {
      name: "Kavya Sharma",
      year: "1st Year",
      branch: "Civil",
      email: "kavya.sharma@nitj.ac.in",
      phone: "+91 98765 43218"
    },
    condition: "Good",
    description: "Complete geometry box with compass, protractor, and rulers.",
    image: "📐",
    rating: 4.4
  },
  {
    id: 10,
    name: "Electric Kettle - 1.5L",
    category: "kettle",
    price: 550,
    owner: {
      name: "Aditya Joshi",
      year: "4th Year",
      branch: "ECE",
      email: "aditya.joshi@nitj.ac.in",
      phone: "+91 98765 43219"
    },
    condition: "Very Good",
    description: "Fast boiling electric kettle. Perfect for tea/coffee in hostel.",
    image: "🫖",
    rating: 4.6
  },
  {
    id: 11,
    name: "Lab Coat - White",
    category: "labcoat",
    price: 250,
    owner: {
      name: "Simran Kaur",
      year: "2nd Year",
      branch: "Chemical",
      email: "simran.kaur@nitj.ac.in",
      phone: "+91 98765 43220"
    },
    condition: "Good",
    description: "Standard lab coat, size M. Clean and well-maintained.",
    image: "🥼",
    rating: 4.5
  },
  {
    id: 12,
    name: "Headphones - Wireless",
    category: "headphones",
    price: 1200,
    owner: {
      name: "Arjun Singh",
      year: "3rd Year",
      branch: "IT",
      email: "arjun.singh@nitj.ac.in",
      phone: "+91 98765 43221"
    },
    condition: "Excellent",
    description: "Bluetooth wireless headphones with noise cancellation. Battery lasts 20hrs.",
    image: "🎧",
    rating: 4.8
  },
  {
    id: 13,
    name: "Drawing Board A2 Size",
    category: "drawing",
    price: 300,
    owner: {
      name: "Tanvi Desai",
      year: "1st Year",
      branch: "Architecture",
      email: "tanvi.desai@nitj.ac.in",
      phone: "+91 98765 43222"
    },
    condition: "Like New",
    description: "A2 size drawing board with T-square. Barely used.",
    image: "📋",
    rating: 4.7
  },
  {
    id: 14,
    name: "Printer - HP LaserJet",
    category: "printer",
    price: 3500,
    owner: {
      name: "Karan Malhotra",
      year: "Final Year",
      branch: "CSE",
      email: "karan.malhotra@nitj.ac.in",
      phone: "+91 98765 43223"
    },
    condition: "Good",
    description: "HP LaserJet printer with Wi-Fi. Includes extra toner.",
    image: "🖨️",
    rating: 4.6
  },
  {
    id: 15,
    name: "Backpack - Laptop Bag",
    category: "bag",
    price: 800,
    owner: {
      name: "Ishita Rao",
      year: "2nd Year",
      branch: "ECE",
      email: "ishita.rao@nitj.ac.in",
      phone: "+91 98765 43224"
    },
    condition: "Very Good",
    description: "Spacious laptop backpack with multiple compartments. Fits 15.6 inch laptop.",
    image: "🎒",
    rating: 4.7
  }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return email.endsWith('@nitj.ac.in');
  };

  const validatePassword = (password) => {
    return password.length >= 8; // Minimum 8 characters
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
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Login/Signup Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Campus Connect</h1>
            <p className="text-xl text-gray-600">Dr. B.R. Ambedkar National Institute of Technology</p>
            <p className="text-lg text-gray-500 mt-1">Jalandhar, Punjab</p>
          </div>

          {/* Login/Signup Form */}
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

          {/* Features */}
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
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Campus Connect</h1>
                  <p className="text-xs text-gray-500">NIT Jalandhar</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
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
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Hello, {user?.name}! 👋</h2>
            <p className="text-lg opacity-90">Welcome to our campus marketplace. Find great deals from fellow students!</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for lamps, books, fans, calculators, curtains..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">{product.image}</div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
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
      </div>
    );
  }

  // Product Detail Page
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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
                {/* Product Image */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-12 flex items-center justify-center">
                  <div className="text-9xl">{selectedProduct.image}</div>
                </div>

                {/* Product Details */}
                <div className="p-8">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h1>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl font-bold text-orange-600">₹{selectedProduct.price}</span>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{selectedProduct.rating}</span>
                      </div>
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

            {/* Safety Tips */}
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