import { useState } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MapProperty {
  id: string;
  address: string;
  coordinates: { x: number; y: number };
  status: 'verified' | 'pending' | 'encrypted';
  owner: string;
}

const mapProperties: MapProperty[] = [
  { id: "PROP-001", address: "123 Maple Street", coordinates: { x: 25, y: 35 }, status: 'verified', owner: "0x742d...35A3" },
  { id: "PROP-002", address: "456 Oak Avenue", coordinates: { x: 60, y: 20 }, status: 'encrypted', owner: "0x8B3E...F2D1" },
  { id: "PROP-003", address: "789 Pine Road", coordinates: { x: 40, y: 60 }, status: 'verified', owner: "0x1A2B...C4D5" },
  { id: "PROP-004", address: "321 Cedar Lane", coordinates: { x: 75, y: 45 }, status: 'pending', owner: "0x9F8E...A1B2" },
  { id: "PROP-005", address: "654 Birch Drive", coordinates: { x: 30, y: 70 }, status: 'encrypted', owner: "0x5C6D...E7F8" },
];

export const InteractiveMap = () => {
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getPropertyColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-success';
      case 'encrypted': return 'text-accent';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return <Badge className="status-verified">Verified</Badge>;
      case 'encrypted': return <Badge className="status-encrypted">Encrypted</Badge>;
      case 'pending': return <Badge className="status-pending">Pending</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 slide-up">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Property Location Map</h2>
          <p className="text-muted-foreground">Interactive view of registered properties</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div className="map-container h-96">
            <div 
              className="relative w-full h-full bg-gradient-to-br from-secondary/20 to-muted/30 circuit-pattern"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            >
              {/* Map Grid */}
              <div className="absolute inset-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full border-t border-border/20" style={{ top: `${i * 10}%` }} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full border-l border-border/20" style={{ left: `${i * 10}%` }} />
                ))}
              </div>

              {/* Property Markers */}
              {mapProperties.map((property) => (
                <button
                  key={property.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${getPropertyColor(property.status)}`}
                  style={{ 
                    left: `${property.coordinates.x}%`, 
                    top: `${property.coordinates.y}%` 
                  }}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative">
                    <Home className="w-6 h-6 drop-shadow-lg" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background">
                      <div className={`w-full h-full rounded-full ${
                        property.status === 'verified' ? 'bg-success' :
                        property.status === 'encrypted' ? 'bg-accent' : 'bg-warning'
                      }`} />
                    </div>
                  </div>
                </button>
              ))}

              {/* Map Overlay */}
              <div className="map-overlay" />
            </div>
          </div>
        </div>

        {/* Property Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
              <CardDescription>
                Click on a property marker to view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProperty ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{selectedProperty.address}</h3>
                    {getStatusBadge(selectedProperty.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property ID:</span>
                      <span className="font-mono">{selectedProperty.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-mono">{selectedProperty.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="capitalize">{selectedProperty.status}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    View Full Details
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Select a property on the map</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm">Verified Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm">Encrypted Records</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-sm">Pending Verification</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};