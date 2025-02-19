# Yuga Tracker

A React Native Expo application for tracking personal growth and learning progress through the concept of Yugas.

## Project Overview

Yuga Tracker is a mobile application built with React Native and Expo, using Supabase as the local database. The app helps users track their learning journey by implementing a unique point system based on daily learning hours.

## Technical Stack

- **Frontend Framework**: React Native with Expo (SDK 52.0.33)
- **Navigation**: Expo Router 4.0.17
- **Database**: Supabase
- **State Management**: React's built-in state management
- **Date Handling**: date-fns
- **UI Components**: Native components with Expo Vector Icons
- **Styling**: React Native StyleSheet

## Project Structure

```
yuga-tracker/
├── app/                    # Main application routes
│   ├── _layout.tsx        # Root layout configuration
│   ├── +not-found.tsx     # 404 error page
│   └── (tabs)/            # Tab-based navigation
│       ├── _layout.tsx    # Tab navigation configuration
│       ├── index.tsx      # Today's entry screen
│       ├── progress.tsx   # Progress tracking screen
│       └── history.tsx    # Historical entries screen
├── assets/                # Static assets
│   └── images/           
├── lib/                   # Shared utilities
│   └── supabase.ts       # Supabase client configuration
├── types/                 # TypeScript type definitions
│   └── supabase.ts       # Database types
└── supabase/             # Supabase configurations
    └── migrations/       # Database migrations
```

## Features

### 1. Point System
- Tracks learning hours and converts them to points
- Point calculation rules:
  - 0 hours: -1 point
  - 0-1 hours: -0.5 points
  - 1-2.5 hours: 0 points
  - >2.5 hours: 0.2 points per hour

### 2. Data Entry
- Hours input (0.0 - 10.0)
- Description field for activity details
- Automatic point calculation
- Real-time validation

### 3. Progress Tracking
- Total points accumulated
- Progress towards 1000-point goal
- Days active counter
- Points remaining calculation

### 4. History View
- Chronological list of entries
- Date-based grouping
- Points earned per entry
- Pull-to-refresh functionality

## Database Schema

```sql
CREATE TABLE entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  hours decimal NOT NULL CHECK (hours >= 0 AND hours <= 10),
  description text NOT NULL,
  points decimal NOT NULL
);
```

## UI/UX Design

### Theme
- Dark theme with accent colors
- Primary colors:
  - Background: #16161a
  - Cards: #242629
  - Accent: #7f5af0
  - Success: #2cb67d
  - Text: #fffffe
  - Secondary Text: #94a1b2

### Components
- Linear Gradient headers
- Card-based layouts
- Custom tab navigation
- Responsive input forms
- Pull-to-refresh lists

## Navigation Structure

The app uses a tab-based navigation system with three main screens:
1. **Today**: Entry form for daily activities
2. **Progress**: Overall progress tracking
3. **History**: Historical entries list

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase:
- Create a Supabase project
- Add environment variables in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Run the development server:
```bash
npm run dev
```

## Building for Production

To create an Android APK:
```bash
eas build -p android --profile preview
```

## Performance Considerations

- Optimized list rendering with `FlatList`
- Debounced input handling
- Efficient state management
- Minimal re-renders
- Proper error handling and loading states

## Future Enhancements

- Offline support
- Data export functionality
- Statistical analysis
- Achievement system
- Multiple Yuga tracking
- Data visualization

## Technical Decisions

1. **Supabase for Local Storage**
   - Provides structured data storage
   - SQL-like query capabilities
   - Real-time updates support
   - Built-in TypeScript support

2. **Expo Router**
   - File-based routing
   - Type-safe navigation
   - Automatic deep linking support
   - Efficient code splitting

3. **Linear Gradient**
   - Enhanced visual hierarchy
   - Professional UI elements
   - Consistent branding

4. **TypeScript**
   - Type safety
   - Better developer experience
   - Reduced runtime errors
   - Enhanced code maintainability