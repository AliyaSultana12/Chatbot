/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  degree: string;
  major: string;
  semester: number;
  gpa: number;
  attendanceRate: number; // e.g. 92%
  completedCredits: number;
  totalCredits: number;
  advisorName: string;
  advisorEmail: string;
  outstandingBalance: number;
  paymentHistory: PaymentRecord[];
  courses: EnrolledCourse[];
  notifications: Notification[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  purpose: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface EnrolledCourse {
  code: string;
  name: string;
  instructor: string;
  credits: number;
  grade: string;
  attendance: number; // percent
  progress: number; // percent (syllabus)
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'finance' | 'admin' | 'career';
  date: string;
  read: boolean;
}

export interface MapCoordinates {
  buildingName: string;
  x: number; // relative map x%
  y: number; // relative map y%
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  interactiveMap?: MapCoordinates;
  rating?: 'up' | 'down';
  visualCard?: {
    type: 'finance' | 'grades' | 'admissions' | 'courses' | 'success';
    data: any;
  };
}

export interface AdmissionApplication {
  name: string;
  email: string;
  degreeLevel: string; // Undergrad / Grad
  program: string;
  gpa: number;
  resumeSummary?: string;
  submissionDate: string;
  applicationId: string;
  status: 'Submitted' | 'In Review' | 'Accepted' | 'Scholarship Awarded';
}
