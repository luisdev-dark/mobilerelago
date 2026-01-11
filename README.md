# RealGo - Mobile App (MVP)

Transportation app MVP with fixed routes and simple booking system.

## Features

- ✅ List available routes
- ✅ View route details with stops
- ✅ Book trips (reservations)
- ✅ View trip status and details
- ✅ Simple, clean UI with TypeScript

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **HTTP Client**: Fetch API
- **Backend**: Go REST API (see ../backend)

## Project Structure

```
mobile/
├── app/                    # Screens and navigation
│   ├── (tabs)/             # Tab navigation
│   │   ├── index.tsx       # Home screen
│   │   ├── trips.tsx       # My trips tab
│   │   └── _layout.tsx     # Tab layout
│   ├── routes/             # Routes screens
│   │   ├── index.tsx       # Routes list
│   │   └── [id].tsx        # Route details
│   ├── trips/              # Trips screens
│   │   ├── index.tsx       # Trips list (standalone)
│   │   ├── [id].tsx        # Trip details
│   │   └── confirm.tsx     # Book trip form
│   └── _layout.tsx         # Root layout
├── src/
│   ├── api/                # API services
│   │   ├── http.ts         # HTTP client
│   │   ├── routes.api.ts   # Routes API
│   │   └── trips.api.ts    # Trips API
│   ├── models/             # TypeScript types
│   │   ├── route.ts        # Route types
│   │   └── trip.ts         # Trip types
│   └── config/             # Configuration
│       └── config.ts       # API config
└── components/            # Reusable components
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Backend server running (see ../backend)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API URL:
   - Edit `.env` file to set your backend URL
   - Default: `http://localhost:8080`

3. Start the backend server:
```bash
cd ../backend
go run main.go
```

4. Start the mobile app:
```bash
npm start
```

5. Run on device/simulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## API Endpoints Used

- `GET /routes` - List all active routes
- `GET /routes/{id}` - Get route details with stops
- `POST /trips` - Create a new trip
- `GET /trips/{id}` - Get trip details

## User Flow

1. **Home Screen**: Quick access to routes and trips
2. **Browse Routes**: View all available routes
3. **Route Details**: See route info, stops, and price
4. **Book Trip**: Select pickup/dropoff and payment method
5. **My Trips**: View booked trips and their status

## Trip Status

- **Requested**: Trip has been requested
- **Confirmed**: Trip is confirmed
- **Completed**: Trip has been completed
- **Cancelled**: Trip was cancelled

## Payment Methods

- Cash
- Yape
- Plin

## Notes

- MVP uses hardcoded user ID for trips
- No real-time tracking
- No in-app payments
- Simple state management (React hooks only)
- No Redux or other state management libraries

## Development

### TypeScript Configuration

The project uses strict TypeScript for type safety. All API responses are typed.

### Styling

Uses React Native StyleSheet with theme support for dark/light mode.

### Error Handling

All API calls include error handling with user-friendly error messages.

## Troubleshooting

### API Connection Issues

- Ensure backend server is running on port 8080
- Check `.env` file has correct API URL
- For physical devices, use your computer's IP address instead of localhost

### Build Issues

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo CLI version: `expo --version`

## Future Improvements

- User authentication
- Real-time trip tracking
- In-app payments
- Push notifications
- Trip history
- Rating system
- Multiple payment methods
- Scheduling trips in advance
