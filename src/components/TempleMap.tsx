import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const MapContainerLazy = lazy(() =>
  import("react-leaflet").then((mod) => ({ default: mod.MapContainer }))
);
const TileLayerLazy = lazy(() =>
  import("react-leaflet").then((mod) => ({ default: mod.TileLayer }))
);
const MarkerLazy = lazy(() =>
  import("react-leaflet").then((mod) => ({ default: mod.Marker }))
);
const PopupLazy = lazy(() =>
  import("react-leaflet").then((mod) => ({ default: mod.Popup }))
);

interface Props {
  lat: number;
  lng: number;
  name: string;
  className?: string;
}

const TempleMap = ({ lat, lng, name, className = "" }: Props) => {
  return (
    <Suspense
      fallback={
        <div className={`flex items-center justify-center bg-muted/50 rounded-2xl ${className}`} style={{ minHeight: 300 }}>
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div className={`rounded-2xl overflow-hidden border border-border ${className}`}>
        <MapContainerLazy
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: 300, width: "100%" }}
        >
          <TileLayerLazy
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerLazy position={[lat, lng]}>
            <PopupLazy>{name}</PopupLazy>
          </MarkerLazy>
        </MapContainerLazy>
      </div>
    </Suspense>
  );
};

export default TempleMap;
