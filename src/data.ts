export type CaseStatus = 'Active' | 'Closed' | 'Pending' | 'On Hold' | 'Archived'
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type CaseType =
  | 'Financial Fraud'
  | 'Cybercrime'
  | 'Homicide'
  | 'Property Crime'
  | 'Drug Trafficking'
  | 'Corruption'
  | 'Terrorism'
  | 'Human Trafficking'
  | 'Civil Dispute'

export interface Case {
  id: string
  title: string
  type: CaseType
  priority: Priority
  status: CaseStatus
  investigator: string
  department: string
  filedDate: string
  lastUpdated: string
  description: string
  location: string
  victims: string[]
  suspects: string[]
  evidenceCount: number
  documentsCount: number
}

export interface Evidence {
  id: string
  caseId: string
  caseName: string
  name: string
  type: 'Document' | 'Image' | 'Video' | 'Audio' | 'Digital' | 'Physical'
  filename: string
  uploadDate: string
  uploadedBy: string
  size: string
  hash: string
  integrityStatus: 'Verified' | 'Pending' | 'Failed'
  custodyStatus: 'In Custody' | 'Transferred' | 'Checked Out'
  status: 'Active' | 'Archived' | 'Flagged'
  description: string
}

export interface Document {
  id: string
  name: string
  type: 'Legal Document' | 'Investigation Report' | 'Statement' | 'Court Document' | 'Evidence Report' | 'FIR'
  caseId: string
  caseName: string
  uploadedBy: string
  date: string
  version: string
  accessLevel: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret'
  size: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Administrator' | 'Investigator' | 'Legal Officer' | 'Evidence Officer' | 'Viewer'
  department: string
  status: 'Active' | 'Inactive' | 'Suspended'
  lastLogin: string
  casesAssigned: number
  joinDate: string
}

export interface AuditEntry {
  id: string
  timestamp: string
  user: string
  action: string
  caseId: string
  resource: string
  ipAddress: string
  device: string
  result: 'Success' | 'Failed' | 'Warning'
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'critical' | 'success'
  title: string
  message: string
  time: string
  read: boolean
  caseId?: string
}

