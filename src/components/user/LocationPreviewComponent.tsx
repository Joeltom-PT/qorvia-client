import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPreviewProps {
  latitude: number;
  longitude: number;
  address: string;
}

const LocationPreviewComponent: React.FC<LocationPreviewProps> = ({ latitude, longitude, address }) => {
  const customIcon = new Icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADg0lEQVR4nO1aSWgUQRQtTdxwO0kw01WDIRqMyyWQ6f97YlxRD+pBvHgVgyFB0YteZBBc+v9OhByUKAgSPOWiePEiiihiCF5MxJMouKK4K5pIjNSoSTAaqnq6e0bwQcHQh9fv1f/1urp6hPiPH6hsaJMKqEkid0nk2wropQL+KpEGFfALBdyrgM8qL9ghkSpFqcBxeYMEuqqQhxTysOEYksiXlctriypcIfdYiP7jkEA3EzVSVefPlcDnChU+bgCfrUGaHav4VIYWSqR7kYvHkWrcddyj1bGId1x/mUR+Hpd4NWriaTrjL45UvE4NhfwobvFqtJ2epOp9JxLxdXWnpuQjMCnx+MsE3RKNufLCZx/4UOLicaQSBwsSX+X5SgJ/trzxHQm0R3r+korlwUw99G99TSH1WXJ9ctz2VGgDCvmExeL7IpGbhchN/ivhtu4yBdwikQeMeZE6QonXmSyB35uKTyOtMp4YCFabmpDIb3UVrQ0o5K0Ws7TLmt/zW835eUsIA9Rp2vMTts3E7dRvmEgnQxgw3OdAsFuEhETaa1jhG/YG9BbYxEA2qA1rwIFgqaGBZ9bkemGakM9rzM0Ka6AGabZpSFiT6ww2IS9kB1ld3zHHrE35gzW5RH5QKi2kgO9bkyuka4bl3RP7Iga+Ym8A+KhZjFKfjkTrG2zrLtP7f8MYPWzNn/aCjWYG8iVuseXX8asM+R3w11sbqN7QMU0BvzaLOR5QQGuMxbu8Nn9agUYVflVbm5sqwkACnTadpbwJz2+dsJ3yT99gt7l41gY6RVikskHG/EYj7dSvF6dOGP2M0EP/lsj7jHsex7SP69eLQqCAr1ubiGzQNVEoJNLmYhmQXrCpYAN5E/rwKXkDPUIMT4rEgAPBiqQNpC1ekIyggC4kaOC8iBr6BV8BfUxA/CfVECwQcUACH4jdANB+ERsac+WxLmjgXn2QFp8BvRayx6pMTyssZ/5jZbZtUaziR0wANcVQgZ2JiB9j4mJ04ulSZJlvigWZIxX6KLxQ8RLoqeYSxUAaGWyOCceJRxqUSA2imNAvM+ENcLMoBUjkMyHEd4lSgeO2z7D6CALcm27MTRelBNVwfL5EemiQOI8j+3wUNfQZkQR6M8GifZfK8HJRykh7wco/JVM+cTx/nfgXkHZ5+29/PRjS18S/BInc/LPnv4X5ACJKAXr7rUecN/kOyWlJko7SwpUAAAAASUVORK5CYII=',
    iconSize: [40, 45], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32],
  });

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden">
      <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationPreviewComponent;
