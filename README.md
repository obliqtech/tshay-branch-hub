# Tshay Bank Hub

Build a professional, modern, responsive Bank Branch Employee Performance Management System called TSHAY BANK.

IMPORTANT:

This is currently a FRONTEND/UI prototype.

Do not build the backend yet.

Do not use Laravel.

Later, this frontend will be connected to a PHP + MySQL backend.

Structure the frontend cleanly so API/database integration can be added later.

Use realistic mock data for now.

Every page must use the exact same design system, navigation, colors, spacing, typography, buttons, forms, tables, cards, alerts, and responsive behavior.

The application must work perfectly on desktop, laptop, tablet, and mobile.

1. DESIGN STYLE

Create a premium enterprise banking dashboard.

Design characteristics:

Professional

Clean

Minimal

Modern

Trustworthy

Financial/banking aesthetic

Not flashy

Excellent whitespace

Clear information hierarchy

Easy to use for bank employees

Accessible and readable

Primary color:

Deep navy / professional banking blue

Supporting colors:

White

Very light gray background

Dark charcoal text

Medium blue

Green for success

Amber for warnings

Red for errors/danger

Use consistent rounded corners, subtle shadows, thin borders, and professional typography.

Do NOT use excessive gradients, neon colors, cartoon illustrations, or overly decorative elements.

2. RESPONSIVE DESIGN

The entire application must be responsive.

Support:

Mobile phones: 320px+

Tablets: 768px+

Laptops: 1024px+

Desktop: 1440px+

Large screens

Desktop:

Fixed/collapsible left sidebar

Top navigation bar

Main content area

Mobile:

Sidebar becomes a slide-out navigation drawer

Hamburger menu in the top bar

Cards stack vertically

Tables become responsive

Forms become single-column

Charts resize correctly

Buttons remain touch-friendly

No horizontal page overflow

3. APPLICATION LAYOUT

Desktop layout:

LEFT SIDEBAR

TSHAY BANK logo

Dashboard

Employees

Goals

Targets

Customers

Accounts

Activities

Performance

Reports

Audit Logs

Settings

Logout

TOP BAR

Page title/breadcrumb

Search where appropriate

Notification icon

User profile

User role

Mobile menu button

MAIN CONTENT

Page title

Optional subtitle

Action buttons

Cards

Tables

Charts

Forms

4. LOGIN PAGE

Create a professional standalone login page.

Layout:

Full-screen responsive layout

Banking-themed but subtle background

TSHAY BANK logo

"Branch Performance System"

Welcome message

Login card:

Username input

Password input

Password show/hide icon

Remember me checkbox

Forgot password link

Login button

Loading state

Validation/error state

Example text:

TSHAY BANK Branch Performance System

Welcome back Sign in to continue to your account.

Username Password

Remember me Forgot password?

LOGIN

Add a small professional footer.

On mobile, make the login card nearly full width with appropriate padding.

5. BRANCH ADMIN DASHBOARD

Create a premium dashboard.

Header:

Dashboard Welcome back, Branch Admin

KPI cards:

Total Deposit Example: 25,000,000 ETB

Total Customers Example: 1,240

Employees Example: 32

Target Achievement Example: 78%

Each card should have:

Icon

Label

Large value

Small comparison/trend indicator

Consistent design

FINANCIAL PERFORMANCE section:

Show:

Total Deposit

Conventional Deposit

IFB Deposit

Conventional %

IFB %

Create a professional chart showing deposit performance.

PERFORMANCE OVERVIEW:

Create a chart comparing employee performance.

Example: Employee | Achievement Abebe | 92% Hana | 87% Mohammed | 81% Sara | 76%

RECENT ACTIVITIES:

Responsive table:

Employee Customer Activity Goal Amount Status Date

Example rows: Abebe | Ahmed Ali | IFB Deposit | IFB Deposit | 50,000 ETB | Approved | Today Hana | Sara Mohammed | Mobile Banking | Mobile Banking | — | Approved | Today

Use badges: Approved = green Pending = amber Rejected = red

6. EMPLOYEES PAGE

Create an employee management page.

Header: Employees Manage branch employees

Button:

Add Employee

Stats:

Total Employees

Active

Inactive

Search: Search employee...

Filters:

Status

Role

Table: Employee Code Name Phone Role Status Joined Actions

Actions:

View

Edit

Deactivate

More

Create an attractive Add Employee modal/page with:

First name

Last name

Username

Email

Phone

Employee code

Role

Status

Password

Use strong form validation UI.

7. GOALS PAGE

Create goal management.

Header: Goals Manage branch performance goals

Button:

Create Goal

Goal cards/table should show:

Goal Category Measurement Status Description Actions

Examples:

Conventional Deposit Financial Amount Active

IFB Deposit Financial Amount Active

Conventional Customer Non-Financial Count Active

IFB Customer Non-Financial Count Active

Mobile Banking Non-Financial Count Active

Internet Banking Non-Financial Count Active

Card Banking Non-Financial Count Active

QR Banking Non-Financial Count Active

8. TARGETS PAGE

Create employee target management.

Header: Employee Targets

Filters:

Employee

Goal

Period

Status

Button:

Assign Target

Table:

Employee Goal Period Target Achieved Remaining Achievement Status Actions

Examples:

Abebe Conventional Deposit Monthly 10,000,000 ETB 7,200,000 ETB 2,800,000 ETB 72%

Hana Mobile Banking Monthly 100 85 15 85%

Use professional progress bars.

9. CUSTOMERS PAGE

Header: Customers

Button:

Register Customer

Stats:

Total Customers

Conventional

IFB

Search customer.

Table:

Full Name Phone Identification Type Branch Registered By Status Registered Date Actions

Customer details page/modal should show:

Full name

Phone