export const CASES: Case[] = [
  {
    id: 'CASE-2024-001',
    title: 'Kumar Financial Fraud Investigation',
    type: 'Financial Fraud',
    priority: 'Critical',
    status: 'Active',
    investigator: 'SI Ramesh Sharma',
    department: 'Economic Offences Wing',
    filedDate: '2024-01-15',
    lastUpdated: '2024-08-27',
    description: 'Systematic financial fraud involving embezzlement of public funds totaling ₹4.2 crore from municipal accounts. Suspect used multiple shell companies to launder proceeds.',
    location: 'Mumbai, Maharashtra',
    victims: ['Municipal Corporation of Mumbai', 'Public Exchequer'],
    suspects: ['Arvind Kumar', 'Priya Mehta', 'Rakesh Joshi'],
    evidenceCount: 24,
    documentsCount: 18,
  },
  {
    id: 'CASE-2024-002',
    title: 'Rajesh Sharma Cybercrime & Data Breach',
    type: 'Cybercrime',
    priority: 'High',
    status: 'Active',
    investigator: 'DSP Anita Verma',
    department: 'Cyber Crime Division',
    filedDate: '2024-02-03',
    lastUpdated: '2024-08-25',
    description: 'Large-scale data breach affecting 2.4 lakh citizens. Attacker exfiltrated Aadhaar-linked records from a state government database. Suspected state-sponsored actor involvement.',
    location: 'Delhi NCR',
    victims: ['2,40,000 Citizens', 'Dept. of IT Services Delhi'],
    suspects: ['Rajesh Sharma (alias RajX)'],
    evidenceCount: 47,
    documentsCount: 31,
  },
  {
    id: 'CASE-2024-003',
    title: 'Mehta vs Singh Property Dispute',
    type: 'Civil Dispute',
    priority: 'Medium',
    status: 'Pending',
    investigator: 'SI Pradeep Gupta',
    department: 'Civil Investigation Unit',
    filedDate: '2024-03-11',
    lastUpdated: '2024-08-20',
    description: 'Disputed ownership of commercial property in South Delhi valued at ₹12 crore. Allegations of forged sale deeds and fraudulent registration.',
    location: 'South Delhi',
    victims: ['Suresh Mehta'],
    suspects: ['Manish Singh', 'Sub-Registrar Office (under inquiry)'],
    evidenceCount: 9,
    documentsCount: 22,
  },
  {
    id: 'CASE-2024-004',
    title: 'Drug Trafficking Network — Operation Kaal',
    type: 'Drug Trafficking',
    priority: 'Critical',
    status: 'Active',
    investigator: 'DySP Vikram Nair',
    department: 'Narcotics Control Bureau',
    filedDate: '2024-04-08',
    lastUpdated: '2024-08-28',
    description: 'Inter-state drug trafficking network operating through darknet markets. 43 kg of methamphetamine seized across three raids. Network links to international cartel suspected.',
    location: 'Pune, Nashik, Hyderabad',
    victims: ['State of Maharashtra', 'State of Telangana'],
    suspects: ['Salim Khan', 'Ganesh Rao', 'Unknown (alias "D")'],
    evidenceCount: 38,
    documentsCount: 27,
  },
  {
    id: 'CASE-2024-005',
    title: 'Corruption in PMAY Scheme — Patna',
    type: 'Corruption',
    priority: 'High',
    status: 'Active',
    investigator: 'SP Kavita Singh',
    department: 'Anti-Corruption Bureau',
    filedDate: '2024-04-22',
    lastUpdated: '2024-08-22',
    description: 'Alleged diversion of PMAY (Pradhan Mantri Awas Yojana) funds. ₹8.7 crore in housing subsidies siphoned through ghost beneficiaries and contractor kickbacks.',
    location: 'Patna, Bihar',
    victims: ['Central Government', '3,200 intended beneficiaries'],
    suspects: ['Block Development Officer Rajan Prasad', 'Contractor Dilip Sinha'],
    evidenceCount: 15,
    documentsCount: 40,
  },
  {
    id: 'CASE-2024-006',
    title: 'Triple Homicide — Sector 18 Noida',
    type: 'Homicide',
    priority: 'Critical',
    status: 'Active',
    investigator: 'DySP Rajan Mishra',
    department: 'Serious Crime Branch',
    filedDate: '2024-05-14',
    lastUpdated: '2024-08-29',
    description: 'Three victims found at a commercial premises. Forensic evidence suggests premeditated attack. CCTV footage under analysis. One primary suspect identified.',
    location: 'Sector 18, Noida, UP',
    victims: ['Amit Saxena (38)', 'Pooja Saxena (35)', 'Karan Saxena (12)'],
    suspects: ['Suresh Narayan'],
    evidenceCount: 62,
    documentsCount: 19,
  },
  {
    id: 'CASE-2024-007',
    title: 'Human Trafficking — Operation Mukti',
    type: 'Human Trafficking',
    priority: 'Critical',
    status: 'Pending',
    investigator: 'SP Deepa Pillai',
    department: 'Special Task Force',
    filedDate: '2024-06-01',
    lastUpdated: '2024-08-15',
    description: 'Organized trafficking network exploiting migrant workers from Jharkhand and Odisha. 28 victims rescued. Network suspected to have placed over 200 victims in bonded labor.',
    location: 'Multiple states: JH, OD, AP, TN',
    victims: ['28 identified victims (ongoing)'],
    suspects: ['Broker network (6 persons arrested)', 'Employer Ramakrishna Industries (under probe)'],
    evidenceCount: 21,
    documentsCount: 35,
  },
  {
    id: 'CASE-2023-089',
    title: 'RTO License Racket — Chennai',
    type: 'Corruption',
    priority: 'Medium',
    status: 'Closed',
    investigator: 'SI Tamil Selvan',
    department: 'Anti-Corruption Bureau',
    filedDate: '2023-11-20',
    lastUpdated: '2024-07-10',
    description: 'Organized racket issuing fraudulent commercial vehicle licenses through RTO officials. 1,240 forged licenses identified. Three RTO clerks and two agents arrested and chargesheeted.',
    location: 'Chennai, Tamil Nadu',
    victims: ['Public / Road Safety'],
    suspects: ['RTO Clerk N. Rajan (convicted)', 'Agent T. Murugan (convicted)'],
    evidenceCount: 33,
    documentsCount: 28,
  },
]

