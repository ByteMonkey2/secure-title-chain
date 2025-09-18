import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';

export const WalletConnect = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="encryption-badge">
        <Shield className="w-3 h-3 mr-1" />
        FHE Secured
      </div>
      <ConnectButton 
        chainStatus="icon"
        showBalance={false}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </div>
  );
};