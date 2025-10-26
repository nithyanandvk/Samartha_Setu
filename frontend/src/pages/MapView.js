import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import socketService from '../utils/socket';
import L from 'leaflet';
import { Filter, Clock, Package, MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foodIcon = createIcon('blue');
const selectedFoodIcon = createIcon('red'); // Highlighted icon for selected listing
const fridgeIcon = createIcon('green');
const animalIcon = createIcon('orange');
const biocompostIcon = createIcon('yellow');

// Function to calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInKm = R * c;
  const distanceInMeters = distanceInKm * 1000;

  return {
    kilometers: distanceInKm,
    meters: distanceInMeters,
  };
}

// Map Controller Component to handle map centering
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], center.zoom || 15, {
        animate: true,
        duration: 1
      });
    }
  }, [center, map]);
  
  return null;
}

const MapView = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [sortedListings, setSortedListings] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [filters, setFilters] = useState({
    foodType: 'all',
    radius: null, // null = show all, number = filter by distance
    immediatePickup: false
  });
  const [userLocation, setUserLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    getUserLocation();
    loadCheckpoints();
    
    // Listen for new listings
    socketService.on('new_listing', (listing) => {
      console.log('New listing received:', listing);
      setListings(prev => {
        // Check if listing already exists
        const exists = prev.some(l => l._id === listing._id);
        if (!exists) {
          toast.success('New food listing available nearby!');
          return [listing, ...prev];
        }
        return prev;
      });
    });

    // Listen for listing updates
    socketService.on('listing_updated', (updatedListing) => {
      console.log('Listing updated:', updatedListing);
      setListings(prev => prev.map(l => 
        l._id === updatedListing._id ? updatedListing : l
      ));
    });

    // Listen for listing claimed
    socketService.on('listing_claimed', ({ listing }) => {
      console.log('Listing claimed:', listing);
      setListings(prev => prev.map(l => 
        l._id === listing._id ? { ...l, status: 'claimed', claimedBy: listing.claimedBy } : l
      ));
    });

    // Listen for claim confirmed
    socketService.on('claim_confirmed', (listing) => {
      console.log('Claim confirmed:', listing);
      setListings(prev => prev.map(l => 
        l._id === listing._id ? { ...l, status: 'confirmed' } : l
      ));
    });

    return () => {
      socketService.removeAllListeners('new_listing');
      socketService.removeAllListeners('listing_updated');
      socketService.removeAllListeners('listing_claimed');
      socketService.removeAllListeners('claim_confirmed');
    };
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setCurrentLocation(location);
        },
        () => {
          // Default to Delhi if location denied
          const defaultLocation = { lat: 28.6139, lng: 77.2090 };
          setUserLocation(defaultLocation);
          setCurrentLocation(defaultLocation);
        }
      );
    } else {
      const defaultLocation = { lat: 28.6139, lng: 77.2090 };
      setUserLocation(defaultLocation);
      setCurrentLocation(defaultLocation);
    }
  };

  const loadListings = useCallback(async (refreshLocation = false) => {
    try {
      // If refresh is clicked, get fresh current location
      let locationToUse = currentLocation;
      if (refreshLocation && navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        locationToUse = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(locationToUse);
        toast.success('Location updated!');
      }

      const params = {
        // Only include location if radius filter is being used
        ...(filters.radius && {
          latitude: locationToUse.lat,
          longitude: locationToUse.lng,
          radius: filters.radius
        }),
        // Only include food type if not 'all'
        ...(filters.foodType !== 'all' && { foodType: filters.foodType }),
        // Only include immediate pickup if checked
        ...(filters.immediatePickup && { immediatePickup: filters.immediatePickup })
      };
      
      const response = await listingsAPI.getAll(params);
      const fetchedListings = response.data.listings;
      
      // Calculate distance for each listing and add it to the listing object
      const listingsWithDistance = fetchedListings.map(listing => {
        if (listing.location && listing.location.coordinates) {
          const distance = getDistance(
            locationToUse.lat,
            locationToUse.lng,
            listing.location.coordinates[1],
            listing.location.coordinates[0]
          );
          return {
            ...listing,
            distance: distance.kilometers,
            distanceText: distance.kilometers < 1 
              ? `${Math.round(distance.meters)} m`
              : `${distance.kilometers.toFixed(2)} km`
          };
        }
        return { ...listing, distance: null, distanceText: 'N/A' };
      });

      // Sort by distance (shortest first)
      const sorted = listingsWithDistance.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      setListings(sorted);
      setSortedListings(sorted);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load listings');
    }
  }, [currentLocation, filters]);

  useEffect(() => {
    if (currentLocation) {
      loadListings();
    }
  }, [filters]);

  useEffect(() => {
    if (userLocation) {
      loadListings();
    }
  }, [userLocation]);

  const loadCheckpoints = async () => {
    try {
      const response = await adminAPI.getCheckpoints({ isActive: true });
      setCheckpoints(response.data.checkpoints);
    } catch (error) {
      console.error('Error loading checkpoints:', error);
    }
  };

  const handleClaimListing = async (listingId) => {
    if (!isAuthenticated) {
      toast.error('Please login to claim listings');
      navigate('/login');
      return;
    }

    if (user.role !== 'receiver') {
      toast.error('Only receivers can claim listings');
      return;
    }

    try {
      await listingsAPI.claim(listingId);
      toast.success('Listing claimed! Waiting for donor confirmation.');
      loadListings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to claim listing');
    }
  };

  const getCheckpointIcon = (type) => {
    switch(type) {
      case 'fridge': return fridgeIcon;
      case 'animal_farm': return animalIcon;
      case 'biocompost': return biocompostIcon;
      default: return fridgeIcon;
    }
  };

  const handleListingCardClick = (listing) => {
    if (listing.location && listing.location.coordinates) {
      const lat = listing.location.coordinates[1];
      const lng = listing.location.coordinates[0];
      setMapCenter({ lat, lng, zoom: 15 });
      setSelectedListing(listing._id);
      // Scroll to map
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success(`Showing ${listing.title} on map`);
    }
  };

  if (!userLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={20} className="text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label text-sm">Food Type</label>
              <select
                value={filters.foodType}
                onChange={(e) => setFilters({...filters, foodType: e.target.value})}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="cooked">Cooked</option>
                <option value="raw">Raw</option>
                <option value="packaged">Packaged</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="bakery">Bakery</option>
              </select>
            </div>

            <div>
              <label className="label text-sm">Radius</label>
              <select
                value={filters.radius || ''}
                onChange={(e) => setFilters({...filters, radius: e.target.value ? parseInt(e.target.value) : null})}
                className="input"
              >
                <option value="">All Locations</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.immediatePickup}
                  onChange={(e) => setFilters({...filters, immediatePickup: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Immediate Pickup Only</span>
              </label>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => loadListings(true)} 
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Navigation size={16} />
                Refresh Location
              </button>
            </div>
          </div>
        </div>

        {/* Listings Count */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-900">
                {listings.filter(l => l.status === 'available').length} Available Listings
              </span>
              <span className="text-xs text-gray-500">
                ({listings.length} total)
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200" style={{ height: '600px' }}>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <MapController center={mapCenter} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Food Listings - Only show available listings */}
            {listings.filter(listing => listing.status === 'available').map((listing) => (
              <Marker
                key={listing._id}
                position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                icon={selectedListing === listing._id ? selectedFoodIcon : foodIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p className="flex items-center gap-1">
                        <Package size={14} />
                        {listing.quantity.value} {listing.quantity.unit}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock size={14} />
                        Pickup: {new Date(listing.pickupTimes.start).toLocaleTimeString()}
                      </p>
                      <p className="text-xs">By: {listing.donor?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/listing/${listing._id}`)}
                        className="btn btn-outline btn-sm flex-1"
                      >
                        Details
                      </button>
                      {user?.role === 'receiver' && listing.status === 'available' && (
                        <button
                          onClick={() => handleClaimListing(listing._id)}
                          className="btn btn-primary btn-sm flex-1"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Checkpoints */}
            {checkpoints.map((checkpoint) => (
              <Marker
                key={checkpoint._id}
                position={[checkpoint.location.coordinates[1], checkpoint.location.coordinates[0]]}
                icon={getCheckpointIcon(checkpoint.type)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-gray-900 mb-1">{checkpoint.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{checkpoint.type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-sm text-gray-700">{checkpoint.location.address}</p>
                    {checkpoint.contactPerson && (
                      <p className="text-xs text-gray-600 mt-2">
                        Contact: {checkpoint.contactPerson.phone}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              <span>Food Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <span>Selected Listing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <span>Community Fridges</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              <span>Animal Farms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              <span>Biocompost Centers</span>
            </div>
          </div>
        </div>

        {/* Sorted Listings View */}
        <div className="bg-white rounded-lg shadow-sm p-4 mt-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              Available Listings (Sorted by Distance)
            </h3>
            {currentLocation && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Navigation size={14} />
                From your current location
              </span>
            )}
          </div>

          {sortedListings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No listings found</p>
              <p className="text-sm mt-2">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedListings.filter(l => l.status === 'available').map((listing, index) => (
                <div 
                  key={listing._id} 
                  className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
                    selectedListing === listing._id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleListingCardClick(listing)}
                >
                  {/* Click to view on map indicator */}
                  {selectedListing === listing._id && (
                    <div className="mb-2 flex items-center gap-2 text-blue-600 text-xs font-semibold">
                      <MapPin size={14} />
                      <span>Showing on map above ↑</span>
                    </div>
                  )}
                  {selectedListing !== listing._id && (
                    <div className="mb-2 flex items-center gap-2 text-gray-400 text-xs hover:text-blue-600 transition">
                      <MapPin size={14} />
                      <span>Click to view on map</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Listing Image */}
                    <div className="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Package size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Listing Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                              #{index + 1}
                            </span>
                            <h4 className="font-bold text-gray-900 text-lg">{listing.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                            <MapPin size={18} />
                            <span>{listing.distanceText}</span>
                          </div>
                          <span className="text-xs text-gray-500">away</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Package size={16} className="text-gray-400" />
                          <span>{listing.quantity.value} {listing.quantity.unit}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Filter size={16} className="text-gray-400" />
                          <span className="capitalize">{listing.foodType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-gray-400" />
                          <span>{new Date(listing.pickupTimes?.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="truncate">{listing.location?.address?.substring(0, 20)}...</span>
                        </div>
                      </div>

                      {/* Donor Info */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {listing.donor?.name?.charAt(0) || 'D'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-700">
                          Donated by <span className="font-semibold">{listing.donor?.name || 'Anonymous'}</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/listing/${listing._id}`);
                          }}
                          className="btn btn-outline flex-1 text-sm"
                        >
                          View Details
                        </button>
                        {user?.role === 'receiver' && listing.status === 'available' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimListing(listing._id);
                            }}
                            className="btn btn-primary flex-1 text-sm"
                          >
                            Claim Food
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