export const EVIDENCE: Evidence[] = [
  {
    id: 'EVD-2024-001-01',
    caseId: 'CASE-2024-001',
    caseName: 'Kumar Financial Fraud Investigation',
    name: 'Bank Transaction Records — HDFC Account',
    type: 'Document',
    filename: 'hdfc_transactions_jan_aug2024.pdf',
    uploadDate: '2024-01-20',
    uploadedBy: 'SI Ramesh Sharma',
    size: '4.2 MB',
    hash: 'a3f9c1e8d2b4f7a6c0e9d3b5f1a2e8c4d7b3f6a9e2c5d8b1f4a7c3e6d9b2f5',
    integrityStatus: 'Verified',
    custodyStatus: 'In Custody',
    status: 'Active',
    description: 'Complete bank transaction records for the suspected shell company account showing irregular transfers.',
  },
  {
    id: 'EVD-2024-001-02',
    caseId: 'CASE-2024-001',
    caseName: 'Kumar Financial Fraud Investigation',
    name: 'CCTV Footage — Municipal Office Entry',
    type: 'Video',
    filename: 'cctv_municipal_2024_01_15.mp4',
    uploadDate: '2024-01-22',
    uploadedBy: 'SI Ramesh Sharma',
    size: '1.87 GB',
    hash: 'b4e0d2f7a1c9e6b3d8f2a5c0e4b7d1f9a3e6c2b8d5f0a4c7e1b6d9f3a2c8e5',
    integrityStatus: 'Verified',
    custodyStatus: 'In Custody',
    status: 'Active',
    description: 'CCTV recording showing suspect Arvind Kumar entering municipal office on day of fund transfer.',
  },
  {
    id: 'EVD-2024-002-01',
    caseId: 'CASE-2024-002',
    caseName: 'Rajesh Sharma Cybercrime & Data Breach',
    name: 'Server Access Logs — State IT Dept',
    type: 'Digital',
    filename: 'server_access_logs_feb2024.tar.gz',
    uploadDate: '2024-02-05',
    uploadedBy: 'DSP Anita Verma',
    size: '892 MB',
    hash: 'c5f1e3a8d0b6e4c2f9a7d3b1e8f4c6a2d9b5f0e3c8a4d1f7b2e9c5a0d6f3b8',
    integrityStatus: 'Verified',
    custodyStatus: 'In Custody',
    status: 'Active',
    description: 'Full server access logs showing unauthorized access patterns and data exfiltration timestamps.',
  },
  {
    id: 'EVD-2024-002-02',
    caseId: 'CASE-2024-002',
    caseName: 'Rajesh Sharma Cybercrime & Data Breach',
    name: 'Malware Sample — Captured Binary',
    type: 'Digital',
    filename: 'malware_sample_QUARANTINE.bin',
    uploadDate: '2024-02-08',
    uploadedBy: 'DSP Anita Verma',
    size: '2.4 MB',
    hash: 'd6a2f4b9e1c7d3a0f8b5e2c9d4f1a6b3e0c7f4a2d9b6e3c0f7a4d1b8e5c2f9',
    integrityStatus: 'Verified',
    custodyStatus: 'In Custody',
    status: 'Flagged',
    description: 'Malware binary extracted from compromised server. Flagged for specialized forensic analysis.',
  },
  {
    id: 'EVD-2024-004-01',
    caseId: 'CASE-2024-004',
    caseName: 'Drug Trafficking Network — Operation Kaal',
    name: 'Seized Narcotics — Sample A',
    type: 'Physical',
    filename: 'lab_analysis_report_A.pdf',
    uploadDate: '2024-04-10',
    uploadedBy: 'DySP Vikram Nair',
    size: '1.1 MB',
    hash: 'e7b3a5c0f2d8e4b1f9a6c3e0d7b4f1a8e5c2f9b6d3a0f7e4c1b8f5a2d9e6c3',
    integrityStatus: 'Verified',
    custodyStatus: 'In Custody',
    status: 'Active',
    description: 'Lab analysis confirming composition and purity of seized substance (methamphetamine, 43.2 kg total).',
  },
  {
    id: 'EVD-2024-006-01',
    caseId: 'CASE-2024-006',
    caseName: 'Triple Homicide — Sector 18 Noida',
    name: 'Forensic Photographs — Crime Scene',
    type: 'Image',
    filename: 'crime_scene_photos_RESTRICTED.zip',
    uploadDate: '2024-05-14',
    uploadedBy: 'DySP Rajan Mishra',
    size: '344 MB',
    hash: 'f8c4b6d1a3e9f5c2a7d4b0e6f3c9a5d2b8f4c1a7e3d0b6f2c8a4e1d7b3f9c5',
    integrityStatus: 'Verified',
    custodyStatus: 'In Custody',
    status: 'Active',
    description: 'Complete crime scene photographic documentation. Restricted access — authorized viewers only.',
  },
]

