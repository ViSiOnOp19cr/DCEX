# DCEX - Decentralized Exchange for India 🇮🇳

A modern, user-friendly decentralized exchange built specifically for the Indian market, enabling seamless cryptocurrency transactions with just a Google account.

![DCEX Banner](https://img.shields.io/badge/DCEX-Crypto%20Exchange-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)

## 🚀 Features

### Core Functionality
- **🔐 One-Click Wallet Creation**: Sign in with Google to instantly create a secure Solana wallet
- **💱 Token Swapping**: Swap between SOL, USDC, and USDT using Jupiter Protocol
- **📤 Send & Receive**: Transfer tokens to any Solana wallet address
- **💰 INR Integration**: Add funds using Indian payment methods (UPI, Net Banking, Cards)
- **📊 Portfolio Overview**: Real-time balance tracking with USD valuations
- **📜 Transaction History**: Complete history of all your transactions

### Technical Features
- **🔒 Secure Key Management**: Private keys are encrypted and stored securely
- **⚡ Real-time Price Updates**: Live token prices from Jupiter API
- **📱 Mobile Responsive**: Fully responsive design for all devices
- **🎨 Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **NextAuth.js** - Authentication with Google OAuth

### Blockchain
- **Solana Web3.js** - Blockchain interactions
- **SPL Token** - Token program integration
- **Jupiter Protocol** - Token swapping and pricing

### Backend
- **PostgreSQL** - User and wallet data storage
- **Prisma ORM** - Type-safe database access
- **Next.js API Routes** - Serverless backend functions

### Infrastructure
- **Alchemy** - Solana RPC provider
- **Jupiter APIs** - Token prices and swap quotes

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Alchemy API key (for Solana RPC)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/dcex-frontend.git
cd dcex-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dcex"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"

# Solana RPC (optional - defaults to public endpoint)
SOLANA_RPC_URL="https://solana-mainnet.g.alchemy.com/v2/your-api-key"
```

### 4. Set up the database
```bash
npx prisma migrate dev
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── api/            # API routes
│   │   ├── auth/       # NextAuth configuration
│   │   ├── send/       # Token transfer endpoint
│   │   ├── swap/       # Token swap endpoint
│   │   ├── tokens/     # Balance fetching
│   │   └── transactions/ # Transaction history
│   ├── components/     # React components
│   │   ├── AddFunds.tsx
│   │   ├── Hero.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── Send.tsx
│   │   ├── Swap.tsx
│   │   └── TransactionHistory.tsx
│   ├── lib/            # Utilities
│   │   ├── auth.ts     # Auth configuration
│   │   ├── constants.ts # App constants
│   │   └── tokens.ts   # Token definitions
│   └── dashboard/      # Dashboard page
├── prisma/             # Database schema
└── public/             # Static assets
```

## 🔧 Key Components

### Authentication Flow
1. User clicks "Login with Google"
2. Google OAuth authentication
3. On first login, system generates a Solana keypair
4. Wallet data encrypted and stored in PostgreSQL

### Token Swapping
1. User selects tokens and enters amount
2. Real-time quote fetched from Jupiter
3. Transaction built and signed with user's private key
4. Transaction submitted to Solana blockchain

### Security Considerations
- Private keys are encrypted before storage
- All API routes require authentication
- Sensitive operations use server-side signing

## 🚦 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth` | GET/POST | NextAuth endpoints |
| `/api/tokens` | GET | Fetch token balances |
| `/api/swap` | POST | Execute token swap |
| `/api/send` | POST | Send tokens |
| `/api/transactions` | GET | Get transaction history |

## 🔮 Future Enhancements

- [ ] Real fiat on/off ramp integration
- [ ] Support for more tokens
- [ ] Advanced trading features (limit orders, DCA)
- [ ] Mobile app (React Native)
- [ ] Multi-chain support
- [ ] Staking functionality
- [ ] Yield farming integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com) for the blockchain infrastructure
- [Jupiter](https://jup.ag) for swap aggregation
- [Next.js](https://nextjs.org) for the amazing framework
- The open-source community for various libraries used

## 📞 Contact

For any queries or suggestions, please reach out to:
- Email: contact@dcex.exchange
- Twitter: [@dcex_india](https://twitter.com/dcex_india)

---

Built with ❤️ for the Indian crypto community
