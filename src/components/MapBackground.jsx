import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Phone, MessageCircle, Star, MapPin } from 'lucide-react';

// ── Provider marker icon (dark circle with initial) ──
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
        popupAnchor: [0, -20],
    });
};

// ── Blue dot for user location ──
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

const MIN_MARKER_ZOOM = 12;

// ── Popup card rendered inside each marker ──
const PopupCard = ({ service }) => {
    const initial = (service.name?.[0] || '?').toUpperCase();
    const phone = service.phone || '';
    const hasPhone = phone.trim().length > 0;

    const handleCall = (e) => {
        e.stopPropagation();
        if (hasPhone) window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = (e) => {
        e.stopPropagation();
        if (hasPhone) {
            const digits = phone.replace(/[^0-9]/g, '');
            const number = digits.startsWith('91') ? digits : `91${digits}`;
            const msg = encodeURIComponent(`Hi ${service.name}, I found you on Servly and would like to inquire about your ${service.category} services.`);
            window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
        }
    };

    return (
        <div style={{ width: 220, fontFamily: 'Inter, -apple-system, sans-serif' }}>
            {/* Avatar + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                {service.photoURL ? (
                    <img
                        src={service.photoURL}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                ) : (
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%', background: '#111827',
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 16, flexShrink: 0
                    }}>
                        {initial}
                    </div>
                )}
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {service.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>
                        {service.category}
                    </div>
                </div>
            </div>

            {/* Rating + Distance row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#6b7280', marginBottom: 10 }}>
                {service.rating > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ color: '#EAB308' }}>★</span>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{Number(service.rating).toFixed(1)}</span>
                    </span>
                )}
                {service.distanceText && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        ⊙ {service.distanceText}
                    </span>
                )}
            </div>

            {/* Call + WhatsApp buttons */}
            <div style={{ display: 'flex', gap: 6 }}>
                <button
                    onClick={handleCall}
                    disabled={!hasPhone}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        padding: '7px 0', borderRadius: 10, border: 'none', cursor: hasPhone ? 'pointer' : 'default',
                        background: hasPhone ? '#111827' : '#e5e7eb', color: hasPhone ? '#fff' : '#9ca3af',
                        fontWeight: 600, fontSize: 11, fontFamily: 'inherit',
                    }}
                >
                    📞 Call
                </button>
                <button
                    onClick={handleWhatsApp}
                    disabled={!hasPhone}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                        padding: '7px 0', borderRadius: 10, border: 'none', cursor: hasPhone ? 'pointer' : 'default',
                        background: hasPhone ? '#22c55e' : '#e5e7eb', color: hasPhone ? '#fff' : '#9ca3af',
                        fontWeight: 600, fontSize: 11, fontFamily: 'inherit',
                    }}
                >
                    💬 WhatsApp
                </button>
            </div>
        </div>
    );
};

// ── Helper: create a Leaflet popup whose content is a React PopupCard ──
const createReactPopup = (service) => {
    const container = document.createElement('div');
    const root = createRoot(container);
    root.render(<PopupCard service={service} />);
    return L.popup({
        closeButton: true,
        minWidth: 220,
        maxWidth: 240,
        className: 'servly-popup',
    }).setContent(container);
};

// ── Sub-components ──
function MapUpdater({ userLocation }) {
    const map = useMap();
    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 14);
        }
    }, [userLocation, map]);
    return null;
}

function ZoomTracker({ onZoomChange }) {
    const map = useMapEvents({
        zoomend: () => onZoomChange(map.getZoom()),
    });
    useEffect(() => {
        onZoomChange(map.getZoom());
    }, []);
    return null;
}

// ── Main component ──
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
                />
            )}

            {/* Provider markers */}
            {showMarkers && providers.map(service => {
                const isSelected =
                    selectedService?.uid === service.uid ||
                    selectedService?.id === service.id;
                return (
                    <Marker
                        key={service.id || service.uid}
                        position={[service.latitude, service.longitude]}
                        icon={createProviderIcon(service.name, isSelected)}
                        eventHandlers={{
                            click: () => onMarkerClick(service),
                            mouseover: (e) => {
                                const popup = createReactPopup(service);
                                e.target.bindPopup(popup).openPopup();
                            },
                        }}
                    />
                );
            })}
        </MapContainer>
    );
};

export default MapBackground;
