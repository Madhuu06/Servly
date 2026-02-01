import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for user location
const userLocationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to update map center when user location changes
function MapUpdater({ userLocation }) {
    const map = useMap();

    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 14);
        }
    }, [userLocation, map]);

    return null;
}

const MapBackground = ({ providers = [], onMarkerClick, userLocation }) => {
    const defaultPosition = [12.9716, 77.5946]; // Default Center (Bangalore)
    const mapCenter = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : defaultPosition;

    return (
        <MapContainer
            center={mapCenter}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapUpdater userLocation={userLocation} />

            {/* User Location Marker */}
            {userLocation && (
                <Marker
                    position={[userLocation.latitude, userLocation.longitude]}
                    icon={userLocationIcon}
                >
                    <Popup>Your Location</Popup>
                </Marker>
            )}

            {/* Provider Markers */}
            {providers.map((service) => (
                <Marker
                    key={service.id || service.uid}
                    position={[service.latitude, service.longitude]}
                    eventHandlers={{
                        click: () => onMarkerClick(service),
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <strong>{service.name}</strong><br />
                            {service.category}<br />
                            {service.distanceText && `${service.distanceText} away`}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapBackground;
