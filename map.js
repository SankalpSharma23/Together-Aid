// Initialize the map from Open street map 
const map = L.map('map').setView([22.5937, 78.9629], 4);

// Add tile layer (load map in boxes )
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Layer groups for different service types
const layers = {
    hospitals: L.layerGroup().addTo(map),
    police: L.layerGroup().addTo(map),
    fire: L.layerGroup().addTo(map),
    government: L.layerGroup().addTo(map)
};

// Custom icons for different service types
const icons = {
    hospital: L.divIcon({
        html: '<i class="fas fa-hospital" style="color: #ff4444; font-size: 18px;"></i>',
        className: 'custom-marker',
        iconSize: [20, 20]
    }),
    police: L.divIcon({
        html: '<i class="fas fa-shield-alt" style="color: #4444ff; font-size: 18px;"></i>',
        className: 'custom-marker',
        iconSize: [20, 20]
    }),
    fire: L.divIcon({
        html: '<i class="fas fa-fire-extinguisher" style="color: #ffaa00; font-size: 18px;"></i>',
        className: 'custom-marker',
        iconSize: [20, 20]
    }),
    government: L.divIcon({
        html: '<i class="fas fa-landmark" style="color: #44aa44; font-size: 18px;"></i>',
        className: 'custom-marker',
        iconSize: [20, 20]
    })
};

// Function to query OpenStreetMap for nearby services
function findNearbyServices(lat, lng, radius = 5000) {
    // Clear existing markers
    Object.values(layers).forEach(layer => layer.clearLayers());
    
    // Query for different service types
    const queries = [
        { type: 'hospital', amenity: 'hospital' },
        { type: 'police', amenity: 'police' },
        { type: 'fire', amenity: 'fire_station' },
        { type: 'government', building: 'public' }
    ];
    
    queries.forEach(query => {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node[${Object.keys(query)[1]}=${Object.values(query)[1]}](around:${radius},${lat},${lng}););out;`;
        
        fetch(overpassUrl)
            .then(response => response.json())
            .then(data => {
                data.elements.forEach(element => {
                    if (element.lat && element.lon) {
                        const marker = L.marker([element.lat, element.lon], { 
                            icon: icons[query.type] 
                        }).addTo(layers[query.type]);
                        
                        // Create popup content with Google Maps direction link
                        const name = element.tags.name || `${query.type.charAt(0).toUpperCase() + query.type.slice(1)}`;
                        const popupContent = `
                            <div class="popup-content">
                                <h3>${name}</h3>
                                <p>${element.tags.amenity || element.tags.building || 'Service'}</p>
                                <p><strong>Address:</strong> ${element.tags['addr:street'] || 'Not specified'}</p>
                                <button onclick="openGoogleMapsDirections(${lat}, ${lng}, ${element.lat}, ${element.lon})" 
                                        style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                                    <i class="fas fa-directions"></i> Get Directions
                                </button>
                            </div>
                        `;
                        
                        marker.bindPopup(popupContent);
                    }
                });
            })
            .catch(error => console.error(`Error fetching ${query.type} data:`, error));
    });
}

// Function to open Google Maps with directions
function openGoogleMapsDirections(userLat, userLng, destLat, destLng) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(url, '_blank');
}

// Function to toggle service layers
function toggleLayer(layerName) {
    if (map.hasLayer(layers[layerName])) {
        map.removeLayer(layers[layerName]);
    } else {
        map.addLayer(layers[layerName]);
    }
}

// Layer control to toggle different service types
const layerControl = L.control.layers(null, {
    "Hospitals": layers.hospitals,
    "Police Stations": layers.police,
    "Fire Stations": layers.fire,
    "Government Buildings": layers.government
}).addTo(map);

// Try to get user's location and find nearby services  
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            
            // Add user marker to map
            const userIcon = L.divIcon({
                html: '<i class="fas fa-user" style="color: #667eea; font-size: 20px;"></i>',
                className: 'user-location-marker',
                iconSize: [20, 20]
            });
            const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
            userMarker.bindPopup('Your Current Location').openPopup();
            
            // Find nearby services
            findNearbyServices(latitude, longitude);
            
            // Center map on user location
            map.setView([latitude, longitude], 12);
        },
        (error) => {
            console.log("Location access denied or not available");
            // Fallback to a default location (e.g., New Delhi)
            const defaultLat = 28.6139, defaultLng = 77.2090;
            findNearbyServices(defaultLat, defaultLng);
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
    // Fallback to a default location
    const defaultLat = 28.6139, defaultLng = 77.2090;
    findNearbyServices(defaultLat, defaultLng);
}

// Search functionality
const searchControl = new L.Control.Search({
    position: 'topright',
    layer: L.layerGroup(),
    initial: false,
    zoom: 12,
    marker: false
});
map.addControl(searchControl);