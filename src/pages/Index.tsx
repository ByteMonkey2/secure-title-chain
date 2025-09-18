import { Header } from '@/components/Header';
import { PropertySearch } from '@/components/PropertySearch';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Lock, Database, Eye } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-12 fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Own Property With Privacy
            </h1>
            <h2 className="text-2xl md:text-3xl text-muted-foreground">
              Powered by FHE
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure, confidential property ownership records stored on-chain with 
              Fully Homomorphic Encryption. Only verified parties can access details 
              until transfer occurs.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="property-card">
              <CardContent className="p-6 text-center">
                <Building className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Property Registry</h3>
                <p className="text-sm text-muted-foreground">
                  Secure property registration and management
                </p>
              </CardContent>
            </Card>
            
            <Card className="property-card">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 text-success mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Verified Access</h3>
                <p className="text-sm text-muted-foreground">
                  Only authorized parties view sensitive data
                </p>
              </CardContent>
            </Card>
            
            <Card className="property-card">
              <CardContent className="p-6 text-center">
                <Database className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Blockchain Records</h3>
                <p className="text-sm text-muted-foreground">
                  Immutable ownership history on-chain
                </p>
              </CardContent>
            </Card>
            
            <Card className="property-card">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-warning mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Selective Disclosure</h3>
                <p className="text-sm text-muted-foreground">
                  Reveal data only when needed for transfers
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Interface */}
        <section className="space-y-8">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="search">Property Search</TabsTrigger>
              <TabsTrigger value="map">Interactive Map</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-8">
              <PropertySearch />
            </TabsContent>
            
            <TabsContent value="map" className="mt-8">
              <InteractiveMap />
            </TabsContent>
          </Tabs>
        </section>

        {/* Technology Overview */}
        <section className="mt-16 py-12 border-t border-border slide-up">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-semibold">How It Works</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our confidential land registry combines cutting-edge cryptography with 
              blockchain technology to create a new standard for property record management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Property Registration</h3>
              <p className="text-muted-foreground">
                Property details are encrypted using FHE before being stored on the blockchain, 
                ensuring complete confidentiality while maintaining verifiability.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold">Selective Access</h3>
              <p className="text-muted-foreground">
                Only verified parties with proper authorization can decrypt and view 
                sensitive property information, protecting owner privacy.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-success">3</span>
              </div>
              <h3 className="text-xl font-semibold">Secure Transfers</h3>
              <p className="text-muted-foreground">
                During property transfers, relevant information is selectively disclosed 
                to necessary parties while maintaining overall confidentiality.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