export const DOCUMENTS: Document[] = [
  {
    id: 'DOC-2024-001',
    name: 'FIR — Kumar Financial Fraud',
    type: 'FIR',
    caseId: 'CASE-2024-001',
    caseName: 'Kumar Financial Fraud Investigation',
    uploadedBy: 'SI Ramesh Sharma',
    date: '2024-01-15',
    version: '1.0',
    accessLevel: 'Restricted',
    size: '340 KB',
  },
  {
    id: 'DOC-2024-002',
    name: 'Forensic Audit Report — HDFC Accounts',
    type: 'Investigation Report',
    caseId: 'CASE-2024-001',
    caseName: 'Kumar Financial Fraud Investigation',
    uploadedBy: 'CA Sunita Rao (Expert)',
    date: '2024-03-20',
    version: '2.1',
    accessLevel: 'Confidential',
    size: '2.8 MB',
  },
  {
    id: 'DOC-2024-003',
    name: 'Cyber Forensics Report — Server Breach',
    type: 'Investigation Report',
    caseId: 'CASE-2024-002',
    caseName: 'Rajesh Sharma Cybercrime & Data Breach',
    uploadedBy: 'DSP Anita Verma',
    date: '2024-02-18',
    version: '1.3',
    accessLevel: 'Confidential',
    size: '5.6 MB',
  },
  {
    id: 'DOC-2024-004',
    name: 'Witness Statement — Rajan Prasad (PMAY)',
    type: 'Statement',
    caseId: 'CASE-2024-005',
    caseName: 'Corruption in PMAY Scheme — Patna',
    uploadedBy: 'SP Kavita Singh',
    date: '2024-05-04',
    version: '1.0',
    accessLevel: 'Restricted',
    size: '820 KB',
  },
  {
    id: 'DOC-2024-005',
    name: 'Chargesheet — Drug Trafficking (Op Kaal)',
    type: 'Court Document',
    caseId: 'CASE-2024-004',
    caseName: 'Drug Trafficking Network — Operation Kaal',
    uploadedBy: 'DySP Vikram Nair',
    date: '2024-06-30',
    version: '1.0',
    accessLevel: 'Restricted',
    size: '1.4 MB',
  },
  {
    id: 'DOC-2024-006',
    name: 'Autopsy Report — Saxena Family',
    type: 'Investigation Report',
    caseId: 'CASE-2024-006',
    caseName: 'Triple Homicide — Sector 18 Noida',
    uploadedBy: 'Dr. Priya Sharma (AIIMS Forensics)',
    date: '2024-05-16',
    version: '1.0',
    accessLevel: 'Top Secret',
    size: '3.2 MB',
  },
  {
    id: 'DOC-2024-007',
    name: 'Property Documents — Mehta vs Singh',
    type: 'Legal Document',
    caseId: 'CASE-2024-003',
    caseName: 'Mehta vs Singh Property Dispute',
    uploadedBy: 'SI Pradeep Gupta',
    date: '2024-03-12',
    version: '1.0',
    accessLevel: 'Restricted',
    size: '6.1 MB',
  },
]

