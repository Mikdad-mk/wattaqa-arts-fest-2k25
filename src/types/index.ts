import { ObjectId } from 'mongodb';

export interface Team {
  _id?: ObjectId | string;
  code: string;
  name: string;
  color: string;
  description: string;
  motto?: string;
  captain: string;
  captainEmail?: string;
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
  subcategory?: 'stage' | 'non-stage'; // For arts programmes
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  positionType: 'individual' | 'group' | 'general';
  requiredParticipants: number; // Number of participants required
  maxParticipants?: number; // Maximum participants allowed
  status: 'active' | 'inactive' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Candidate {
  _id?: ObjectId | string;
  chestNumber: string;
  name: string;
  team: string;
  section: 'senior' | 'junior' | 'sub-junior';
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Result {
  _id?: ObjectId | string;
  programme: string;
  section: 'senior' | 'junior' | 'sub-junior' | 'general';
  positionType: 'individual' | 'group' | 'general';
  // For individual/group programmes (participant-based)
  firstPlace: { chestNumber: string; grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E+' | 'E' | 'E-' | 'F' }[];
  secondPlace: { chestNumber: string; grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E+' | 'E' | 'E-' | 'F' }[];
  thirdPlace: { chestNumber: string; grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E+' | 'E' | 'E-' | 'F' }[];
  participationGrades?: { chestNumber: string; grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; points: number }[];
  // For general programmes (team-based)
  firstPlaceTeams?: { teamCode: string; grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E+' | 'E' | 'E-' | 'F' }[];
  secondPlaceTeams?: { teamCode: string; grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E+' | 'E' | 'E-' | 'F' }[];
  thirdPlaceTeams?: { teamCode: string; grade?: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'E+' | 'E' | 'E-' | 'F' }[];
  participationTeamGrades?: { teamCode: string; grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; points: number }[];
  firstPoints: number;
  secondPoints: number;
  thirdPoints: number;
  participationPoints?: number;
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

export interface ProgrammeParticipant {
  _id?: ObjectId | string;
  programmeId: string;
  programmeCode: string;
  programmeName: string;
  teamCode: string;
  participants: string[]; // Array of chest numbers
  status: 'registered' | 'confirmed' | 'withdrawn';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GalleryImage {
  _id?: ObjectId | string;
  title: string;
  description?: string;
  category: 'events' | 'teams' | 'performances' | 'awards' | 'behind-scenes';
  eventOrTeam?: string; // Related event or team
  imageData: string; // Base64 encoded image
  mimeType: string; // Image MIME type (image/jpeg, image/png, etc.)
  fileSize: number; // File size in bytes
  uploadedBy: string; // User who uploaded the image
  tags?: string[]; // Optional tags for better organization
  createdAt?: Date;
  updatedAt?: Date;
}