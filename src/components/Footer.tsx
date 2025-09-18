import { Building, Lock, FileCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="legal-footer mt-16 px-6 py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Privacy & Security */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-accent" />
              <h3 className="font-medium">Property Registry</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All property records are encrypted using Fully Homomorphic Encryption (FHE), 
              ensuring complete privacy while maintaining verifiability.
            </p>
          </div>

          {/* Compliance */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-success" />
              <h3 className="font-medium">Regulatory Compliance</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              This registry complies with government land recording standards 
              and blockchain transparency requirements.
            </p>
          </div>

          {/* Technology */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Blockchain Security</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Immutable records stored on distributed ledger with cryptographic proof 
              of ownership and transfer history.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-border pt-6 space-y-4">
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>Legal Disclaimer:</strong> This confidential land registry system is a demonstration 
              of blockchain-based property record management. All property data displayed is simulated for 
              demonstration purposes only and does not represent actual property ownership or legal records.
            </p>
            <p>
              <strong>Privacy Notice:</strong> This application uses Fully Homomorphic Encryption (FHE) 
              to ensure that property ownership data remains confidential while enabling verification by 
              authorized parties. No personal information is stored in plain text on the blockchain.
            </p>
            <p>
              <strong>Technology Disclaimer:</strong> The FHE implementation shown is for demonstration 
              purposes. In a production environment, additional security measures, legal frameworks, 
              and government oversight would be required for actual property registry operations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>© 2024 Confidential Land Registry</span>
              <span>•</span>
              <span>Powered by FHE Technology</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};