import { useState } from 'react';
import { Search, MapPin, Lock, Eye, Calendar, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyRegistration } from './PropertyRegistration';
import { usePropertyContract } from '@/hooks/useContract';

interface Property {
  id: string;
  address: string;
  owner: string;
  encrypted: boolean;
  verified: boolean;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
}

const mockProperties: Property[] = [
  {
    id: "PROP-001",
    address: "123 Maple Street, Downtown District",
    owner: "0x742d...35A3",
    encrypted: true,
    verified: true,
    lastUpdated: "2024-01-15",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: "PROP-002", 
    address: "456 Oak Avenue, Residential Zone",
    owner: "0x8B3E...F2D1",
    encrypted: true,
    verified: false,
    lastUpdated: "2024-01-10",
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: "PROP-003",
    address: "789 Pine Road, Commercial District",
    owner: "0x1A2B...C4D5",
    encrypted: true,
    verified: true,
    lastUpdated: "2024-01-20",
    coordinates: { lat: 40.7505, lng: -73.9934 }
  }
];

export const PropertySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isConnected } = usePropertyContract();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const results = mockProperties.filter(property =>
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const getStatusBadge = (property: Property) => {
    if (property.verified && property.encrypted) {
      return <Badge className="status-verified">Verified & Encrypted</Badge>;
    } else if (property.encrypted) {
      return <Badge className="status-encrypted">Encrypted</Badge>;
    } else {
      return <Badge className="status-pending">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 slide-up">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Properties</TabsTrigger>
          <TabsTrigger value="register">Register Property</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6">
          {/* Search Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Property Registry Search</h2>
            <p className="text-muted-foreground">
              Search encrypted property records with verified ownership
            </p>
          </div>

      {/* Search Input */}
      <div className="flex space-x-2 max-w-2xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by property address or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || !searchTerm.trim()}
          className="bg-primary hover:bg-primary-hover"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Search Results ({searchResults.length})
          </h3>
          <div className="grid gap-4">
            {searchResults.map((property) => (
              <Card key={property.id} className="property-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{property.address}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Property ID: {property.id}</span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(property)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-sm font-medium">Owner</p>
                        <p className="text-sm text-muted-foreground">
                          {property.encrypted ? property.owner : 'Encrypted'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">{property.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

          {/* No Results */}
          {searchResults.length === 0 && searchTerm && !isSearching && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No properties found for "{searchTerm}". Try a different search term.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="register">
          <PropertyRegistration />
        </TabsContent>
      </Tabs>
    </div>
  );
};