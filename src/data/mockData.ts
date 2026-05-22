/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student } from '../types';

export const ZENITH_COLLEGE_INFO = {
  name: "Zenith Institute of Technology",
  abbreviation: "ZIT",
  established: 1998,
  motto: "Altiora Petamus (Let us seek higher things)",
  location: "Metro Heights Campus, Sector 12, Innovation City",
  admissionsMail: "admissions@zit.edu",
  generalHelpline: "+1 (800) 555-0199",
  departments: [
    {
      name: "School of Computing & AI",
      dean: "Dr. Evelyn Vance",
      programs: [
        { name: "B.Tech Computer Science & Engineering (CSE)", duration: "4 Years", tuitionFee: "$12,500/semester" },
        { name: "B.Tech Artificial Intelligence & Machine Learning (AI-ML)", duration: "4 Years", tuitionFee: "$13,200/semester" },
        { name: "M.Tech Data Science & Analytics", duration: "2 Years", tuitionFee: "$15,000/semester" }
      ]
    },
    {
      name: "School of Advanced Engineering",
      dean: "Dr. Marcus Thorne",
      programs: [
        { name: "B.Tech Robotics & Automation", duration: "4 Years", tuitionFee: "$11,800/semester" },
        { name: "B.Tech Aerospace Engineering", duration: "4 Years", tuitionFee: "$12,900/semester" }
      ]
    },
    {
      name: "School of Design & Creative Tech",
      dean: "Prof. Clara Wu",
      programs: [
        { name: "B.Des User Experience & Interaction Design", duration: "4 Years", tuitionFee: "$11,200/semester" },
        { name: "M.Des Immersive Media & Game Design", duration: "2 Years", tuitionFee: "$12,800/semester" }
      ]
    }
  ],
  hostelFacilities: {
    options: [
      { type: "Single Occupancy (Air Conditioned)", cost: "$1,800/semester", features: "Attached bath, desk, personal router" },
      { type: "Double Occupancy (Air Conditioned)", cost: "$1,200/semester", features: "Shared bath, two wardrobes" },
      { type: "Standard Double (Non-AC)", cost: "$800/semester", features: "Eco-friendly, common bath" }
    ],
    messCharges: "$450/semester (Unlimited 3-meals buffet)",
    warden: "Mr. Harold Briggs",
    rules: "In-time is strictly 10:00 PM. High-speed campus Wi-Fi included."
  },
  scholarships: [
    { name: "Zenith Excellence Merit Scholarship", discount: "100% Tuition Fee", criteria: "GPA >= 3.90 or Top 1% in entrance exam" },
    { name: "Women in Tech Empowerment Grant", discount: "50% Tuition Fee", criteria: "Female candidates in School of Computing" },
    { name: "Global Innovation Fellowship", discount: "30% Tuition Fee + Research Stipend", criteria: "Recognized project in AI, Robotics, or Biotech at school level" }
  ],
  importantDates: {
    oddSemester: {
      admissionCloses: "July 15, 2026",
      classesCommence: "August 1, 2026",
      midtermExaminations: "October 8 - 14, 2026",
      endSemExaminations: "December 5 - 18, 2026"
    },
    applicationsOpen: "Ongoing. Next session selection list announces June 5, 2026."
  },
  mapLocations: {
    "Admission Block": { buildingName: "Admissions Block (A-Zone)", x: 25, y: 35, description: "Administrative center for admissions, counselling, registrar, and direct enquiries." },
    "Innovation Labs": { buildingName: "Computing & Innovation Center (C-Zone)", x: 65, y: 40, description: "School of Computing, high-performance GPU cluster AI labs, and game design studios." },
    "Central Library": { buildingName: "Zenith Core Knowledge Resource Center", x: 45, y: 72, description: "3-story modern library open 24/7, silent zones, book collections, and online portals." },
    "Student Residency Hub": { buildingName: "Emerald Residency Complex & Food Court", x: 80, y: 75, description: "Male and female hostel corridors, indoor gym, and the primary student cafeteria." },
    "Dean’s Office": { buildingName: "Executive Wing & Council Hall (Main Block)", x: 48, y: 22, description: "Chancellor's room, respective dean cabin offices, and international affairs desk." }
  }
};

