require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Checkpoint = require('../models/Checkpoint');
const Reward = require('../models/Reward');

// Demo coordinates (various locations in India)
const locations = {
  delhi: [77.2090, 28.6139],
  mumbai: [72.8777, 19.0760],
  bangalore: [77.5946, 12.9716],
  chennai: [80.2707, 13.0827],
  kolkata: [88.3639, 22.5726],
  hyderabad: [78.4867, 17.3850],
  pune: [73.8567, 18.5204],
  jaipur: [75.7873, 26.9124],
  lucknow: [80.9462, 26.8467],
  ahmedabad: [72.5714, 23.0225],
  surat: [72.8311, 21.1702],
  nagpur: [79.0882, 21.1458],
  indore: [75.8577, 22.7196],
  bhopal: [77.4126, 23.2599],
  patna: [85.1376, 25.5941],
  chandigarh: [76.7794, 30.7333],
  kochi: [76.2673, 9.9312],
  coimbatore: [76.9558, 11.0168],
  visakhapatnam: [83.2185, 17.6868],
  guwahati: [91.7362, 26.1445],
  bhubaneswar: [85.8245, 20.2961],
  thiruvananthapuram: [76.9366, 8.5241],
  mysore: [76.6394, 12.2958],
  vadodara: [73.1812, 22.3072],
  rajkot: [70.8022, 22.3039],
  nashik: [73.7898, 19.9975],
  amritsar: [74.8723, 31.6340],
  varanasi: [82.9739, 25.3176],
  madurai: [78.1198, 9.9252],
  jodhpur: [73.0243, 26.2389]
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Checkpoint.deleteMany({});
    await Reward.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@samarthasetu.org',
      password: 'Admin@123',
      role: 'admin',
      subtype: 'none',
      location: {
        type: 'Point',
        coordinates: locations.delhi
      },
      isVerified: true
    });
    console.log('👤 Admin created');

    // Create Donors
    const donors = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'Donor@123',
        role: 'donor',
        subtype: 'individual',
        phone: '+91-9876543210',
        address: 'Connaught Place, New Delhi',
        location: {
          type: 'Point',
          coordinates: locations.delhi
        },
        points: 150,
        totalDonations: 15,
        totalKgShared: 45,
        isVerified: true
      },
      {
        name: 'Annapurna Foundation',
        email: 'annapurna@example.com',
        password: 'Donor@123',
        role: 'donor',
        subtype: 'organization',
        organizationName: 'Annapurna Foundation',
        phone: '+91-9876543211',
        address: 'Bandra West, Mumbai',
        location: {
          type: 'Point',
          coordinates: locations.mumbai
        },
        points: 500,
        totalDonations: 50,
        totalKgShared: 200,
        isVerified: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'Donor@123',
        role: 'donor',
        subtype: 'individual',
        phone: '+91-9876543212',
        address: 'Koramangala, Bangalore',
        location: {
          type: 'Point',
          coordinates: locations.bangalore
        },
        points: 80,
        totalDonations: 8,
        totalKgShared: 24,
        isVerified: true
      },
      {
        name: 'Golden Temple Langar',
        email: 'langar@example.com',
        password: 'Donor@123',
        role: 'donor',
        subtype: 'organization',
        organizationName: 'Golden Temple Langar',
        phone: '+91-9876543213',
        address: 'Amritsar, Punjab',
        location: {
          type: 'Point',
          coordinates: [74.8765, 31.6200]
        },
        points: 1000,
        totalDonations: 100,
        totalKgShared: 500,
        isVerified: true
      }
    ]);
    console.log('👥 Donors created');

    // Create Receivers
    const receivers = await User.create([
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: 'Receiver@123',
        role: 'receiver',
        subtype: 'individual',
        phone: '+91-9876543220',
        address: 'Satellite, Ahmedabad',
        location: {
          type: 'Point',
          coordinates: [72.5714, 23.0225]
        },
        totalReceived: 5,
        isVerified: true
      },
      {
        name: 'Hope Charity',
        email: 'hope@example.com',
        password: 'Receiver@123',
        role: 'receiver',
        subtype: 'charity',
        organizationName: 'Hope Charity',
        phone: '+91-9876543221',
        address: 'T Nagar, Chennai',
        location: {
          type: 'Point',
          coordinates: locations.chennai
        },
        totalReceived: 20,
        isVerified: true
      },
      {
        name: 'Green Earth Compost',
        email: 'greenearth@example.com',
        password: 'Receiver@123',
        role: 'receiver',
        subtype: 'biocompost_collector',
        organizationName: 'Green Earth Compost',
        phone: '+91-9876543222',
        address: 'Whitefield, Bangalore',
        location: {
          type: 'Point',
          coordinates: [77.7499, 12.9698]
        },
        totalReceived: 30,
        isVerified: true
      },
      {
        name: 'Animal Shelter Kolkata',
        email: 'shelter@example.com',
        password: 'Receiver@123',
        role: 'receiver',
        subtype: 'animal_farm',
        organizationName: 'Animal Shelter Kolkata',
        phone: '+91-9876543223',
        address: 'Salt Lake, Kolkata',
        location: {
          type: 'Point',
          coordinates: locations.kolkata
        },
        totalReceived: 15,
        isVerified: true
      }
    ]);
    console.log('👥 Receivers created');

    // Create Checkpoints
    const checkpoints = await Checkpoint.create([
      {
        name: 'Community Fridge - Delhi Central',
        type: 'fridge',
        location: {
          type: 'Point',
          coordinates: locations.delhi,
          address: 'Rajiv Chowk Metro Station, New Delhi'
        },
        contactPerson: {
          name: 'Suresh Gupta',
          phone: '+91-9876543230',
          email: 'suresh@fridge.com'
        },
        operatingHours: {
          open: '06:00',
          close: '22:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        capacity: {
          current: 20,
          maximum: 100
        },
        acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'],
        description: '24/7 community fridge for surplus food distribution',
        isActive: true,
        addedBy: admin._id,
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        name: 'Gau Seva Animal Farm',
        type: 'animal_farm',
        location: {
          type: 'Point',
          coordinates: locations.pune,
          address: 'Kharadi, Pune'
        },
        contactPerson: {
          name: 'Ramesh Yadav',
          phone: '+91-9876543231',
          email: 'ramesh@gauseva.com'
        },
        operatingHours: {
          open: '07:00',
          close: '19:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        capacity: {
          current: 50,
          maximum: 200
        },
        acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'],
        description: 'Animal shelter accepting vegetable waste and surplus food',
        isActive: true,
        addedBy: admin._id,
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        name: 'EcoWaste Biocompost Center',
        type: 'biocompost',
        location: {
          type: 'Point',
          coordinates: locations.hyderabad,
          address: 'Gachibowli, Hyderabad'
        },
        contactPerson: {
          name: 'Lakshmi Reddy',
          phone: '+91-9876543232',
          email: 'lakshmi@ecowaste.com'
        },
        operatingHours: {
          open: '08:00',
          close: '18:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        },
        capacity: {
          current: 100,
          maximum: 500
        },
        acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'],
        description: 'Industrial composting facility for organic waste',
        isActive: true,
        addedBy: admin._id,
        isVerified: true,
        verifiedBy: admin._id,
        verifiedAt: new Date()
      }
,
      // 10 NEW FRIDGES
      { name: 'Community Fridge - Mumbai Andheri', type: 'fridge', location: { type: 'Point', coordinates: [72.8479, 19.1136], address: 'Andheri East Metro, Mumbai' }, contactPerson: { name: 'Priya Mehta', phone: '+91-9876543240', email: 'priya@fridgemumbai.com' }, operatingHours: { open: '06:00', close: '23:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 15, maximum: 80 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Metro station community fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Bangalore HSR', type: 'fridge', location: { type: 'Point', coordinates: [77.6387, 12.9116], address: 'HSR Layout, Bangalore' }, contactPerson: { name: 'Karthik Rao', phone: '+91-9876543241', email: 'karthik@fridgeblr.com' }, operatingHours: { open: '05:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 25, maximum: 120 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Tech hub community fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Chennai T Nagar', type: 'fridge', location: { type: 'Point', coordinates: [80.2337, 13.0418], address: 'Pondy Bazaar, Chennai' }, contactPerson: { name: 'Venkat Subramanian', phone: '+91-9876543242', email: 'venkat@fridgechennai.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 18, maximum: 90 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Shopping district fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Kolkata Park Street', type: 'fridge', location: { type: 'Point', coordinates: [88.3515, 22.5540], address: 'Park Street Metro, Kolkata' }, contactPerson: { name: 'Ananya Chatterjee', phone: '+91-9876543243', email: 'ananya@fridgekolkata.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 22, maximum: 100 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Central Kolkata fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Jaipur', type: 'fridge', location: { type: 'Point', coordinates: locations.jaipur, address: 'MI Road, Jaipur' }, contactPerson: { name: 'Rajesh Sharma', phone: '+91-9876543244', email: 'rajesh@fridgejaipur.com' }, operatingHours: { open: '06:00', close: '21:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 12, maximum: 70 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Heritage city fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Ahmedabad', type: 'fridge', location: { type: 'Point', coordinates: locations.ahmedabad, address: 'Satellite, Ahmedabad' }, contactPerson: { name: 'Meera Patel', phone: '+91-9876543245', email: 'meera@fridgeahmedabad.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 20, maximum: 95 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'West Ahmedabad fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Lucknow', type: 'fridge', location: { type: 'Point', coordinates: locations.lucknow, address: 'Hazratganj, Lucknow' }, contactPerson: { name: 'Amir Khan', phone: '+91-9876543246', email: 'amir@fridgelucknow.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 16, maximum: 85 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Central Lucknow fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Chandigarh', type: 'fridge', location: { type: 'Point', coordinates: locations.chandigarh, address: 'Sector 17, Chandigarh' }, contactPerson: { name: 'Simran Kaur', phone: '+91-9876543247', email: 'simran@fridgechandigarh.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 14, maximum: 75 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'City center fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Kochi', type: 'fridge', location: { type: 'Point', coordinates: locations.kochi, address: 'Marine Drive, Kochi' }, contactPerson: { name: 'Thomas George', phone: '+91-9876543248', email: 'thomas@fridgekochi.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 18, maximum: 90 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Waterfront fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Community Fridge - Indore', type: 'fridge', location: { type: 'Point', coordinates: locations.indore, address: 'Vijay Nagar, Indore' }, contactPerson: { name: 'Neha Jain', phone: '+91-9876543249', email: 'neha@fridgeindore.com' }, operatingHours: { open: '06:00', close: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 17, maximum: 88 }, acceptedFoodTypes: ['cooked', 'packaged', 'fruits', 'vegetables'], description: 'Commercial hub fridge', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      // 10 NEW BIOGAS STATIONS
      { name: 'GreenPower Biogas - Mumbai', type: 'biocompost', location: { type: 'Point', coordinates: [72.8311, 19.0896], address: 'Goregaon, Mumbai' }, contactPerson: { name: 'Arvind Desai', phone: '+91-9876543250', email: 'arvind@greenpower.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 80, maximum: 400 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Biogas generation facility', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'EcoCompost - Bangalore', type: 'biocompost', location: { type: 'Point', coordinates: [77.7172, 12.9698], address: 'Electronic City, Bangalore' }, contactPerson: { name: 'Deepa Murthy', phone: '+91-9876543251', email: 'deepa@ecocompost.com' }, operatingHours: { open: '08:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 120, maximum: 600 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Tech park composting', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'BioWaste Solutions - Chennai', type: 'biocompost', location: { type: 'Point', coordinates: [80.2005, 13.0569], address: 'Perungudi, Chennai' }, contactPerson: { name: 'Kumar Swamy', phone: '+91-9876543252', email: 'kumar@biowaste.com' }, operatingHours: { open: '07:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 90, maximum: 450 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Municipal composting', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'GreenCycle Biogas - Pune', type: 'biocompost', location: { type: 'Point', coordinates: [73.9395, 18.5642], address: 'Hinjewadi, Pune' }, contactPerson: { name: 'Sanjay Patil', phone: '+91-9876543253', email: 'sanjay@greencycle.com' }, operatingHours: { open: '08:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 75, maximum: 380 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'IT park biogas', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'OrganicWaste Hub - Surat', type: 'biocompost', location: { type: 'Point', coordinates: locations.surat, address: 'Udhna, Surat' }, contactPerson: { name: 'Bhavesh Shah', phone: '+91-9876543254', email: 'bhavesh@organicwaste.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 110, maximum: 550 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Industrial composting', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'NatureCycle - Nagpur', type: 'biocompost', location: { type: 'Point', coordinates: locations.nagpur, address: 'MIDC Hingna, Nagpur' }, contactPerson: { name: 'Rajiv Deshmukh', phone: '+91-9876543255', email: 'rajiv@naturecycle.com' }, operatingHours: { open: '08:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 85, maximum: 420 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Central India composting', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'BioPower - Bhopal', type: 'biocompost', location: { type: 'Point', coordinates: locations.bhopal, address: 'Industrial Area, Bhopal' }, contactPerson: { name: 'Madhuri Tiwari', phone: '+91-9876543256', email: 'madhuri@biopower.com' }, operatingHours: { open: '07:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 95, maximum: 475 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'State capital biogas', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'EarthCare - Coimbatore', type: 'biocompost', location: { type: 'Point', coordinates: locations.coimbatore, address: 'Singanallur, Coimbatore' }, contactPerson: { name: 'Selvam Raju', phone: '+91-9876543257', email: 'selvam@earthcare.com' }, operatingHours: { open: '08:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 70, maximum: 350 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Textile city waste', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'GreenEnergy - Visakhapatnam', type: 'biocompost', location: { type: 'Point', coordinates: locations.visakhapatnam, address: 'Duvvada, Visakhapatnam' }, contactPerson: { name: 'Prasad Rao', phone: '+91-9876543258', email: 'prasad@greenenergy.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 100, maximum: 500 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Port city biogas', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Organic Solutions - Bhubaneswar', type: 'biocompost', location: { type: 'Point', coordinates: locations.bhubaneswar, address: 'Patia, Bhubaneswar' }, contactPerson: { name: 'Subhash Panda', phone: '+91-9876543259', email: 'subhash@organicsolutions.com' }, operatingHours: { open: '08:00', close: '18:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, capacity: { current: 65, maximum: 325 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Smart city composting', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      // 10 NEW ANIMAL FARMS
      { name: 'Sacred Cow Sanctuary - Mathura', type: 'animal_farm', location: { type: 'Point', coordinates: [77.6737, 27.4924], address: 'Vrindavan Road, Mathura' }, contactPerson: { name: 'Gopal Das', phone: '+91-9876543260', email: 'gopal@cowsanctuary.com' }, operatingHours: { open: '06:00', close: '20:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 80, maximum: 300 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Large gau shala', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Animal Welfare - Jaipur', type: 'animal_farm', location: { type: 'Point', coordinates: locations.jaipur, address: 'Jhotwara, Jaipur' }, contactPerson: { name: 'Kavita Rathore', phone: '+91-9876543261', email: 'kavita@animalwelfare.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 60, maximum: 250 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Multi-animal shelter', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Gau Seva Kendra - Ahmedabad', type: 'animal_farm', location: { type: 'Point', coordinates: locations.ahmedabad, address: 'Thaltej, Ahmedabad' }, contactPerson: { name: 'Mahesh Patel', phone: '+91-9876543262', email: 'mahesh@gauseva.com' }, operatingHours: { open: '06:00', close: '20:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 70, maximum: 280 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Traditional cow shelter', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Animal Rescue - Bangalore', type: 'animal_farm', location: { type: 'Point', coordinates: locations.bangalore, address: 'Sarjapur Road, Bangalore' }, contactPerson: { name: 'Anjali Nair', phone: '+91-9876543263', email: 'anjali@animalrescue.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 55, maximum: 220 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Urban animal rescue', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Prani Mitra - Mysore', type: 'animal_farm', location: { type: 'Point', coordinates: locations.mysore, address: 'Hunsur Road, Mysore' }, contactPerson: { name: 'Ravi Kumar', phone: '+91-9876543264', email: 'ravi@pranimitra.com' }, operatingHours: { open: '06:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 65, maximum: 260 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Animal sanctuary', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Goshala Trust - Varanasi', type: 'animal_farm', location: { type: 'Point', coordinates: locations.varanasi, address: 'Ramnagar, Varanasi' }, contactPerson: { name: 'Pandit Sharma', phone: '+91-9876543265', email: 'pandit@goshala.com' }, operatingHours: { open: '05:00', close: '20:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 90, maximum: 350 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Ancient city goshala', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Animal Care - Patna', type: 'animal_farm', location: { type: 'Point', coordinates: locations.patna, address: 'Danapur, Patna' }, contactPerson: { name: 'Rajesh Singh', phone: '+91-9876543266', email: 'rajesh@animalcare.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 50, maximum: 200 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Community animal shelter', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Pashu Palak - Jodhpur', type: 'animal_farm', location: { type: 'Point', coordinates: locations.jodhpur, address: 'Mandore, Jodhpur' }, contactPerson: { name: 'Vikram Singh', phone: '+91-9876543267', email: 'vikram@pashupalak.com' }, operatingHours: { open: '06:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 45, maximum: 180 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Desert animal care', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Wildlife Care - Guwahati', type: 'animal_farm', location: { type: 'Point', coordinates: locations.guwahati, address: 'Khanapara, Guwahati' }, contactPerson: { name: 'Bhaskar Bora', phone: '+91-9876543268', email: 'bhaskar@wildlifecare.com' }, operatingHours: { open: '07:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 40, maximum: 160 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Northeast animal shelter', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() },
      { name: 'Pashudhan Kendra - Thiruvananthapuram', type: 'animal_farm', location: { type: 'Point', coordinates: locations.thiruvananthapuram, address: 'Kazhakootam, Thiruvananthapuram' }, contactPerson: { name: 'Suresh Nair', phone: '+91-9876543269', email: 'suresh@pashudhan.com' }, operatingHours: { open: '06:00', close: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }, capacity: { current: 55, maximum: 220 }, acceptedFoodTypes: ['raw', 'vegetables', 'fruits', 'mixed'], description: 'Capital city animal farm', isActive: true, addedBy: admin._id, isVerified: true, verifiedBy: admin._id, verifiedAt: new Date() }
    ]);
    console.log('📍 Checkpoints created');

    // Create Active Listings
    const now = new Date();
    const listings = await Listing.create([
      {
        donor: donors[0]._id,
        title: 'Fresh Vegetable Curry - 10 servings',
        description: 'Freshly cooked vegetable curry with rice. Made 2 hours ago, still hot and fresh. Perfect for immediate consumption.',
        foodType: 'cooked',
        quantity: {
          value: 10,
          unit: 'servings'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
            publicId: 'vegetable-curry-1'
          }
        ],
        location: {
          type: 'Point',
          coordinates: locations.mumbai,
          address: 'Andheri East, Mumbai'
        },
        pickupTimes: {
          start: now,
          end: new Date(now.getTime() + 3 * 60 * 60 * 1000) // 3 hours from now
        },
        status: 'available',
        expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
        preferredReceiverTypes: ['individual', 'charity']
      },
      {
        donor: donors[1]._id,
        title: 'Bulk Packaged Food - 50kg',
        description: 'Sealed packaged food items including rice, dal, and snacks. Perfect for charities.',
        foodType: 'packaged',
        quantity: {
          value: 50,
          unit: 'kg'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
            publicId: 'packaged-food-1'
          }
        ],
        location: {
          type: 'Point',
          coordinates: locations.mumbai,
          address: 'Bandra West, Mumbai'
        },
        pickupTimes: {
          start: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
          end: new Date(now.getTime() + 6 * 60 * 60 * 1000) // 6 hours from now
        },
        status: 'available',
        expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 hours
        isBulk: true,
        bulkDetails: {
          totalQuantity: 50,
          itemsPerPerson: 5,
          maxReceivers: 10
        },
        preferredReceiverTypes: ['charity', 'individual']
      },
      {
        donor: donors[2]._id,
        title: 'Fresh Fruits - Mixed',
        description: 'Apples, bananas, and oranges. Slightly overripe but perfectly edible.',
        foodType: 'fruits',
        quantity: {
          value: 5,
          unit: 'kg'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80',
            publicId: 'fresh-fruits-1'
          }
        ],
        location: {
          type: 'Point',
          coordinates: locations.bangalore,
          address: 'Koramangala, Bangalore'
        },
        pickupTimes: {
          start: now,
          end: new Date(now.getTime() + 4 * 60 * 60 * 1000)
        },
        status: 'available',
        expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000),
        fallbackPreference: 'animal_farm'
      },
      {
        donor: donors[3]._id,
        title: 'Langar Prasad - 100 servings',
        description: 'Fresh langar prasad including dal, sabzi, roti, and kheer.',
        foodType: 'cooked',
        quantity: {
          value: 100,
          unit: 'servings'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80',
            publicId: 'langar-prasad-1'
          }
        ],
        location: {
          type: 'Point',
          coordinates: [74.8765, 31.6200],
          address: 'Golden Temple, Amritsar'
        },
        pickupTimes: {
          start: now,
          end: new Date(now.getTime() + 2 * 60 * 60 * 1000)
        },
        status: 'available',
        expiresAt: new Date(now.getTime() + 90 * 60 * 1000), // 90 mins
        isBulk: true,
        preferredReceiverTypes: ['charity', 'individual']
      }
    ]);
    console.log('📦 Listings created');

    // Create Rewards
    const rewards = await Reward.create([
      {
        name: 'Certificate of Appreciation',
        description: 'Official certificate recognizing your contribution to fighting hunger',
        pointsRequired: 50,
        category: 'certificate',
        quantity: {
          available: 100,
          total: 100
        },
        isActive: true,
        minDonations: 5,
        minRating: 4,
        createdBy: admin._id
      },
      {
        name: 'Samartha Setu T-Shirt',
        description: 'Exclusive Samartha Setu branded t-shirt',
        pointsRequired: 100,
        category: 'gift',
        quantity: {
          available: 50,
          total: 50
        },
        isActive: true,
        minDonations: 10,
        minRating: 4,
        createdBy: admin._id
      },
      {
        name: 'Food Hero Badge',
        description: 'Digital badge for your profile showcasing your impact',
        pointsRequired: 150,
        category: 'badge',
        quantity: {
          available: 200,
          total: 200
        },
        isActive: true,
        minDonations: 15,
        minRating: 4.5,
        createdBy: admin._id
      },
      {
        name: 'Restaurant Voucher - ₹500',
        description: '₹500 voucher for partner restaurants',
        pointsRequired: 250,
        category: 'voucher',
        quantity: {
          available: 20,
          total: 20
        },
        isActive: true,
        minDonations: 25,
        minRating: 4.5,
        createdBy: admin._id
      }
    ]);
    console.log('🎁 Rewards created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN:');
    console.log('  Email: admin@samarthasetu.org');
    console.log('  Password: Admin@123');
    console.log('\nDONORS:');
    console.log('  1. Email: rajesh@example.com | Password: Donor@123 (Individual)');
    console.log('  2. Email: annapurna@example.com | Password: Donor@123 (Organization)');
    console.log('  3. Email: priya@example.com | Password: Donor@123 (Individual)');
    console.log('  4. Email: langar@example.com | Password: Donor@123 (Organization)');
    console.log('\nRECEIVERS:');
    console.log('  1. Email: amit@example.com | Password: Receiver@123 (Individual)');
    console.log('  2. Email: hope@example.com | Password: Receiver@123 (Charity)');
    console.log('  3. Email: greenearth@example.com | Password: Receiver@123 (Biocompost)');
    console.log('  4. Email: shelter@example.com | Password: Receiver@123 (Animal Farm)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
