import { useState } from 'react';
import { Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WalletConnectProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export const WalletConnect = ({ isConnected, onConnectionChange }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      onConnectionChange(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    onConnectionChange(false);
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 text-success border border-success/20 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">0x742d...35A3</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-muted-foreground hover:text-foreground"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="wallet-button">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Connect your wallet to access the confidential land registry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={handleConnect}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                MetaMask
              </CardTitle>
              <CardDescription>
                Connect using MetaMask wallet
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={handleConnect}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                WalletConnect
              </CardTitle>
              <CardDescription>
                Connect using WalletConnect protocol
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="text-center text-xs text-muted-foreground mt-4">
            By connecting, you agree to our terms of service and privacy policy.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};