export const USERS: User[] = [
  {
    id: 'USR-001',
    name: 'ACP Rajendra Singh',
    email: 'rajendra.singh@sdms.gov.in',
    role: 'Administrator',
    department: 'Headquarters',
    status: 'Active',
    lastLogin: '2024-08-29 09:14',
    casesAssigned: 0,
    joinDate: '2019-06-01',
  },
  {
    id: 'USR-002',
    name: 'SI Ramesh Sharma',
    email: 'ramesh.sharma@sdms.gov.in',
    role: 'Investigator',
    department: 'Economic Offences Wing',
    status: 'Active',
    lastLogin: '2024-08-29 08:32',
    casesAssigned: 3,
    joinDate: '2021-03-15',
  },
  {
    id: 'USR-003',
    name: 'DSP Anita Verma',
    email: 'anita.verma@sdms.gov.in',
    role: 'Investigator',
    department: 'Cyber Crime Division',
    status: 'Active',
    lastLogin: '2024-08-28 18:45',
    casesAssigned: 2,
    joinDate: '2020-08-20',
  },
  {
    id: 'USR-004',
    name: 'Adv. Meera Nair',
    email: 'meera.nair@sdms.gov.in',
    role: 'Legal Officer',
    department: 'Legal Cell',
    status: 'Active',
    lastLogin: '2024-08-29 10:05',
    casesAssigned: 4,
    joinDate: '2022-01-10',
  },
  {
    id: 'USR-005',
    name: 'HC Sunil Tiwari',
    email: 'sunil.tiwari@sdms.gov.in',
    role: 'Evidence Officer',
    department: 'Evidence Management Unit',
    status: 'Active',
    lastLogin: '2024-08-27 14:20',
    casesAssigned: 0,
    joinDate: '2020-11-05',
  },
  {
    id: 'USR-006',
    name: 'SP Kavita Singh',
    email: 'kavita.singh@sdms.gov.in',
    role: 'Investigator',
    department: 'Anti-Corruption Bureau',
    status: 'Active',
    lastLogin: '2024-08-28 11:30',
    casesAssigned: 2,
    joinDate: '2018-07-22',
  },
  {
    id: 'USR-007',
    name: 'Priya Chandrasekaran',
    email: 'priya.c@sdms.gov.in',
    role: 'Viewer',
    department: 'Ministry of Home Affairs (Observer)',
    status: 'Active',
    lastLogin: '2024-08-26 09:00',
    casesAssigned: 0,
    joinDate: '2024-01-15',
  },
  {
    id: 'USR-008',
    name: 'DySP Rajan Mishra',
    email: 'rajan.mishra@sdms.gov.in',
    role: 'Investigator',
    department: 'Serious Crime Branch',
    status: 'Active',
    lastLogin: '2024-08-29 07:58',
    casesAssigned: 1,
    joinDate: '2017-04-11',
  },
]

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'AUD-001', timestamp: '2024-08-29 10:32:14', user: 'DSP Anita Verma', action: 'Evidence Uploaded', caseId: 'CASE-2024-002', resource: 'EVD-2024-002-02', ipAddress: '10.0.14.22', device: 'WIN-CCD-014', result: 'Success' },
  { id: 'AUD-002', timestamp: '2024-08-29 09:48:07', user: 'SI Ramesh Sharma', action: 'Case Updated', caseId: 'CASE-2024-001', resource: 'CASE-2024-001', ipAddress: '10.0.12.07', device: 'WIN-EOW-012', result: 'Success' },
  { id: 'AUD-003', timestamp: '2024-08-29 09:14:35', user: 'ACP Rajendra Singh', action: 'User Login', caseId: 'N/A', resource: 'USR-001', ipAddress: '10.0.10.01', device: 'WIN-HQ-001', result: 'Success' },
  { id: 'AUD-004', timestamp: '2024-08-29 08:55:22', user: 'UNKNOWN', action: 'Login Failed (3x)', caseId: 'N/A', resource: 'USR-004', ipAddress: '203.0.113.44', device: 'Unknown Device', result: 'Failed' },
  { id: 'AUD-005', timestamp: '2024-08-28 17:30:10', user: 'SP Kavita Singh', action: 'Document Accessed', caseId: 'CASE-2024-005', resource: 'DOC-2024-004', ipAddress: '10.0.15.09', device: 'WIN-ACB-015', result: 'Success' },
  { id: 'AUD-006', timestamp: '2024-08-28 16:12:44', user: 'HC Sunil Tiwari', action: 'Evidence Integrity Check', caseId: 'CASE-2024-004', resource: 'EVD-2024-004-01', ipAddress: '10.0.20.03', device: 'WIN-EMU-020', result: 'Success' },
  { id: 'AUD-007', timestamp: '2024-08-28 14:00:18', user: 'DySP Vikram Nair', action: 'Evidence Downloaded', caseId: 'CASE-2024-004', resource: 'EVD-2024-004-01', ipAddress: '10.0.16.11', device: 'WIN-NCB-016', result: 'Warning' },
  { id: 'AUD-008', timestamp: '2024-08-28 11:22:01', user: 'Adv. Meera Nair', action: 'Document Uploaded', caseId: 'CASE-2024-001', resource: 'DOC-2024-002', ipAddress: '10.0.11.05', device: 'WIN-LC-011', result: 'Success' },
  { id: 'AUD-009', timestamp: '2024-08-27 15:41:33', user: 'DySP Rajan Mishra', action: 'Case Status Updated', caseId: 'CASE-2024-006', resource: 'CASE-2024-006', ipAddress: '10.0.13.18', device: 'WIN-SCB-013', result: 'Success' },
  { id: 'AUD-010', timestamp: '2024-08-27 09:05:52', user: 'SYSTEM', action: 'Scheduled Integrity Scan', caseId: 'ALL', resource: 'Evidence Repository', ipAddress: '127.0.0.1', device: 'SDMS-SRV-01', result: 'Success' },
]

