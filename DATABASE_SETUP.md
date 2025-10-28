# MongoDB Database Setup for Wattaqa Festival 2K25

## Overview
This application now uses MongoDB to store and manage festival data dynamically. All the information displayed on the Basic page and other admin pages is fetched from your MongoDB database.

## Database Configuration

### Environment Variables
The application uses the following environment variables (already configured in `.env.local`):

```
MONGODB_URI=mongodb+srv://wattaqa-2k25:DSvR9vIF9JZTuC63@wattaqa-2k25.snkdtfc.mongodb.net/?appName=wattaqa-2k25
MONGODB_DB=wattaqa-festival-2k25
```

### Database Collections

The application uses the following MongoDB collections:

1. **festival-info** - Stores festival basic information
2. **teams** - Stores team data (Sumud, Aqsa, Inthifada)
3. **programmes** - Stores all festival programmes (Arts & Sports)
4. **schedule** - Stores festival schedule information
5. **candidates** - Stores participant information
6. **results** - Stores competition results

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

This will install the MongoDB driver along with other dependencies.

### 2. Initialize Database (Optional)
If you want to populate your database with sample data, run:

```bash
node scripts/init-db.js
```

This script will:
- Create all necessary collections
- Insert sample festival data
- Set up default teams, programmes, and schedule

### 3. Start the Application
```bash
npm run dev
```

The application will automatically connect to MongoDB and fetch data dynamically.

## API Endpoints

The application provides the following API endpoints:

- `GET /api/festival-info` - Get festival information
- `PUT /api/festival-info` - Update festival information
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `GET /api/programmes` - Get all programmes
- `POST /api/programmes` - Create new programme
- `GET /api/schedule` - Get festival schedule
- `POST /api/schedule` - Create schedule item

## Dynamic Features

### Basic Page
The Basic page now dynamically displays:
- **Festival Information**: Name, dates, venue from database
- **Statistics**: Calculated from actual data (team count, programme count, total students)
- **Team Structure**: Real team data with colors and member counts
- **Programme Categories**: Arts and Sports programmes from database
- **Schedule**: Festival schedule with real dates and status

### Data Updates
- All data is fetched in real-time from MongoDB
- Changes to the database are immediately reflected in the UI
- Loading states are shown while data is being fetched
- Error handling for database connection issues

## Database Schema

### Festival Info
```typescript
{
  name: string;
  year: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}
```

### Teams
```typescript
{
  name: string;
  color: string;
  description: string;
  captain: string;
  members: number;
  points: number;
}
```

### Programmes
```typescript
{
  code: string;
  name: string;
  category: 'arts' | 'sports';
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  positionType: 'individual' | 'group' | 'general';
  status: 'active' | 'inactive' | 'completed';
}
```

### Schedule
```typescript
{
  day: number;
  date: Date;
  title: string;
  events: string;
  details: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}
```

## Benefits of Dynamic Data

1. **Real-time Updates**: Changes reflect immediately
2. **Scalability**: Easy to add new teams, programmes, or schedule items
3. **Data Consistency**: Single source of truth in MongoDB
4. **Easy Management**: Update data through API or database directly
5. **Performance**: Efficient data fetching and caching

## Next Steps

1. **Add More API Endpoints**: For candidates, results, etc.
2. **Implement CRUD Operations**: Full create, read, update, delete functionality
3. **Add Data Validation**: Ensure data integrity
4. **Implement Authentication**: Secure admin operations
5. **Add Real-time Updates**: WebSocket or polling for live updates

## Troubleshooting

### Connection Issues
- Verify MongoDB URI is correct
- Check network connectivity
- Ensure MongoDB cluster is running

### Data Not Loading
- Check browser console for errors
- Verify API endpoints are working
- Run the database initialization script

### Performance Issues
- Consider adding database indexes
- Implement data pagination for large datasets
- Add caching layer if needed