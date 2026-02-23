import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Build a dark circle marker with the provider's initial
const createProviderIcon = (name, isSelected = false) => {
    const initial = (name?.[0] || '?').toUpperCase();
    const bg = isSelected ? '#FF8A00' : '#111827';
    return L.divIcon({
        html: `<div style="
            width:32px;height:32px;
            background:${bg};
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            color:#fff;font-size:12px;font-weight:700;
            font-family:Inter,-apple-system,sans-serif;
            border:2px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            cursor:pointer;
        ">${initial}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
    });
};

// Blue dot for user location
const userLocationIcon = L.divIcon({
    html: `<div style="
        width:16px;height:16px;
        background:#3B82F6;
        border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 3px rgba(59,130,246,0.3);
    "></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// Min zoom to show provider markers (hides when zoomed out further)
const MIN_MARKER_ZOOM = 12;

function MapUpdater({ userLocation }) {
    const map = useMap();
    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 14);
        }
    }, [userLocation, map]);
    return null;
}

// Track zoom level to show/hide markers
function ZoomTracker({ onZoomChange }) {
    const map = useMapEvents({
        zoomend: () => onZoomChange(map.getZoom()),
    });
    useEffect(() => {
        onZoomChange(map.getZoom());
    }, []);
    return null;
}

const MapBackground = ({ providers = [], onMarkerClick, userLocation, selectedService }) => {
    const defaultPosition = [12.9716, 77.5946];
    const mapCenter = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : defaultPosition;

    const [zoom, setZoom] = useState(14);
    const showMarkers = zoom >= MIN_MARKER_ZOOM;

    return (
        <MapContainer
            center={mapCenter}
            zoom={14}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution=""
            />

            <MapUpdater userLocation={userLocation} />
            <ZoomTracker onZoomChange={setZoom} />

            {/* User location */}
            {userLocation && (
                <Marker
                    position={[userLocation.latitude, userLocation.longitude]}
                    icon={userLocationIcon}
                >
                    <Popup>Your location</Popup>
                </Marker>
            )}

            {/* Provider markers — only visible when zoomed in enough */}
            {showMarkers && providers.map(service => {
                const isSelected =
                    selectedService?.uid === service.uid ||
                    selectedService?.id === service.id;
                return (
                    <Marker
                        key={service.id || service.uid}
                        position={[service.latitude, service.longitude]}
                        icon={createProviderIcon(service.name, isSelected)}
                        eventHandlers={{ click: () => onMarkerClick(service) }}
                    >
                        <Popup>
                            <div className="text-sm">
                                <strong>{service.name}</strong><br />
                                {service.category}<br />
                                {service.distanceText && `${service.distanceText} away`}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default MapBackground;
