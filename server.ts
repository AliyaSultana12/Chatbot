/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { MOCK_STUDENTS, ZENITH_COLLEGE_INFO, SVYASA_COLLEGE_INFO } from "./src/data/mockData";
import { AdmissionApplication, MapCoordinates } from "./src/types";

// Load environment variables
dotenv.config();

// Standard database store in-memory for live demo session interaction
const studentsDb = JSON.parse(JSON.stringify(MOCK_STUDENTS));
const applicationsDb: Record<string, AdmissionApplication> = {};

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot will run in fallback mock-AI mode.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // --- API ROUTE 1: Auth - Login student ---
  app.post("/api/auth/login", (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required." });
    }

    const cleanId = studentId.trim().toUpperCase();
    const student = studentsDb[cleanId];

    if (!student) {
      return res.status(404).json({ error: "Student ID not found. Try ZIT-2026-004 or ZIT-2026-088 for testing." });
    }

    res.json({ success: true, student });
  });

  // --- API ROUTE 2: Get Student Profile ---
  app.get("/api/student/:id", (req, res) => {
    const studentId = req.params.id.trim().toUpperCase();
    const student = studentsDb[studentId];
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(student);
  });

  // --- API ROUTE 3: Simulate Fee Settlement ---
  app.post("/api/student/pay-fee", (req, res) => {
    const { studentId, paymentAmount } = req.body;
    if (!studentId || !paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ error: "Invalid payment request parameters." });
    }

    const student = studentsDb[studentId.trim().toUpperCase()];
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    const previousBalance = student.outstandingBalance;
    const finalPayment = Math.min(previousBalance, paymentAmount);

    student.outstandingBalance -= finalPayment;

    // Record Transaction
    const txnId = "TXN-" + Math.floor(1000 + Math.random() * 9000);
    student.paymentHistory.unshift({
      id: txnId,
      date: new Date().toISOString().split('T')[0],
      amount: finalPayment,
      purpose: "Tuition Settlement via Dashboard Chatbot Pay",
      status: "Paid"
    });

    // Clear finance notifications if balance is settled
    if (student.outstandingBalance === 0) {
      student.notifications = student.notifications.filter((n: any) => n.type !== 'finance');
    }

    res.json({ success: true, message: `Successfully processed transaction! Paid $${finalPayment}. Outstanding balance now $${student.outstandingBalance}.`, student });
  });

  // --- API ROUTE 4: Apply for prospective student admission ---
  app.post("/api/admissions/apply", (req, res) => {
    const { name, email, degreeLevel, program, gpa, resumeSummary } = req.body;
    if (!name || !email || !program || !gpa) {
      return res.status(400).json({ error: "Name, email, program, and GPA are required for application evaluation." });
    }

    const parsedGPA = parseFloat(gpa);
    const appId = "APP-" + Math.floor(10000 + Math.random() * 90000);

    const isHighGPA = parsedGPA >= 3.8;
    const status = isHighGPA ? "Scholarship Awarded" : "Accepted";

    const newApp: AdmissionApplication = {
      name,
      email,
      degreeLevel,
      program,
      gpa: parsedGPA,
      resumeSummary: resumeSummary || "",
      submissionDate: new Date().toISOString().split('T')[0],
      applicationId: appId,
      status
    };

    applicationsDb[appId] = newApp;
    res.json({ success: true, application: newApp });
  });

  // --- API ROUTE 5: Get Admissions applications ---
  app.get("/api/admissions/:appId", (req, res) => {
    const { appId } = req.params;
    const application = applicationsDb[appId.trim().toUpperCase()];
    if (!application) {
      return res.status(404).json({ error: "Application record not found." });
    }
    res.json(application);
  });

  // --- API ROUTE 6: Chatbot Core Enquiry & Context Analyzer Tool ---
  app.post("/api/chat", async (req, res) => {
    const { message, chatHistory, studentId, isAdmissionMode, admissionConfig, college } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content cannot be empty." });
    }

    const isSvyasa = college === 'SVYASA';
    const activeCollegeInfo = isSvyasa ? SVYASA_COLLEGE_INFO : ZENITH_COLLEGE_INFO;

    // Determine current contextual student profile
    let currentStudent = null;
    if (studentId) {
      currentStudent = studentsDb[studentId.toUpperCase()];
    }

    // Determine if our query contains map trigger landmarks
    let mappedPin: MapCoordinates | undefined = undefined;
    const textLower = message.toLowerCase();
    
    for (const [key, details] of Object.entries(activeCollegeInfo.mapLocations)) {
      if (textLower.includes(key.toLowerCase()) || 
          textLower.includes("where") && textLower.includes(key.split(" ")[0].toLowerCase())) {
        mappedPin = details;
        break;
      }
    }

    // Set fallback map if user is asking general map help
    if (!mappedPin && (textLower.includes("campus map") || textLower.includes("tour") || textLower.includes("layout") || textLower.includes("campus blueprint") || textLower.includes("campus map") || textLower.includes("where is everything"))) {
      mappedPin = {
        buildingName: isSvyasa ? "Prashanti Kutiram Campus Blocks Live" : "All Campus Blocks Live",
        x: 50,
        y: 50,
        description: isSvyasa 
          ? "Interactive virtual simulation of S-VYASA Bengaluru. You can click coordinates on the Prashanti Kutiram map at the top to discover Arogyadhama, Library, and Prayer halls." 
          : "Interactive virtual campus map. Click pins on the map to explore academic blocks!"
      };
    }

    // Formulate rich context knowledge base to pass to Gemini API
    const botIdentityPrompt = isSvyasa 
      ? `You are \"Saraswati\", the enlightened academic advisor and administrative assistant at Swami Vivekananda Yoga Anusandhana Samsthana (S-VYASA) University.
Your purpose is to assist yoga students, healers, prospective candidates, research scholars and visitors.
You must address users with respectful, warm, and serene language (feel free to say \"Pranam\", \"Namaste\", \"Shanti\" or \"Blessings\" where appropriate).
Keep answers highly structured, clear, and formatted beautifully with markdown listing bullet points!
Ensure you refer to your beautiful green campus as Prashanti Kutiram, and highlight the significance of scientific research in yoga therapy, naturopathy, and Arogyadhama holistic hospital.`
      : `You are \"Zenia\", the award-winning smart administrative chatbot & academic advisor at the Zenith Institute of Technology (ZIT).
Your purpose is to assist prospective students, current students, parents, and visitors.
Be professional, warm, and highly informative. Keep answers concise, highly structured, and well-formatted with markdown listing bullet points!`;

    const contextPrompt = `
${botIdentityPrompt}

Here is our official university core facts dataset:
- Name: ${activeCollegeInfo.name} (${activeCollegeInfo.abbreviation})
- Established: ${activeCollegeInfo.established} in ${isSvyasa ? "Anekal Taluk, Bengaluru, Karnataka, India" : "beautiful Metro Heights, Sector 12, Innovation City."}
- Motto: ${activeCollegeInfo.motto}
- General helpline: ${activeCollegeInfo.generalHelpline}
- Admissions support email: ${activeCollegeInfo.admissionsMail}
- Academic Units/Programs:
${JSON.stringify(activeCollegeInfo.departments, null, 2)}
- Hostel & Accommodation configurations:
${JSON.stringify(activeCollegeInfo.hostelFacilities, null, 2)}
- Scholarships:
${JSON.stringify(activeCollegeInfo.scholarships, null, 2)}
- Important dates for admission or semesters:
${JSON.stringify(activeCollegeInfo.importantDates, null, 2)}

${
  currentStudent 
  ? `CURRENT IN-SYSTEM AUTHENTICATED STUDENT CONTEXT:
  You are talking to an authenticated student!
  - Student Name: ${currentStudent.name}
  - Student ID: ${currentStudent.id}
  - Major/Course: ${currentStudent.degree} in "${currentStudent.major}"
  - GPA: ${currentStudent.gpa} (out of 4.0)
  - Semester: ${currentStudent.semester}
  - Outstanding balance: ${isSvyasa ? `₹${currentStudent.outstandingBalance}` : `$${currentStudent.outstandingBalance}`}
  - Completed Credits: ${currentStudent.completedCredits} / ${currentStudent.totalCredits}
  - Attendance: ${currentStudent.attendanceRate}%
  - Advisor: ${currentStudent.advisorName}
  You must acknowledge their student status, answer personalized queries correctly, such as their balance, GPA, or GPA recommendations, and address them warmly by name!`
  : "GUEST VISITOR CONTEXT: This is a prospective student or visitor checking fees, programs, or applying."
}

${
  isAdmissionMode && admissionConfig
  ? `ACTIVE PROSPECTIVE STUDENT ADMISSION ADVICE MODE:
  The user is filling out the admissions dashboard checklist or checking career fit.
  User has details: High School GPA: ${admissionConfig.gpa}, Program: ${admissionConfig.program}.
  Skills/Resume Summary: "${admissionConfig.resumeSummary || "None provided"}".
  You MUST write a highly customized, encouraging response that acts as an admissions counselor: evaluate their GPA, explain if they are accepted or awarded the Excellence merit scholarship (cutoff is >=3.8 GPA), suggest the ideal subjects for their skill sets, and outline a custom Career Progression plan tailored to their profile!`
  : ""
}

INSTRUCTIONS:
1. GREET user enthusiastically if they say hi. Introduce yourself.
2. If the user mentions any location or ask where things are, explicitly guide them, write details about that block, and explain they can view its blinking coordinate live on the interactive blueprint screen to the right.
3. Be fully helpful. Do not mention that you have guidelines or context data - appear completely native and all-knowing.
    `;

    // Process custom messages
    const formattedHistory = (chatHistory || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Append the current prompt 
    const finalPrompt = formattedHistory.length > 0
      ? `User's next query: "${message}". Please respond contextually taking above facts into account.`
      : `User's opening query: "${message}". Greet them first and answer.`;

    try {
      if (!apiKey) {
        // Fallback server behavior if API KEY is missing
        let reply = isSvyasa 
          ? `Pranam! I am Saraswati, running in local demonstration mode. I can certainly help you with Swami Vivekananda Yoga Anusandhana Samsthana (S-VYASA) University.`
          : `Greetings! I am Zenia, running in local demonstration mode. I can certainly help you with Zenith Institute of Technology (ZIT).`;
        const q = message.toLowerCase();
        
        if (q.includes("fee") || q.includes("tuition") || q.includes("cost")) {
          if (isSvyasa) {
            reply += `\n\n**Yoga Science Tuition Structure:**\n- Division of Yoga & Life Sciences (M.Sc Therapy): **₹55,000 per semester**.\n- Division of Yoga & Consciousness (B.Sc): **₹45,000 per semester**.\n- BNYS Naturopathy Degree: **₹85,000 per semester**.\n\nWe offer Sattvic Gurukula residency cottages from **₹15,000 per semester** (with ancient lifestyle guidelines, herbal water, and organic crops mess included).`;
          } else {
            reply += `\n\n**Academic Tuition Structure:**\n- School of Computing (CSE/AI-ML): **$12,500 - $13,200 per semester**.\n- School of Advanced Engineering (Robotics/Aerospace): **$11,800 - $12,900 per semester**.\n- School of Design: **$11,200 - $12,800 per semester**.\n\nWe also offer Hostel Accommodations ranging from **$800 to $1,800 per semester**, plus mess charges. Let me know if you would like me to assess if you qualify for our 100% tuition coverage scholarship!`;
          }
        } else if (q.includes("apply") || q.includes("admission") || q.includes("criteria") || q.includes("gpa")) {
          if (isSvyasa) {
            reply += `\n\n**S-VYASA Yoga Enrollment & Scholarships:**\nOur Admissions for the Prashanti batch close on **${SVYASA_COLLEGE_INFO.importantDates.oddSemester.admissionCloses}**. We accept seekers globally.\n\nOur **Vivekananda Spiritual Excellence Grant** grants a **100% Tuition Fee Waiver** to exemplary yogic practitioners with a high-school **GPA of 3.80 or above**! Feel free to submit your credentials on the interactive form.`;
          } else {
            reply += `\n\n**Admissions & Scholarships:**\nOur Admissions close on **${ZENITH_COLLEGE_INFO.importantDates.oddSemester.admissionCloses}**. We require high school credentials. \n\nOur **Excellence Scholarship** awards a **100% Tuition Waiver** to students with a **GPA of 3.90 or above**! You can submit your credentials in the interactive panel on the screen.`;
          }
        } else if (q.includes("location") || q.includes("where") || q.includes("library") || q.includes("hostel") || q.includes("labs") || q.includes("arogyadhama") || q.includes("prayer") || q.includes("cottage")) {
          reply += `\n\nI have detected that you are looking for local directions! Look at the interactive high-resolution canvas on the right side of your dashboard. The **${mappedPin?.buildingName || "requested block"}** has been highlighted with a precise coordinate signal node. ZIT / S-VYASA maps are dynamic!`;
        } else if (currentStudent) {
          if (q.includes("my") || q.includes("balance") || q.includes("outstanding") || q.includes("grade") || q.includes("advisor") || q.includes("gpa")) {
            if (isSvyasa) {
              reply += `\n\nWelcome back, **${currentStudent.name}**!\n- **Sadhana GPA**: ${currentStudent.gpa} (Sem ${currentStudent.semester} M.Sc)\n- **Outstanding Balance**: ₹${currentStudent.outstandingBalance}\n- **Clinical Progress**: Your clinical hours at Arogyadhama are excellent (avg 95% completion).\n- **Academic Guru**: ${currentStudent.advisorName} (${currentStudent.advisorEmail}).\n\nLet me know if you want to clear your pending dues securely!`;
            } else {
              reply += `\n\nWelcome back, **${currentStudent.name}**!\n- **GPA**: ${currentStudent.gpa} (Semester ${currentStudent.semester})\n- **Outstanding Balance**: $${currentStudent.outstandingBalance}\n- **Syllabus Progress**: You are making tremendous progress (avg 75%+ completion).\n- **Academic Advisor**: ${currentStudent.advisorName} (${currentStudent.advisorEmail}).\n\nLet me know if you want to settle the outstanding dues directly through our simulated checkout.`;
            }
          } else {
            reply += `\n\nAs a current student of ${currentStudent.degree}, you have access to academic progress charts and real-time grades. What specific detail can I extract for you today?`;
          }
        } else {
          if (isSvyasa) {
            reply += `\n\nS-VYASA offers prestigious programs in **Yoga & Consciousness**, **Yoga Therapy**, and **Naturopathy (BNYS)**. We have world-class facilities including our 250-bed Arogyadhama Holistic Healing center, and ancient-lifestyle Gurukula cottages. Let me know what you would like to clarify!`;
          } else {
            reply += `\n\nZIT offers prestigious programs in **AI-ML**, **UX Design**, **Robotics**, and **Cyber Security**. We have world-class facilities including our C-Zone Innovation Lab and Emerald Residency complex. Please ask any specific questions!`;
          }
        }

        return res.json({
          reply,
          interactiveMap: mappedPin,
          suggestions: currentStudent 
            ? (isSvyasa ? ["Check my clinical grades", "What is my Gurukula balance?", "Where is Prarthana Hall?", "Settle outstanding fee"] : ["Check my academic charts", "What is my tuition balance?", "Where is the Central Library?", "Settle outstanding fee"])
            : (isSvyasa ? ["View Yoga Therapy Programs", "Vivekananda Scholarships", "Virtual Gurukula tour", "Apply for Yoga course"] : ["View Computing programs", "What scholarships are available?", "Virtual campus tour", "Submit mock Admission application"])
        });
      }

      // Query Gemini!
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { role: "user", parts: [{ text: contextPrompt }] },
          ...formattedHistory,
          { role: "user", parts: [{ text: finalPrompt }] }
        ]
      });

      const replyText = geminiResponse.text || "I apologize, I am processing your request. Please try again.";

      // Dynamically generate some contextual suggestion chips for the user
      let suggestions = isSvyasa 
        ? ["View Yoga & Wellness Programs", "Vivekananda Scholarships", "Where is Arogyadhama Hospital?"]
        : ["View undergraduate fees", "Scholarships & waivers", "Locate Computing lab"];

      if (currentStudent) {
        suggestions = isSvyasa 
          ? ["Check my clinical grades", "What is my Gurukula balance?", "Register Yoga Day Coordinator", "Where is Prarthana Hall?"]
          : ["Check my GPA progress", "Payment transaction logs", "Register AWS Cloud Workshop", "Where is the library?"];
      } else if (isAdmissionMode) {
        suggestions = isSvyasa 
          ? ["Vivekananda Scholarship Eligibility", "Outline Yoga Career roadmap", "Contact Chanakya Block"]
          : ["Am I eligible for 100% waiver?", "Outline CS Career roadmap", "Contact Admissions Block"];
      }

      res.json({
        reply: replyText,
        interactiveMap: mappedPin,
        suggestions
      });

    } catch (error: any) {
      console.error("Gemini API call failure:", error);
      res.status(500).json({ 
        error: "Failed to fetch response from brain system.",
        details: error.message 
      });
    }
  });

  // --- API ROUTE 7: Chatbot Feedback Rating ---
  const chatFeedbackDb: Array<{
    messageId: string;
    text: string;
    rating: 'up' | 'down';
    studentId?: string | null;
    timestamp: string;
  }> = [];

  app.post("/api/chat/rate", (req, res) => {
    const { messageId, text, rating, studentId } = req.body;
    if (!messageId || !rating) {
      return res.status(400).json({ error: "Message ID and rating ('up' | 'down') are required." });
    }
    if (rating !== 'up' && rating !== 'down') {
      return res.status(400).json({ error: "Rating must be 'up' or 'down'." });
    }

    const existingIndex = chatFeedbackDb.findIndex(item => item.messageId === messageId);
    if (existingIndex > -1) {
      chatFeedbackDb[existingIndex].rating = rating;
    } else {
      chatFeedbackDb.push({
        messageId,
        text: text || "",
        rating,
        studentId: studentId || null,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`[Feedback Logged] MsgID: ${messageId} | Rating: ${rating} | Total stored: ${chatFeedbackDb.length}`);
    res.json({ success: true, count: chatFeedbackDb.length, rating });
  });

  app.get("/api/chat/rates", (req, res) => {
    res.json(chatFeedbackDb);
  });

  // --- Serve index.html or handle Vite assets ---
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Dev Server running on http://localhost:${PORT}`);
  });
}

startServer();
