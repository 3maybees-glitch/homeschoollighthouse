"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { MapMarker } from "@/lib/geo/listing-coordinates";
import "leaflet/dist/leaflet.css";

const lighthouseIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:#e6b422;border:2px solid #001f3f;box-shadow:0 0 0 4px rgba(230,180,34,0.25);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) return;
    const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng]));
    map.fitBounds(bounds.pad(0.2));
  }, [map, markers]);

  return null;
}

export function LocalHarborsMap({
  markers,
  className = "h-[520px] w-full rounded-[1.75rem]",
}: {
  markers: MapMarker[];
  className?: string;
}) {
  if (!markers.length) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-[var(--color-border)] bg-white/80 p-10 text-center ${className}`}
      >
        <div>
          <p className="font-display text-xl font-semibold text-[var(--color-navy-deep)]">
            No harbor pins in view yet
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Try widening your filters or browse all local co-ops and support groups.
          </p>
        </div>
      </div>
    );
  }

  const center = markers[0];

  return (
    <div className={`overflow-hidden border border-[var(--color-border)] shadow-lg shadow-[rgba(0,31,63,0.08)] ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={4}
        scrollWheelZoom
        className="h-full w-full"
        aria-label="Interactive map of local homeschool harbors"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds markers={markers} />
        {markers.map((marker) => (
          <Marker
            key={marker.listing.id}
            position={[marker.lat, marker.lng]}
            icon={lighthouseIcon}
          >
            <Popup>
              <div className="space-y-2">
                <p className="font-semibold text-[var(--color-navy-deep)]">{marker.listing.title}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {marker.listing.city ? `${marker.listing.city}, ` : ""}
                  {marker.listing.state}
                </p>
                <Link
                  href={`/listing/${marker.listing.slug}`}
                  className="text-xs font-semibold text-[var(--color-secondary)] underline-offset-2 hover:underline"
                >
                  View beacon
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
