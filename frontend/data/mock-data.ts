// ── Types ────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone-screen"
  | "interviewing"
  | "assessment"
  | "final-round"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "accepted";

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export type WorkMode = "remote" | "hybrid" | "on-site";

export interface Interview {
  id: string;
  type:
    | "phone-screen"
    | "technical"
    | "behavioral"
    | "final-round"
    | "panel"
    | "other";
  date: string;
  time?: string;
  interviewer?: string;
  status: "scheduled" | "completed" | "cancelled";
  outcome?: "passed" | "failed" | "pending" | "no-response";
  notes?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: ApplicationStatus;
  dateApplied: string;
  source: string;
  contactName?: string;
  contactEmail?: string;
  jobUrl?: string;
  notes?: string;
  tags?: string[];
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const mockJobApplications: JobApplication[] = [
  // 1. SAVED — not applied yet, just bookmarked
  {
    id: "1",
    company: "NovaTech",
    title: "Senior Frontend Developer",
    location: "Austin, TX",
    workMode: "hybrid",
    jobType: "full-time",
    salaryMin: 130000,
    salaryMax: 170000,
    currency: "USD",
    status: "saved",
    dateApplied: "",
    source: "linkedin",
    notes: "Looks interesting — plan to tailor resume and apply next week.",
    tags: ["dream-job", "react"],
    interviews: [],
    createdAt: "2025-08-25T09:00:00Z",
    updatedAt: "2025-08-25T09:00:00Z",
  },

  // 2. APPLIED — submitted application, waiting to hear back
  {
    id: "2",
    company: "Apex Digital",
    title: "Full Stack Engineer",
    location: "Remote",
    workMode: "remote",
    jobType: "full-time",
    salaryMin: 110000,
    salaryMax: 150000,
    currency: "USD",
    status: "applied",
    dateApplied: "2025-08-22",
    source: "company-site",
    contactName: "Alex Rivera",
    contactEmail: "careers@apexdigital.io",
    jobUrl: "https://apexdigital.io/careers/fullstack",
    notes: "Applied through company careers page. Used tailored resume.",
    tags: ["remote-only"],
    interviews: [],
    createdAt: "2025-08-22T14:30:00Z",
    updatedAt: "2025-08-22T14:30:00Z",
  },

  // 3. PHONE-SCREEN — phone screen completed, waiting for next steps
  {
    id: "3",
    company: "Meridian Health",
    title: "Data Analyst",
    location: "New York, NY",
    workMode: "on-site",
    jobType: "full-time",
    salaryMin: 90000,
    salaryMax: 120000,
    currency: "USD",
    status: "phone-screen",
    dateApplied: "2025-08-10",
    source: "linkedin",
    contactName: "Priya Sharma",
    contactEmail: "p.sharma@meridianhealth.com",
    jobUrl: "https://meridianhealth.com/careers/data-analyst",
    notes: "Phone screen went well. Discussed SQL and Python experience. Waiting for feedback.",
    tags: ["healthcare", "data"],
    interviews: [
      {
        id: "int-3a",
        type: "phone-screen",
        date: "2025-08-18",
        time: "11:00 AM EST",
        interviewer: "Priya Sharma (HR)",
        status: "completed",
        outcome: "pending",
        notes: "30-min call. Covered background, role expectations, and team structure.",
      },
    ],
    createdAt: "2025-08-10T08:15:00Z",
    updatedAt: "2025-08-18T11:45:00Z",
  },

  // 4. INTERVIEWING — active interview loop, technical round next
  {
    id: "4",
    company: "Quantum Labs",
    title: "Machine Learning Engineer",
    location: "San Francisco, CA",
    workMode: "hybrid",
    jobType: "full-time",
    salaryMin: 150000,
    salaryMax: 200000,
    currency: "USD",
    status: "interviewing",
    dateApplied: "2025-08-05",
    source: "referral",
    contactName: "Marcus Lee",
    contactEmail: "marcus@quantumlabs.ai",
    jobUrl: "https://quantumlabs.ai/careers/ml-engineer",
    notes: "Referred by Marcus from the PyTorch meetup. Phone screen passed — technical interview scheduled.",
    tags: ["ai-ml", "dream-job"],
    interviews: [
      {
        id: "int-4a",
        type: "phone-screen",
        date: "2025-08-12",
        time: "2:00 PM PST",
        interviewer: "Sarah Chen (Recruiter)",
        status: "completed",
        outcome: "passed",
        notes: "General screening. Moved to technical round.",
      },
      {
        id: "int-4b",
        type: "technical",
        date: "2025-09-02",
        time: "10:00 AM PST",
        interviewer: "Dr. Wei Zhang (ML Lead)",
        status: "scheduled",
        notes: "2-hour system design + coding challenge on ML pipeline design.",
      },
    ],
    createdAt: "2025-08-05T10:00:00Z",
    updatedAt: "2025-08-28T16:00:00Z",
  },

  // 5. ASSESSMENT — take-home assignment in progress
  {
    id: "5",
    company: "BuildRight Inc",
    title: "Backend Developer",
    location: "Seattle, WA",
    workMode: "remote",
    jobType: "full-time",
    salaryMin: 120000,
    salaryMax: 155000,
    currency: "USD",
    status: "assessment",
    dateApplied: "2025-08-08",
    source: "linkedin",
    contactName: "Tom Garcia",
    contactEmail: "tom.g@buildright.dev",
    jobUrl: "https://buildright.dev/jobs/backend-dev",
    notes: "Phone screen passed. Take-home assessment due Sept 5.",
    tags: ["remote-only", "golang"],
    interviews: [
      {
        id: "int-5a",
        type: "phone-screen",
        date: "2025-08-15",
        time: "3:00 PM PST",
        interviewer: "Tom Garcia (Eng Manager)",
        status: "completed",
        outcome: "passed",
        notes: "Good discussion on distributed systems experience.",
      },
    ],
    createdAt: "2025-08-08T09:30:00Z",
    updatedAt: "2025-08-20T17:00:00Z",
  },

  // 6. FINAL-ROUND — last interview scheduled
  {
    id: "6",
    company: "CloudScale",
    title: "DevOps Engineer",
    location: "Denver, CO",
    workMode: "hybrid",
    jobType: "full-time",
    salaryMin: 125000,
    salaryMax: 160000,
    currency: "USD",
    status: "final-round",
    dateApplied: "2025-07-28",
    source: "company-site",
    contactName: "Rachel Kim",
    contactEmail: "rachel@cloudscale.io",
    jobUrl: "https://cloudscale.io/careers/devops",
    notes: "Both phone screen and technical went well. Final round with VP of Engineering.",
    tags: ["infrastructure", "aws"],
    interviews: [
      {
        id: "int-6a",
        type: "phone-screen",
        date: "2025-08-04",
        time: "9:00 AM MST",
        interviewer: "Rachel Kim (HR)",
        status: "completed",
        outcome: "passed",
        notes: "Initial screening — discussed Kubernetes and CI/CD experience.",
      },
      {
        id: "int-6b",
        type: "technical",
        date: "2025-08-14",
        time: "1:00 PM MST",
        interviewer: "James Park (Senior DevOps)",
        status: "completed",
        outcome: "passed",
        notes: "Deep-dive into infrastructure-as-code and incident response scenarios.",
      },
      {
        id: "int-6c",
        type: "final-round",
        date: "2025-09-08",
        time: "11:00 AM MST",
        interviewer: "VP of Engineering",
        status: "scheduled",
        notes: "Culture fit and leadership discussion.",
      },
    ],
    createdAt: "2025-07-28T11:00:00Z",
    updatedAt: "2025-08-20T14:30:00Z",
  },

  // 7. OFFER — offer received, reviewing
  {
    id: "7",
    company: "GreenField Tech",
    title: "React Developer",
    location: "Remote",
    workMode: "remote",
    jobType: "full-time",
    salaryMin: 140000,
    salaryMax: 160000,
    currency: "USD",
    status: "offer",
    dateApplied: "2025-07-15",
    source: "linkedin",
    contactName: "Emily Davis",
    contactEmail: "emily@greenfieldtech.com",
    jobUrl: "https://greenfieldtech.com/careers/react-dev",
    notes: "Offer received: $140k-$160k + equity. Reviewing comp package. Deadline Sept 10.",
    tags: ["remote-only", "react", "offer-deadline-sept-10"],
    interviews: [
      {
        id: "int-7a",
        type: "phone-screen",
        date: "2025-07-22",
        time: "10:00 AM EST",
        interviewer: "Emily Davis (Talent)",
        status: "completed",
        outcome: "passed",
        notes: "Quick intro call. Moved to technical.",
      },
      {
        id: "int-7b",
        type: "technical",
        date: "2025-07-30",
        time: "2:00 PM EST",
        interviewer: "Dan Wilson (Tech Lead)",
        status: "completed",
        outcome: "passed",
        notes: "React coding challenge + architecture discussion.",
      },
      {
        id: "int-7c",
        type: "behavioral",
        date: "2025-08-06",
        time: "11:00 AM EST",
        interviewer: "Sarah Johnson (Engineering Manager)",
        status: "completed",
        outcome: "passed",
        notes: "Team fit and leadership principles.",
      },
    ],
    createdAt: "2025-07-15T08:00:00Z",
    updatedAt: "2025-08-28T09:00:00Z",
  },

  // 8. REJECTED — did not pass
  {
    id: "8",
    company: "DataStream AI",
    title: "Backend Engineer",
    location: "New York, NY",
    workMode: "hybrid",
    jobType: "full-time",
    salaryMin: 130000,
    salaryMax: 170000,
    currency: "USD",
    status: "rejected",
    dateApplied: "2025-07-20",
    source: "linkedin",
    contactName: "Chris Wu",
    contactEmail: "cwu@datastream.ai",
    jobUrl: "https://datastream.ai/careers/backend",
    notes: "Rejected after technical interview. Feedback: system design needed improvement.",
    tags: ["ai-ml"],
    interviews: [
      {
        id: "int-8a",
        type: "phone-screen",
        date: "2025-07-28",
        time: "3:00 PM EST",
        interviewer: "HR Recruiter",
        status: "completed",
        outcome: "passed",
        notes: "Moved to technical round.",
      },
      {
        id: "int-8b",
        type: "technical",
        date: "2025-08-05",
        time: "1:00 PM EST",
        interviewer: "Staff Engineer",
        status: "completed",
        outcome: "failed",
        notes: "Struggled with distributed system design. Coding portion went okay.",
      },
    ],
    createdAt: "2025-07-20T13:00:00Z",
    updatedAt: "2025-08-10T10:00:00Z",
  },

  // 9. WITHDRAWN — applicant withdrew
  {
    id: "9",
    company: "OldBank Corp",
    title: "Full Stack Developer",
    location: "Chicago, IL",
    workMode: "on-site",
    jobType: "full-time",
    salaryMin: 100000,
    salaryMax: 130000,
    currency: "USD",
    status: "withdrawn",
    dateApplied: "2025-07-10",
    source: "company-site",
    contactName: "Mike Johnson",
    contactEmail: "mjohnson@oldbank.com",
    jobUrl: "https://oldbank.com/careers/fullstack",
    notes: "Withdrew — accepted an offer elsewhere before final round.",
    tags: ["finance"],
    interviews: [
      {
        id: "int-9a",
        type: "phone-screen",
        date: "2025-07-18",
        time: "10:00 AM CST",
        interviewer: "Mike Johnson (HR)",
        status: "completed",
        outcome: "passed",
        notes: "Moved forward.",
      },
      {
        id: "int-9b",
        type: "technical",
        date: "2025-07-28",
        time: "2:00 PM CST",
        interviewer: "Senior Developer",
        status: "cancelled",
        notes: "Cancelled — withdrew application.",
      },
    ],
    createdAt: "2025-07-10T09:00:00Z",
    updatedAt: "2025-07-25T16:00:00Z",
  },

  // 10. ACCEPTED — offer accepted, starting soon
  {
    id: "10",
    company: "StartupXYZ",
    title: "Frontend Engineer",
    location: "Remote",
    workMode: "remote",
    jobType: "full-time",
    salaryMin: 115000,
    salaryMax: 140000,
    currency: "USD",
    status: "accepted",
    dateApplied: "2025-06-20",
    source: "referral",
    contactName: "Lisa Chang",
    contactEmail: "lisa@startupxyz.com",
    jobUrl: "https://startupxyz.com/careers/frontend",
    notes: "Accepted offer! Start date Sept 15. Relocation package included.",
    tags: ["startup", "react", "accepted-start-sept-15"],
    interviews: [
      {
        id: "int-10a",
        type: "phone-screen",
        date: "2025-06-27",
        time: "11:00 AM PST",
        interviewer: "Lisa Chang (HR)",
        status: "completed",
        outcome: "passed",
        notes: "Great vibe. Moved to technical.",
      },
      {
        id: "int-10b",
        type: "technical",
        date: "2025-07-05",
        time: "1:00 PM PST",
        interviewer: "CTO",
        status: "completed",
        outcome: "passed",
        notes: "Built a mini feature live. Good discussion on architecture.",
      },
      {
        id: "int-10c",
        type: "behavioral",
        date: "2025-07-10",
        time: "10:00 AM PST",
        interviewer: "Head of Engineering",
        status: "completed",
        outcome: "passed",
        notes: "Culture fit — values aligned well.",
      },
    ],
    createdAt: "2025-06-20T08:00:00Z",
    updatedAt: "2025-08-01T15:00:00Z",
  },
];