export const SVYASA_COLLEGE_INFO = {
  name: "Swami Vivekananda Yoga Anusandhana Samsthana",
  abbreviation: "S-VYASA",
  established: 1986,
  motto: "Be and Make (Yogaḥ Karmasu Kauśalam)",
  location: "Prashanti Kutiram, Jigani Hobli, Anekal Taluk, Bengaluru, Karnataka, India",
  admissionsMail: "admissions@svyasa.edu.in",
  generalHelpline: "+91 (80) 2263-5300",
  departments: [
    {
      name: "Division of Yoga & Life Sciences",
      dean: "Dr. Manjunath N K",
      programs: [
        { name: "B.Sc in Yoga & Consciousness", duration: "3 Years", tuitionFee: "₹45,000/semester" },
        { name: "M.Sc in Yoga Therapy", duration: "2 Years", tuitionFee: "₹55,000/semester" },
        { name: "BNYS (Naturopathy & Yogic Sciences)", duration: "5.5 Years", tuitionFee: "₹85,000/semester" }
      ]
    },
    {
      name: "Division of Yoga & Physical Sciences",
      dean: "Dr. R Nagarathna",
      programs: [
        { name: "B.Sc in Yoga and Management", duration: "3 Years", tuitionFee: "₹40,000/semester" },
        { name: "M.Sc in Yoga and Vedic Sciences", duration: "2 Years", tuitionFee: "₹50,000/semester" }
      ]
    },
    {
      name: "Division of Yoga & Humanities",
      dean: "Prof. Ramachandra G Bhat",
      programs: [
        { name: "PGDYT (Post Graduate Diploma in Yoga Therapy)", duration: "1 Year", tuitionFee: "₹35,000/semester" },
        { name: "Ph.D in Yoga & Sanskrit Studies", duration: "3-5 Years", tuitionFee: "₹60,000/semester" }
      ]
    }
  ],
  hostelFacilities: {
    options: [
      { type: "Prashanti Kutiram Single Room (Sattvic AC)", cost: "₹30,000/semester", features: "Attached solar bath, meditation desk, personal quiet zone" },
      { type: "Shared Gurukula Residence Cottage (Standard Non-AC)", cost: "₹15,000/semester", features: "Shared wardrobe, natural green ventilation" },
      { type: "Maitreyi Dormitory (Eco-friendly)", cost: "₹10,000/semester", features: "Saddhana floor space, common utility room" }
    ],
    messCharges: "₹18,000/semester (Sattvic pure-vegetarian, seasonal fresh produce cooked as per Ayurvedic principles)",
    warden: "Acharya Someshwar Nath",
    rules: "Gurukula lifestyle guidelines. In-time is strictly 9:30 PM. Compulsory morning prayer & pranayama shala assembly is at 5:00 AM."
  },
  scholarships: [
    { name: "Vivekananda Spiritual Excellence Grant", discount: "100% Tuition Fee Waiver", criteria: "Outstanding yoga proficiency or high-school credentials >= 3.80 GPA" },
    { name: "Arogya Wellness Community Fellowship", discount: "50% Tuition Fee Waiver", criteria: "Rural background or commitment to serve in Naturopathy & Yoga research" },
    { name: "Sadhaka Research Scholarship", discount: "30% Tuition Fee + Arogyadhama Clinical Internship", criteria: "Published research/projects in Yoga therapy or spiritual engineering" }
  ],
  importantDates: {
    oddSemester: {
      admissionCloses: "June 30, 2026",
      classesCommence: "July 12, 2026",
      midtermExaminations: "September 15 - 22, 2026",
      endSemExaminations: "November 25 - December 10, 2026"
    },
    applicationsOpen: "Ongoing. Next Gurukula batch counseling selection list announces June 1, 2026."
  },
  mapLocations: {
    "Arogyadhama Hospital": { buildingName: "Arogyadhama Holistic Healing Home (250-bed)", x: 75, y: 35, description: "S-VYASA's world-renowned therapy hospital offering Yoga Therapy, Naturopathy, Ayurveda, and clinical research wards." },
    "Saraswati Library": { buildingName: "Saraswati Ancient & Modern Research Library", x: 25, y: 65, description: "3-story quiet saddadhana space hosting over 30,000 yoga manuscripts, health/consciousness reports, and global neuroscience papers." },
    "Vedic Prarthana Hall": { buildingName: "Main Prayer Hall & Yoga Shala Complex", x: 50, y: 55, description: "Unifying focal room holding daily 5:00 AM dynamic yogasana, pranayama sessions, spiritual conferences, and sunrise kirtan." },
    "Gurukula Cottages": { buildingName: "Maitreyi & Maitreya Student Residency Units", x: 82, y: 72, description: "Sattvic living spaces, Gurukula design huts, organic farms, and organic Gaushala (cow sanctuary) annex." },
    "Administrative Block": { buildingName: "Chanakya Administrative & Enrollment Center", x: 45, y: 25, description: "Main admissions, registry, fee counter, international desk, and Vice-Chancellor's office chamber." }
  }
};

