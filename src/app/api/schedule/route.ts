import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Schedule } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<Schedule>('schedule');
    
    let schedules = await collection.find({}).sort({ day: 1 }).toArray();
    
    // If no schedule exists, create default schedule
    if (schedules.length === 0) {
      const defaultSchedule: Schedule[] = [
        {
          day: 1,
          date: new Date('2025-03-10'),
          title: 'Opening Ceremony & Arts Competitions',
          events: 'Opening Ceremony & Arts Competitions',
          details: 'Classical Singing, Painting, Poetry',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          day: 2,
          date: new Date('2025-03-11'),
          title: 'Dance & Drama Performances',
          events: 'Dance & Drama Performances',
          details: 'Group Dance, Drama Performance, Storytelling',
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          day: 3,
          date: new Date('2025-03-12'),
          title: 'Sports Events & Team Competitions',
          events: 'Sports Events & Team Competitions',
          details: 'Football, Basketball, Table Tennis',
          status: 'in-progress',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          day: 4,
          date: new Date('2025-03-13'),
          title: 'Individual Sports & Arts Finals',
          events: 'Individual Sports & Arts Finals',
          details: 'Track & Field, Badminton, Calligraphy',
          status: 'upcoming',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          day: 5,
          date: new Date('2025-03-14'),
          title: 'Closing Ceremony & Awards',
          events: 'Closing Ceremony & Awards',
          details: 'Final Results, Prize Distribution, Cultural Show',
          status: 'upcoming',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await collection.insertMany(defaultSchedule);
      schedules = await collection.find({}).sort({ day: 1 }).toArray();
    }
    
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection<Schedule>('schedule');
    
    const newSchedule: Schedule = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newSchedule);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}