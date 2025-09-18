import { Building, Map, FileKey } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletConnect } from './WalletConnect';
import registryLogo from '@/assets/registry-logo.png';

export const Header = () => {

  return (
    <header className="registry-header px-6 py-4 fade-in">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src={registryLogo} 
              alt="Registry Logo" 
              className="w-10 h-10 government-seal"
            />
            <div>
              <h1 className="text-xl font-semibold text-primary-foreground">
                Confidential Land Registry
              </h1>
              <p className="text-sm text-primary-foreground/80">
                Own Property With Privacy, Powered by FHE
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Map className="w-4 h-4 mr-2" />
            Property Map
          </Button>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            <FileKey className="w-4 h-4 mr-2" />
            Registry Search
          </Button>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
            <Building className="w-4 h-4 mr-2" />
            Registry
          </Button>
        </nav>

        {/* Wallet Connection */}
        <WalletConnect />
      </div>
    </header>
  );
};