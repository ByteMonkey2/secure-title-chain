import { useState } from 'react';
import { usePropertyContract } from '@/hooks/useContract';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyFormData {
  address: string;
  description: string;
  value: number;
  area: number;
  yearBuilt: number;
}

export const PropertyRegistration = () => {
  const { registerProperty, isLoading, isConnected, error } = usePropertyContract();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyFormData>({
    address: '',
    description: '',
    value: 0,
    area: 0,
    yearBuilt: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to register a property.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await registerProperty(
        formData.address,
        formData.description,
        formData.value,
        formData.area,
        formData.yearBuilt
      );

      toast({
        title: "Property Registered Successfully",
        description: "Your property has been encrypted and registered on the blockchain.",
      });

      // Reset form
      setFormData({
        address: '',
        description: '',
        value: 0,
        area: 0,
        yearBuilt: 0
      });
    } catch (err) {
      toast({
        title: "Registration Failed",
        description: "Failed to register property. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Property Registration
        </CardTitle>
        <CardDescription>
          Register your property with FHE encryption for complete privacy
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to register a property.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter property address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter property description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value (ETH)</Label>
              <Input
                id="value"
                type="number"
                placeholder="0.00"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                placeholder="0"
                value={formData.area}
                onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                placeholder="2024"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error.message || 'An error occurred during registration'}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isConnected || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Encrypting and Registering...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Register Property with FHE Encryption
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Privacy Notice</h4>
          <p className="text-sm text-muted-foreground">
            Your property data will be encrypted using Fully Homomorphic Encryption (FHE) 
            before being stored on the blockchain. Only you and authorized parties can 
            decrypt and view the sensitive information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
