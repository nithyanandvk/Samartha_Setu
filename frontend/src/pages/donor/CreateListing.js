import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI } from '../../utils/api';
import Navbar from '../../components/Navbar';
import { Package, MapPin, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { geocodeAddress, getCurrentLocation } from '../../utils/geocoding';

const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: 'cooked',
    quantityValue: '',
    quantityUnit: 'servings',
    address: '',
    latitude: '',
    longitude: '',
    pickupStart: '',
    pickupEnd: '',
    fallbackPreference: 'receiver',
    isBulk: false
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setFormData(prev => ({
        ...prev,
        latitude: location.lat.toString(),
        longitude: location.lng.toString()
      }));
      toast.success('Current location captured!');
    } catch (error) {
      toast.error('Unable to get current location');
    }
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address) {
      toast.error('Please enter an address first');
      return;
    }

    try {
      toast.loading('Finding location...');
      const location = await geocodeAddress(formData.address);
      setFormData(prev => ({
        ...prev,
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        address: location.address
      }));
      toast.dismiss();
      toast.success('Address location found!');
    } catch (error) {
      toast.dismiss();
      toast.error('Address not found. Please try a more specific address.');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file sizes
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('foodType', formData.foodType);
      formDataToSend.append('quantity[value]', formData.quantityValue);
      formDataToSend.append('quantity[unit]', formData.quantityUnit);
      formDataToSend.append('location[type]', 'Point');
      formDataToSend.append('location[coordinates][0]', formData.longitude);
      formDataToSend.append('location[coordinates][1]', formData.latitude);
      formDataToSend.append('location[address]', formData.address);
      formDataToSend.append('pickupTimes[start]', new Date(formData.pickupStart).toISOString());
      formDataToSend.append('pickupTimes[end]', new Date(formData.pickupEnd).toISOString());
      formDataToSend.append('fallbackPreference', formData.fallbackPreference);
      formDataToSend.append('isBulk', formData.isBulk);

      // Append images
      selectedImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await listingsAPI.create(formDataToSend);
      toast.success('Listing created successfully!');
      navigate('/donor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Food Listing</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="label">
              <Package size={16} className="inline mr-2" />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Fresh Vegetable Curry - 10 servings"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="3"
              placeholder="Describe the food, preparation time, etc."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Food Type</label>
              <select name="foodType" value={formData.foodType} onChange={handleChange} className="input">
                <option value="cooked">Cooked</option>
                <option value="raw">Raw</option>
                <option value="packaged">Packaged</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="bakery">Bakery</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="label">Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="quantityValue"
                  value={formData.quantityValue}
                  onChange={handleChange}
                  className="input flex-1"
                  placeholder="10"
                  required
                />
                <select name="quantityUnit" value={formData.quantityUnit} onChange={handleChange} className="input">
                  <option value="servings">Servings</option>
                  <option value="kg">KG</option>
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="label">
              <MapPin size={16} className="inline mr-2" />
              Pickup Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input flex-1"
                placeholder="Enter full address (e.g., 123 Street, City, State)"
                required
              />
              <button 
                type="button" 
                onClick={handleGeocodeAddress} 
                className="btn btn-primary"
                title="Find coordinates from address"
              >
                <Search size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter address and click search to auto-fill coordinates, or use "Get Current Location"
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="input"
                placeholder="Latitude"
                required
                readOnly
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="input"
                placeholder="Longitude"
                required
                readOnly
              />
            </div>
            <button type="button" onClick={handleGetLocation} className="btn btn-outline">
              <MapPin size={16} className="mr-2" />
              Current Location
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <Clock size={16} className="inline mr-2" />
                Pickup Start
              </label>
              <input
                type="datetime-local"
                name="pickupStart"
                value={formData.pickupStart}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Pickup End</label>
              <input
                type="datetime-local"
                name="pickupEnd"
                value={formData.pickupEnd}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="label">
              📸 Food Images (Optional, Max 5)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
                disabled={selectedImages.length >= 5}
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <div className="text-gray-600">
                  <Package size={48} className="mx-auto mb-2 text-gray-400" />
                  <p className="font-medium">Click to upload food images</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, WEBP up to 5MB each ({selectedImages.length}/5)
                  </p>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label">Fallback Preference (if no claims)</label>
            <select name="fallbackPreference" value={formData.fallbackPreference} onChange={handleChange} className="input">
              <option value="receiver">Receiver → Animal Farm → Biocompost</option>
              <option value="animal_farm">Animal Farm → Biocompost</option>
              <option value="biocompost">Biocompost Only</option>
              <option value="none">No Fallback</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isBulk"
                checked={formData.isBulk}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">This is a bulk listing (for organizations)</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            <button type="button" onClick={() => navigate('/donor/dashboard')} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