Identification type

Accounts

Activities

Registered employee

10. ACCOUNTS PAGE

Header: Accounts

Filters:

Conventional

IFB

Active

Closed

Blocked

Table:

Account Number Customer Banking Type Account Type Opening Amount Opened By Opened Date Status Actions

Use professional banking account badges.

11. ACTIVITIES PAGE

Header: Activities

Show activity records.

Filters:

Employee

Goal

Activity type

Status

Date range

Table:

Employee Customer Account Activity Goal Amount Business Type Date Status Actions

Activity types:

Deposit Customer Registration Mobile Banking Internet Banking Card Banking QR Banking

Create activity form with dynamic fields.

For example: If activity = Deposit: show amount.

If activity = QR Banking: show business type.

If activity = Mobile Banking: amount is not required.

12. EMPLOYEE DASHBOARD

Create a separate dashboard specifically for employees.

Header:

Good morning, Abebe

Your Performance

Cards:

Total Achievement

Deposit Achievement

Customer Achievement

Digital Banking Achievement

"My Targets"

Each target should show:

Goal Target Achieved Remaining Achievement % Progress bar

Example:

Conventional Deposit 7,200,000 / 10,000,000 ETB 72%

IFB Customers 91 / 100 91%

Recent Activities: Show only the logged-in employee's activities.

13. EMPLOYEE PERFORMANCE PAGE

Create a detailed personal performance page.

Sections:

Performance Summary

Daily Weekly Monthly

Financial Performance:

Conventional Deposit

IFB Deposit

Total Deposit

Customer Performance:

Conventional Customers

IFB Customers

Total Customers

Digital:

Mobile Banking

Internet Banking

Card Banking

QR Banking

Show: Target Achieved Remaining Achievement %

Include charts.

14. REPORTS PAGE

Create a professional reporting interface.

Header: Reports

Report filters:

Date range

Employee

Goal

Activity type

Status

Report categories:

Financial Report Customer Report Digital Banking Report Employee Performance Report

Include:

Summary cards

Charts

Detailed table

Export PDF button

Export Excel button

Print button

The buttons can be UI-only for now.

15. AUDIT LOG PAGE

Create an audit log page.

Table:

Date User Action Table Record ID IP Address Details

Examples:

Abebe UPDATE activity_records Record #123

Hana CREATE customers Record #45

Use a clean timeline/detail modal for viewing old and new values.

16. SETTINGS PAGE

Create settings sections:

Profile

Name

Phone

Email

Username

Security

Change Password

Session information

Branch Information

Branch name

Branch code

Location

Phone

Email

17. COMPONENT SYSTEM

Create reusable components:

Sidebar

Topbar

Mobile navigation

Breadcrumb

Page header

KPI cards

Stat cards

Buttons

Form inputs

Selects

Date picker

Tables

Responsive tables

Pagination

Search

Filters

Modal

Confirmation dialog

Toast notifications

Alert messages

Status badges

Progress bars

Charts

Empty states

Loading states

Error states

All components must share the same visual language.

18. DATA VISUALIZATION

Use professional charts.

Charts needed:

Deposit performance over time

Conventional vs IFB deposit

Employee performance comparison

Customer distribution

Digital banking performance

Target achievement

Charts must be responsive.

19. UX RULES

Make the application feel like a real enterprise banking product.

Important:

Never overcrowd screens.

Use whitespace.

Use clear headings.

Use consistent button placement.

Use confirmation dialogs before destructive actions.

Use clear success/error notifications.

Show loading states.

Show empty states when there is no data.

Show validation messages directly near form fields.

Never rely only on color to communicate status.

Make mobile interactions easy with touch-friendly controls.

20. ACCESS CONTROL UI

There are two roles:

BRANCH ADMIN Can see:

Dashboard

Employees

Goals

Targets

Customers

Accounts

Activities

Performance

Reports

Audit Logs

Settings

EMPLOYEE Can see:

Dashboard

Customers

Accounts

Activities

My Targets

My Performance

Profile

Do not show Branch Admin navigation items to employees.

This is currently frontend-only role simulation using mock authentication/state.

21. MOCK DATA

Create realistic Ethiopian banking sample data.

Use ETB amounts.

Example branches:

Main Branch

Adama Branch

Bole Branch

Example employees:

Abebe Kebede

Hana Mohammed

Sara Tesfaye

Mohammed Ali

Use realistic but completely fictional customer data.

Do NOT use real people's personal information.

22. TECHNICAL STRUCTURE

Keep the code organized for future PHP/MySQL integration.

Separate:

Components

Pages

Layouts

UI components

Mock data

Services/API layer

Do not hard-code data directly throughout components.

Create a clean mock API/service layer so later we can replace mock data with PHP API endpoints.

23. IMPORTANT FUTURE BACKEND REQUIREMENT

The eventual backend will use:

PHP MySQL PDO Sessions password_hash() password_verify() CSRF protection Server-side authorization

The frontend should therefore be designed so it can later communicate with PHP endpoints such as:

/api/login.php /api/logout.php /api/dashboard.php /api/employees.php /api/goals.php /api/targets.php /api/customers.php /api/accounts.php /api/activities.php /api/reports.php

Do not implement these backend endpoints yet.

24. FINAL QUALITY REQUIREMENT

The entire application should look like one professionally designed banking product.

Do not create pages that look like separate templates.

The login page, admin dashboard, employee dashboard, forms, tables, reports, and settings must all share the same:

Color system

Typography

Spacing

Border radius

Shadows

Icons

Button style

Navigation

Responsive behavior

Prioritize professional banking UX over excessive visual effects.

Build the complete frontend prototype with working navigation between all pages using mock data.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://tshay-branch-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/39585404-3a2e-4969-9939-51b1be3bf369).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
