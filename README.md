# Secure Title Chain

A confidential land registry system powered by Fully Homomorphic Encryption (FHE) and blockchain technology. This application enables secure, private property ownership records while maintaining verifiability and selective disclosure capabilities.

## Features

- **FHE Encryption**: Complete privacy with homomorphic encryption for sensitive property data
- **Blockchain Records**: Immutable ownership history stored on-chain
- **Selective Disclosure**: Reveal data only when needed for transfers
- **Verified Access**: Only authorized parties can view sensitive information
- **Interactive Map**: Visual property search and exploration
- **Wallet Integration**: Connect with popular Web3 wallets

## Technology Stack

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Web3**: Wagmi, Viem, RainbowKit
- **Blockchain**: Ethereum (Sepolia testnet)
- **Encryption**: FHE (Fully Homomorphic Encryption)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ByteMonkey2/secure-title-chain.git
cd secure-title-chain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Main header component
│   ├── Footer.tsx      # Footer component
│   ├── WalletConnect.tsx # Wallet connection component
│   ├── PropertySearch.tsx # Property search interface
│   └── InteractiveMap.tsx # Interactive map component
├── pages/              # Page components
│   ├── Index.tsx       # Main landing page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Smart Contracts

The project includes FHE-enabled smart contracts for:
- Property registration with encrypted data
- Secure property transfers
- Reputation management
- Impact reporting

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

This application uses state-of-the-art cryptographic techniques including:
- Fully Homomorphic Encryption (FHE) for data privacy
- Zero-knowledge proofs for verification
- Secure multi-party computation for selective disclosure

## Support

For support and questions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced property analytics
- [ ] Mobile application
- [ ] Integration with traditional land registries
- [ ] Enhanced privacy features