import { ObjectId } from 'mongodb';

export interface Team {
  _id?: ObjectId | string;
  code: string;
  name: string;
  color: string;
  description: string;
  motto?: string;
  captain: string;
  leaders?: string[];
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
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Result {
  _id?: ObjectId | string;
  programme: string;
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  positionType: 'individual' | 'group' | 'general';
  firstPlace: { chestNumber: string; grade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' }[];
  secondPlace: { chestNumber: string; grade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' }[];
  thirdPlace: { chestNumber: string; grade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' }[];
  firstPoints: number;
  secondPoints: number;
  thirdPoints: number;
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