import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Package, MapPin, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const response = await listingsAPI.getOne(id);
      setListing(response.data.listing);
    } catch (error) {
      toast.error('Failed to load listing');
      navigate('/map');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      await listingsAPI.claim(id);
      toast.success('Listing claimed successfully!');
      loadListing();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            {listing.images && listing.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={listing.images[selectedImage].url}
                    alt={listing.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`rounded-lg overflow-hidden border-2 transition ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${listing.title} ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 flex items-center justify-center">
                <Package size={120} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                <span className={`badge ${
                  listing.status === 'available' ? 'badge-primary' :
                  listing.status === 'claimed' ? 'badge-warning' :
                  listing.status === 'confirmed' ? 'badge-success' :
                  'badge-success'
                }`}>
                  {listing.status}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{listing.description}</p>

              {/* Details Grid */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Package className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Food Details</p>
                    <p className="font-semibold text-gray-900">
                      {listing.quantity.value} {listing.quantity.unit} • {listing.foodType}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Location</p>
                    <p className="font-semibold text-gray-900">{listing.location.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Time</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(listing.pickupTimes.start).toLocaleString()} - {new Date(listing.pickupTimes.end).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Donor</p>
                    <p className="font-semibold text-gray-900">{listing.donor?.name || 'Anonymous'}</p>
                    {listing.donor?.organizationName && (
                      <p className="text-sm text-gray-600">{listing.donor.organizationName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {user?.role === 'receiver' && listing.status === 'available' && (
                <button onClick={handleClaim} className="btn btn-primary w-full mt-6">
                  Claim This Listing
                </button>
              )}

              {listing.status === 'claimed' && listing.claimedBy && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⏳ This listing has been claimed and is awaiting donor approval
                  </p>
                </div>
              )}

              {listing.status === 'confirmed' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ This listing has been confirmed for pickup
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
