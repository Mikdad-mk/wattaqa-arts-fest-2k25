import { ObjectId } from 'mongodb';

export interface Team {
  _id?: ObjectId | string;
  code: string;
  name: string;
  color: string;
  description: string;
  captain: string;
  members: number;
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Programme {
  _id?: ObjectId | string;
  code: string;
  name: string;
  category: 'arts' | 'sports';
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  positionType: 'individual' | 'group' | 'general';
  status: 'active' | 'inactive' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Candidate {
  _id?: ObjectId | string;
  chestNumber: string;
  name: string;
  team: string;
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Result {
  _id?: ObjectId | string;
  programme: string;
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  positionType: 'individual' | 'group' | 'general';
  winners: {
    position: 'first' | 'second' | 'third';
    participants: string[]; // chest numbers or team names
    points: number;
  }[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FestivalInfo {
  _id?: ObjectId | string;
  name: string;
  year: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Schedule {
  _id?: ObjectId | string;
  day: number;
  date: Date;
  title: string;
  events: string;
  details: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  createdAt?: Date;
  updatedAt?: Date;
}