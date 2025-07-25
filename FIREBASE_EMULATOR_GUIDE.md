# Firebase Emulator Setup Guide

This project is configured to use Firebase emulators for local development, allowing you to test your application without connecting to production Firebase services.

## 🚀 Quick Start

### 1. Start the Emulators
```bash
npm run emulators:start
```

This will start:
- **Firestore Emulator**: `http://localhost:8080`
- **Authentication Emulator**: `http://localhost:9099`
- **Emulator UI**: `http://localhost:8081`

### 2. Start Your Application
In a separate terminal:
```bash
npx nx serve mg-frontend
```

Your app will automatically connect to the local emulators when running in development mode.

## 🔧 Available Scripts

- `npm run emulators:start` - Start emulators fresh
- `npm run emulators:start:import` - Start emulators with previously exported data
- `npm run emulators:export` - Export current emulator data for later use

## 🎯 Features

### Emulator UI (http://localhost:8081)
- View and manage Firestore collections and documents
- Monitor Authentication users
- Real-time data visualization
- Import/export data capabilities

### Data Persistence
- Emulator data is reset each time you restart unless you export it
- Use `npm run emulators:export` to save current state
- Use `npm run emulators:start:import` to restore saved data

## 📝 Configuration Details

### Environment Setup
- Development environment (`environment.ts`) uses demo Firebase config
- Production environment (`environment.prod.ts`) uses real Firebase config
- `useEmulators` flag controls emulator connection

### Collections Used
- `friends` - Friend data from the friends library
- `gifts` - Gift data from the list library

## 🧪 Testing Your App

1. Start emulators: `npm run emulators:start`
2. Open Emulator UI: http://localhost:8081
3. Start your app: `npx nx serve mg-frontend`
4. Use your app - data will appear in the Emulator UI
5. Export data if you want to keep it: `npm run emulators:export`

## 🔗 Useful Links

- [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)
- [Firestore Emulator Documentation](https://firebase.google.com/docs/emulator-suite/connect_firestore)
- Emulator UI: http://localhost:8081 (when running)

## 📊 Port Configuration

| Service | Port |
|---------|------|
| Firestore | 8080 |
| Authentication | 9099 |
| Emulator UI | 8081 |

## 🛑 Stopping Emulators

Press `Ctrl+C` in the terminal where emulators are running, or use:
```bash
firebase emulators:stop
``` 