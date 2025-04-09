# YM-Pay

<p align="center">
  <img src="/public/images/YM-Pay-logo.jpg" alt="YM-Pay Logo" width="150" />
</p>

## Project Overview
YM-Pay is a modern digital wallet and payment application built with Next.js, TypeScript, and MongoDB. It enables users to send money, make bill payments, perform mobile recharges, and manage their financial transactions through a secure and intuitive interface.

## Live Demo
Visit the live demo at [https://ym-pay.vercel.app/](https://ym-pay.vercel.app/)

## Features
- **User Authentication**: Secure signup and login with JWT authentication
- **Dashboard**: Comprehensive dashboard showing balance and quick actions
- **Send Money**: Transfer funds to other users securely
- **Add Money**: Add funds to your wallet
- **Bill Payments**: Pay electricity, mobile, and DTH bills
- **Mobile Recharge**: Recharge prepaid mobile numbers
- **Transaction History**: View and track all past transactions
- **Profile Management**: Update personal information and manage account settings
- **Referral System**: Invite friends and earn rewards
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: ShadCN UI, Radix UI, Framer Motion
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: MongoDB Atlas
- **Authentication**: JWT, HTTP-only cookies
- **Form Validation**: React Hook Form, Zod
- **Deployment**: Vercel

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB Atlas account

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NODE_ENV=development
```

For production deployment, set these variables in your Vercel project settings.

## Installation and Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/YM-Pay.git
cd YM-Pay
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment to Vercel

### Automatic Deployment (Recommended)
1. Push your code to a GitHub repository
2. Import your repository to Vercel
3. Set up the required environment variables in the Vercel dashboard
4. Vercel will automatically deploy your application

### Manual Deployment
1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Login to your Vercel account:
```bash
vercel login
```

3. Deploy to Vercel:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/user` - Get current user profile
- `PUT /api/user/update` - Update user profile

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Create new transaction

### Payments
- `POST /api/send-money` - Send money to another user
- `POST /api/add-money` - Add money to wallet
- `POST /api/bills` - Pay bills

## Security Features
- Password validation with strict requirements
- JWT authentication with HTTP-only cookies
- Protected API routes
- Input sanitization and validation
- Secure headers configuration
- MongoDB connection with SSL encryption

## File Structure
```
├── app/                # Next.js application
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── ...             # Other pages
├── components/         # React components
├── lib/                # Utility functions
├── public/             # Static assets
│   └── images/         # Images and icons
├── styles/             # Global styles
├── .env                # Environment variables
├── next.config.mjs     # Next.js configuration
├── vercel.json         # Vercel deployment configuration
└── package.json        # Project dependencies
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For support or inquiries, please contact:
- Email: yashwanthnaidum2408@gmail.com
- GitHub: [https://github.com/yash6366](https://github.com/yash6366)

## Acknowledgments
- Next.js team for the amazing framework
- Vercel for hosting the application
- MongoDB Atlas for database hosting
- ShadCN UI for the beautiful UI components
