Design a modern, professional, secure web application frontend for a **“Secure Digital Management System for Legal and Investigation”**.

The system is designed for authorized law-enforcement/legal investigation teams to securely manage cases, evidence, documents, investigators, and case activities.

### Overall Design
- Professional government/legal technology style
- Clean, modern, trustworthy, and minimal interface
- Desktop-first responsive web application
- Use a professional dark blue/navy and white/neutral visual style
- Clear typography and strong visual hierarchy
- Avoid excessive animations or decorative elements
- Prioritize usability, security, and accessibility
- Use realistic sample data, but clearly label it as demo data

### 1. Login Page
Create a secure login screen containing:
- System logo/name: “Secure Digital Management System”
- Email/Username field
- Password field
- Show/hide password option
- CAPTCHA/verification placeholder
- “Login” button
- Forgot password option
- Security notice
- Optional 2-factor authentication screen after login

### 2. Main Dashboard
Create a dashboard showing:
- Total active cases
- Closed cases
- Pending investigations
- High-priority cases
- Evidence items
- Recent case activity
- Recent alerts/notifications
- Case status chart
- Investigation activity timeline
- Quick actions such as:
  - Create New Case
  - Upload Evidence
  - Search Case
  - Generate Report

### 3. Case Management
Create a dedicated case-management page with:
- Search bar
- Filters for case status, priority, investigator, and date
- Case ID
- Case title
- Case type
- Priority
- Assigned investigator
- Status
- Last updated date
- View case button

Create a detailed case page containing:
- Case overview
- Case description
- Victim/complainant information
- Suspect information
- Assigned investigators
- Important dates
- Case status
- Related documents
- Evidence
- Investigation timeline
- Notes
- Activity/audit history

### 4. Digital Evidence Management
Create a secure evidence-management interface.

Include:
- Evidence ID
- Evidence type
- File name
- Upload date
- Uploaded by
- Related case
- Evidence status
- Hash/integrity status
- Chain-of-custody status

Create an evidence-detail page showing:
- Evidence metadata
- File preview placeholder
- SHA-256 hash
- Upload timestamp
- Uploaded by
- Chain-of-custody timeline
- Every access/download/transfer event
- Integrity verification indicator
- “Verify Integrity” button

### 5. Document Management
Create a secure document-management page for:
- Legal documents
- Investigation reports
- Statements
- Court documents
- Evidence-related documents

Include:
- Document name
- Document type
- Case ID
- Uploaded by
- Date
- Version
- Access level
- Search/filter functionality

### 6. Investigation Timeline
Create a visual timeline showing important case events.

Each event should contain:
- Date and time
- Investigator/user
- Action performed
- Description
- Related evidence/document
- Timestamp
- Verification/integrity indicator

### 7. User & Role Management
Create an admin page for authorized users.

Include:
- User name
- User ID
- Role
- Department
- Account status
- Last login
- Permissions

Support role-based access concepts such as:
- Administrator
- Investigator
- Legal Officer
- Evidence Officer
- Viewer

Include an interface for assigning permissions.

### 8. Audit Log
Create a detailed audit-log page showing:
- Timestamp
- User
- Action
- Case ID
- Resource affected
- IP/device placeholder
- Result/status

Add filters for:
- User
- Action
- Date
- Case
- Resource

### 9. Notifications & Alerts
Create a notification center showing:
- New evidence uploaded
- Case status changes
- Unauthorized access attempts
- Evidence integrity warnings
- Important deadlines
- System/security alerts

Use different visual indicators for normal notifications, warnings, and critical security alerts.

### 10. Reports
Create a reporting dashboard where authorized users can:
- Generate case reports
- Generate investigation reports
- Generate evidence reports
- View case statistics
- Export reports as PDF/CSV

### 11. Search
Create a global search interface that can search:
- Case ID
- Case name
- Evidence ID
- Document name
- Investigator
- Suspect
- Keywords

Display results in categorized sections.

### 12. Security Features
Visually represent security features throughout the interface:
- Role-Based Access Control (RBAC)
- Secure authentication
- Two-factor authentication
- SHA-256 evidence hashing
- Digital evidence integrity verification
- Chain of custody
- Immutable audit logs
- Access control
- Activity monitoring

Do NOT claim that the UI itself provides encryption or blockchain security unless implemented by the backend. These should be represented as system features/placeholders.

### Navigation
Create a left sidebar containing:
- Dashboard
- Cases
- Evidence
- Documents
- Investigations
- Reports
- Audit Logs
- Notifications
- Users & Roles
- Settings

Include:
- User profile
- Role indicator
- Logout button

### Important UX Requirements
- Make the interface easy for investigators and legal staff to understand.
- Use tables for case/evidence/document records.
- Use cards for dashboard statistics.
- Use timelines for chain-of-custody and investigation history.
- Use confirmation dialogs for sensitive actions.
- Clearly distinguish read-only and editable information.
- Show empty states, loading states, success messages, warnings, and error states.
- Include confirmation before deleting or modifying sensitive records.
- Make the design suitable for a real-world professional investigation-management system.

Create a complete clickable prototype covering the main user flow:

**Login → Dashboard → Cases → Case Details → Evidence → Evidence Details → Chain of Custody → Documents → Investigation Timeline → Reports → Audit Logs → User Management**

Generate consistent reusable components, buttons, forms, tables, cards, modals, navigation, alerts, and status badges throughout the design.