export const MOCK_STUDENTS: Record<string, Student> = {
  "ZIT-2026-004": {
    id: "ZIT-2026-004",
    name: "Alex Rivera",
    email: "alex.rivera@zit.student.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    degree: "B.Tech Computer Science & Engineering",
    major: "Software Engineering & Cloud Infrastructure",
    semester: 6,
    gpa: 3.92,
    attendanceRate: 94.5,
    completedCredits: 96,
    totalCredits: 128,
    advisorName: "Dr. Evelyn Vance",
    advisorEmail: "evelyn.vance@zit.edu",
    outstandingBalance: 1200,
    paymentHistory: [
      { id: "TXN-9092", date: "2026-01-10", amount: 11300, purpose: "Sem 6 Tuition Fee Payment", status: "Paid" },
      { id: "TXN-8812", date: "2025-07-25", amount: 12500, purpose: "Sem 5 Tuition Fee Payment", status: "Paid" },
      { id: "TXN-5012", date: "2025-11-15", amount: 150, purpose: "Annual Hackathon Entry Fee", status: "Paid" }
    ],
    courses: [
      { code: "CS-401", name: "Distributed Systems & Cloud Computing", instructor: "Dr. Vance", credits: 4, grade: "A", attendance: 98, progress: 85 },
      { code: "CS-403", name: "Modern Software Design Patterns", instructor: "Prof. Wu", credits: 3, grade: "A-", attendance: 92, progress: 90 },
      { code: "AI-302", name: "Introduction to Generative AI Pipelines", instructor: "Dr. Singh", credits: 4, grade: "A", attendance: 95, progress: 78 },
      { code: "CS-499", name: "Major Project - Capstone", instructor: "Dr. Thorne", credits: 4, grade: "InProgress", attendance: 93, progress: 55 }
    ],
    notifications: [
      { id: "NOT-001", title: "Semester Fee Outstanding Alert", message: "An outstanding balance of $1,200 for your course labs is due by June 1, 2026. Please clear it.", type: "finance", date: "2026-05-20", read: false },
      { id: "NOT-002", title: "Dean's Merit List Selection", message: "Congratulations! With your current GPA of 3.92, you have been shortlisted for the Zenith Merit Scholarship Renewal.", type: "academic", date: "2026-05-18", read: false },
      { id: "NOT-003", title: "AWS Cloud Workshop", message: "The School of Computing is hosting a hands-on AWS masterclass next Wednesday at the Innovation Labs.", type: "career", date: "2026-05-15", read: true }
    ]
  },
  "ZIT-2026-088": {
    id: "ZIT-2026-088",
    name: "Sarah Chen",
    email: "sarah.chen@zit.student.edu",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    degree: "B.Tech Computer Science & Engineering",
    major: "Cybersecurity & Cryptography",
    semester: 4,
    gpa: 3.75,
    attendanceRate: 88.2,
    completedCredits: 64,
    totalCredits: 128,
    advisorName: "Prof. Evelyn Vance",
    advisorEmail: "evelyn.vance@zit.edu",
    outstandingBalance: 0,
    paymentHistory: [
      { id: "TXN-7124", date: "2026-01-05", amount: 12500, purpose: "Sem 4 Tuition Fee & Hostel", status: "Paid" },
      { id: "TXN-6549", date: "2025-07-20", amount: 12500, purpose: "Sem 3 Tuition Fee & Hostel", status: "Paid" }
    ],
    courses: [
      { code: "CS-311", name: "Network Infrastructure Security", instructor: "Prof. Thorne", credits: 4, grade: "B+", attendance: 85, progress: 80 },
      { code: "CS-315", name: "Applied Cryptographic Protocols", instructor: "Dr. Evelyn Vance", credits: 3, grade: "A-", attendance: 90, progress: 74 },
      { code: "CS-280", name: "Database Security & Penetration Testing", instructor: "Mr. Harold Briggs", credits: 4, grade: "A", attendance: 90, progress: 92 }
    ],
    notifications: [
      { id: "NOT-101", title: "Ethical Hacking Contest", message: "ZIT CTF Cyber Tournament registrations are now open. Team submissions close in 5 days.", type: "career", date: "2026-05-21", read: false },
      { id: "NOT-102", title: "Mid-Term Academic Progress", message: "Academic report updated. Keep up the attendance in CS-311 to stay above the 85% cut-off.", type: "academic", date: "2026-05-19", read: false }
    ]
  },
  "SVYASA-2026-004": {
    id: "SVYASA-2026-004",
    name: "Vyasa Dev",
    email: "vyasa.dev@svyasa.student.edu.in",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    degree: "M.Sc in Yoga Therapy",
    major: "Clinical Yoga & Psychosomatic Rehabilitation",
    semester: 3,
    gpa: 3.95,
    attendanceRate: 98.2,
    completedCredits: 44,
    totalCredits: 64,
    advisorName: "Dr. Pratima Ramachandra",
    advisorEmail: "pratima.r@svyasa.edu.in",
    outstandingBalance: 15000,
    paymentHistory: [
      { id: "TXN-7711", date: "2026-01-12", amount: 40000, purpose: "Sem 3 Yoga Science and Therapy Tuition Fees", status: "Paid" },
      { id: "TXN-5052", date: "2025-07-20", amount: 55000, purpose: "Sem 2 Yoga Therapy Tuition and Lab Charges", status: "Paid" }
    ],
    courses: [
      { code: "YT-501", name: "Yoga Therapy for Psychosomatic Disorders", instructor: "Dr. Pratima Ramachandra", credits: 4, grade: "A", attendance: 99, progress: 85 },
      { code: "YT-503", name: "Anatomy & Physiology of Yogic Practices", instructor: "Dr. Manjunath N K", credits: 3, grade: "A", attendance: 97, progress: 92 },
      { code: "YT-505", name: "Clinical Yoga Therapy Clerkship / Arogyadhama", instructor: "Dr. Nagarathna R", credits: 6, grade: "A", attendance: 98, progress: 70 }
    ],
    notifications: [
      { id: "NOT-SV-01", title: "Arogyadhama Clinical Internship Fee Due", message: "An outstanding balance of ₹15,000 for your clinical wards internship and Sattvic organic canteen program is pending. Please clear it.", type: "finance", date: "2026-05-20", read: false },
      { id: "NOT-SV-02", title: "Vivekananda Leadership Selection Letter", message: "Pranam! Due to your academic performance, you has been nominated to conduct the Sunrise Kirtan yoga session at Saraswati Hall this Saturday.", type: "academic", date: "2026-05-18", read: false }
    ]
  },
  "SVYASA-2026-088": {
    id: "SVYASA-2026-088",
    name: "Aaditya Sharma",
    email: "aaditya.sharma@svyasa.student.edu.in",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    degree: "B.Sc in Yoga and Consciousness",
    major: "Mind-Body Medicine & Vedic Studies",
    semester: 4,
    gpa: 3.65,
    attendanceRate: 91.0,
    completedCredits: 60,
    totalCredits: 120,
    advisorName: "Acharya Someshwar Nath",
    advisorEmail: "someshwar.nath@svyasa.edu.in",
    outstandingBalance: 0,
    paymentHistory: [
      { id: "TXN-3211", date: "2026-01-08", amount: 45000, purpose: "Sem 4 Tuition & gurukula residency fee", status: "Paid" },
      { id: "TXN-1104", date: "2025-07-15", amount: 45000, purpose: "Sem 3 Tuition & gurukula residency fee", status: "Paid" }
    ],
    courses: [
      { code: "YC-201", name: "Concept of Purusha and Prakriti in Upanishads", instructor: "Acharya Someshwar Nath", credits: 4, grade: "B+", attendance: 88, progress: 80 },
      { code: "YC-203", name: "Patanjali Yoga Sutras and Self-Realization", instructor: "Dr. Pratima Ramachandra", credits: 3, grade: "A-", attendance: 92, progress: 75 },
      { code: "YC-205", name: "Hatha Yoga Pradipika Practice & Shatkarmas", instructor: "Acharya Someshwar Nath", credits: 4, grade: "A", attendance: 93, progress: 90 }
    ],
    notifications: [
      { id: "NOT-SV-101", title: "International Day of Yoga Coordinator Selection", message: "Pranam! You have been shortlisted as an official student coordinator for S-VYASA's delegation to the United Nations Yoga Day.", type: "career", date: "2026-05-21", read: false }
    ]
  }
};