export const NOTIFICATIONS: Notification[] = [
  { id: 'N-001', type: 'critical', title: 'Unauthorized Access Attempt', message: 'Account USR-004 (Adv. Meera Nair) experienced 3 failed login attempts from external IP 203.0.113.44. Account temporarily locked.', time: '11 min ago', read: false, caseId: undefined },
  { id: 'N-002', type: 'warning', title: 'Evidence Integrity Alert', message: 'Evidence EVD-2024-002-02 (Malware Sample) flagged for re-verification after transfer. Please review chain of custody.', time: '1 hr ago', read: false, caseId: 'CASE-2024-002' },
  { id: 'N-003', type: 'info', title: 'New Evidence Uploaded', message: 'SI Ramesh Sharma uploaded 2 new evidence items to CASE-2024-001 (Kumar Financial Fraud Investigation).', time: '3 hrs ago', read: false, caseId: 'CASE-2024-001' },
  { id: 'N-004', type: 'warning', title: 'Case Deadline Approaching', message: 'CASE-2024-003 (Mehta vs Singh) has a court hearing scheduled for 2024-09-05. Ensure all documents are submitted.', time: '6 hrs ago', read: true, caseId: 'CASE-2024-003' },
  { id: 'N-005', type: 'success', title: 'Case Closed', message: 'CASE-2023-089 (RTO License Racket) has been officially closed. Chargesheet accepted by court. Final report archived.', time: '2 days ago', read: true, caseId: 'CASE-2023-089' },
  { id: 'N-006', type: 'critical', title: 'High-Priority Case Update', message: 'New suspect identified in CASE-2024-006 (Triple Homicide). DNA evidence matches database record. Arrest warrant issued.', time: '3 days ago', read: true, caseId: 'CASE-2024-006' },
  { id: 'N-007', type: 'info', title: 'System Maintenance', message: 'Scheduled system maintenance on 2024-09-01 from 02:00–04:00 IST. System will be in read-only mode during this period.', time: '3 days ago', read: true },
]

export const TIMELINE_EVENTS = [
  { id: 'TL-001', date: '2024-08-29', time: '10:32', investigator: 'DSP Anita Verma', action: 'Evidence Uploaded', description: 'Uploaded malware binary sample (EVD-2024-002-02) captured from compromised server for forensic analysis.', caseId: 'CASE-2024-002', relatedEvidence: 'EVD-2024-002-02', verified: true },
  { id: 'TL-002', date: '2024-08-28', time: '17:30', investigator: 'SP Kavita Singh', action: 'Witness Statement Recorded', description: 'Recorded statement from key witness in PMAY corruption case. Statement corroborates earlier documentary evidence.', caseId: 'CASE-2024-005', relatedEvidence: 'DOC-2024-004', verified: true },
  { id: 'TL-003', date: '2024-08-27', time: '09:05', investigator: 'SYSTEM', action: 'Integrity Scan Completed', description: 'Automated SHA-256 integrity verification completed for all 198 evidence items. All verified successfully.', caseId: 'ALL', relatedEvidence: null, verified: true },
  { id: 'TL-004', date: '2024-08-26', time: '14:15', investigator: 'DySP Vikram Nair', action: 'Suspect Arrested', description: 'Second suspect Ganesh Rao arrested in Operation Kaal. Produced before magistrate. 7-day police custody granted.', caseId: 'CASE-2024-004', relatedEvidence: null, verified: true },
  { id: 'TL-005', date: '2024-08-22', time: '11:00', investigator: 'DySP Rajan Mishra', action: 'Forensic Report Received', description: 'DNA analysis report received from CFSL confirms match with suspect Suresh Narayan in Sector 18 homicide.', caseId: 'CASE-2024-006', relatedEvidence: 'EVD-2024-006-01', verified: true },
  { id: 'TL-006', date: '2024-08-15', time: '08:45', investigator: 'SP Deepa Pillai', action: 'Victims Transferred', description: 'Rescued trafficking victims transferred to state-run shelter homes under Operation Mukti. Medical evaluation underway.', caseId: 'CASE-2024-007', relatedEvidence: null, verified: true },
]
