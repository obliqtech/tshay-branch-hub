/**
 * Mock database for the TSHAY BANK prototype.
 * Shapes mirror the future MySQL tables so the PHP API can drop in later.
 */

export type Role = "admin" | "employee";
export type Status = "Active" | "Inactive";
export type ActivityStatus = "Approved" | "Pending" | "Rejected";
export type BankingType = "Conventional" | "IFB";

export interface Employee {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: "Branch Admin" | "Customer Service" | "Marketing Officer" | "Teller";
  status: Status;
  joined: string;
  branch: string;
}

export interface Goal {
  id: number;
  name: string;
  category: "Financial" | "Non-Financial";
  measurement: "Amount" | "Count";
  status: Status;
  description: string;
}

export interface Target {
  id: number;
  employee: string;
  goal: string;
  period: "Daily" | "Weekly" | "Monthly";
  target: number;
  achieved: number;
  unit: "ETB" | "count";
  status: Status;
}

export interface Customer {
  id: number;
  fullName: string;
  phone: string;
  identification: "National ID" | "Passport" | "Driving License" | "Kebele ID";
  bankingType: BankingType;
  branch: string;
  registeredBy: string;
  status: Status;
  registeredDate: string;
}

export interface Account {
  id: number;
  number: string;
  customer: string;
  bankingType: BankingType;
  accountType: string;
  openingAmount: number;
  openedBy: string;
  openedDate: string;
  status: "Active" | "Closed" | "Blocked";
}

export type ActivityType =
  | "Deposit"
  | "Customer Registration"
  | "Mobile Banking"
  | "Internet Banking"
  | "Card Banking"
  | "QR Banking";

export interface Activity {
  id: number;
  employee: string;
  customer: string;
  account: string;
  activity: ActivityType;
  goal: string;
  amount: number | null;
  businessType: string | null;
  date: string;
  status: ActivityStatus;
}

export interface AuditLog {
  id: number;
  date: string;
  user: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
  table: string;
  recordId: string;
  ip: string;
  oldValue: Record<string, string | number>;
  newValue: Record<string, string | number>;
}

export const BRANCHES = ["Main Branch", "Adama Branch", "Bole Branch"];

export const EMPLOYEES: Employee[] = [
  {
    id: 1,
    code: "TB-1001",
    firstName: "Abebe",
    lastName: "Kebede",
    username: "abebe.k",
    email: "abebe.kebede@tshaybank.et",
    phone: "+251 911 234 567",
    role: "Marketing Officer",
    status: "Active",
    joined: "2023-02-14",
    branch: "Main Branch",
  },
  {
    id: 2,
    code: "TB-1002",
    firstName: "Hana",
    lastName: "Mohammed",
    username: "hana.m",
    email: "hana.mohammed@tshaybank.et",
    phone: "+251 912 887 441",
    role: "Customer Service",
    status: "Active",
    joined: "2023-06-02",
    branch: "Main Branch",
  },
  {
    id: 3,
    code: "TB-1003",
    firstName: "Sara",
    lastName: "Tesfaye",
    username: "sara.t",
    email: "sara.tesfaye@tshaybank.et",
    phone: "+251 913 550 128",
    role: "Teller",
    status: "Active",
    joined: "2024-01-09",
    branch: "Bole Branch",
  },
  {
    id: 4,
    code: "TB-1004",
    firstName: "Mohammed",
    lastName: "Ali",
    username: "mohammed.a",
    email: "mohammed.ali@tshaybank.et",
    phone: "+251 914 220 903",
    role: "Marketing Officer",
    status: "Active",
    joined: "2022-11-21",
    branch: "Adama Branch",
  },
  {
    id: 5,
    code: "TB-1005",
    firstName: "Meron",
    lastName: "Getachew",
    username: "meron.g",
    email: "meron.getachew@tshaybank.et",
    phone: "+251 915 771 640",
    role: "Customer Service",
    status: "Inactive",
    joined: "2021-08-30",
    branch: "Main Branch",
  },
  {
    id: 6,
    code: "TB-1006",
    firstName: "Dawit",
    lastName: "Bekele",
    username: "dawit.b",
    email: "dawit.bekele@tshaybank.et",
    phone: "+251 916 004 512",
    role: "Teller",
    status: "Active",
    joined: "2024-04-18",
    branch: "Bole Branch",
  },
  {
    id: 7,
    code: "TB-1007",
    firstName: "Selam",
    lastName: "Girma",
    username: "selam.g",
    email: "selam.girma@tshaybank.et",
    phone: "+251 917 335 289",
    role: "Branch Admin",
    status: "Active",
    joined: "2020-03-05",
    branch: "Main Branch",
  },
  {
    id: 8,
    code: "TB-1008",
    firstName: "Yonas",
    lastName: "Alemu",
    username: "yonas.a",
    email: "yonas.alemu@tshaybank.et",
    phone: "+251 918 662 073",
    role: "Marketing Officer",
    status: "Inactive",
    joined: "2022-05-27",
    branch: "Adama Branch",
  },
];

export const GOALS: Goal[] = [
  {
    id: 1,
    name: "Conventional Deposit",
    category: "Financial",
    measurement: "Amount",
    status: "Active",
    description: "Total conventional deposit mobilized in ETB.",
  },
  {
    id: 2,
    name: "IFB Deposit",
    category: "Financial",
    measurement: "Amount",
    status: "Active",
    description: "Interest free banking deposit mobilized in ETB.",
  },
  {
    id: 3,
    name: "Conventional Customer",
    category: "Non-Financial",
    measurement: "Count",
    status: "Active",
    description: "New conventional customers registered.",
  },
  {
    id: 4,
    name: "IFB Customer",
    category: "Non-Financial",
    measurement: "Count",
    status: "Active",
    description: "New interest free banking customers registered.",
  },
  {
    id: 5,
    name: "Mobile Banking",
    category: "Non-Financial",
    measurement: "Count",
    status: "Active",
    description: "Mobile banking subscriptions activated.",
  },
  {
    id: 6,
    name: "Internet Banking",
    category: "Non-Financial",
    measurement: "Count",
    status: "Active",
    description: "Internet banking subscriptions activated.",
  },
  {
    id: 7,
    name: "Card Banking",
    category: "Non-Financial",
    measurement: "Count",
    status: "Active",
    description: "ATM / debit cards issued to customers.",
  },
  {
    id: 8,
    name: "QR Banking",
    category: "Non-Financial",
    measurement: "Count",
    status: "Active",
    description: "QR merchant onboarding for business customers.",
  },
];

export const TARGETS: Target[] = [
  { id: 1, employee: "Abebe Kebede", goal: "Conventional Deposit", period: "Monthly", target: 10_000_000, achieved: 7_200_000, unit: "ETB", status: "Active" },
  { id: 2, employee: "Abebe Kebede", goal: "IFB Deposit", period: "Monthly", target: 4_000_000, achieved: 3_360_000, unit: "ETB", status: "Active" },
  { id: 3, employee: "Abebe Kebede", goal: "IFB Customer", period: "Monthly", target: 100, achieved: 91, unit: "count", status: "Active" },
  { id: 4, employee: "Abebe Kebede", goal: "Mobile Banking", period: "Monthly", target: 120, achieved: 104, unit: "count", status: "Active" },
  { id: 5, employee: "Abebe Kebede", goal: "Internet Banking", period: "Monthly", target: 60, achieved: 41, unit: "count", status: "Active" },
  { id: 6, employee: "Abebe Kebede", goal: "Card Banking", period: "Monthly", target: 150, achieved: 132, unit: "count", status: "Active" },
  { id: 7, employee: "Abebe Kebede", goal: "QR Banking", period: "Monthly", target: 40, achieved: 27, unit: "count", status: "Active" },
  { id: 8, employee: "Abebe Kebede", goal: "Conventional Customer", period: "Monthly", target: 140, achieved: 118, unit: "count", status: "Active" },
  { id: 9, employee: "Hana Mohammed", goal: "Mobile Banking", period: "Monthly", target: 100, achieved: 85, unit: "count", status: "Active" },
  { id: 10, employee: "Hana Mohammed", goal: "Conventional Deposit", period: "Monthly", target: 8_000_000, achieved: 6_950_000, unit: "ETB", status: "Active" },
  { id: 11, employee: "Sara Tesfaye", goal: "IFB Deposit", period: "Monthly", target: 6_000_000, achieved: 4_560_000, unit: "ETB", status: "Active" },
  { id: 12, employee: "Sara Tesfaye", goal: "Card Banking", period: "Monthly", target: 90, achieved: 68, unit: "count", status: "Active" },
  { id: 13, employee: "Mohammed Ali", goal: "Conventional Deposit", period: "Monthly", target: 9_000_000, achieved: 7_290_000, unit: "ETB", status: "Active" },
  { id: 14, employee: "Mohammed Ali", goal: "QR Banking", period: "Weekly", target: 15, achieved: 11, unit: "count", status: "Active" },
  { id: 15, employee: "Dawit Bekele", goal: "Conventional Customer", period: "Monthly", target: 120, achieved: 74, unit: "count", status: "Inactive" },
];

export const CUSTOMERS: Customer[] = [
  { id: 1, fullName: "Ahmed Ali Yusuf", phone: "+251 921 445 110", identification: "National ID", bankingType: "IFB", branch: "Main Branch", registeredBy: "Abebe Kebede", status: "Active", registeredDate: "2026-09-05" },
  { id: 2, fullName: "Sara Mohammed Nur", phone: "+251 922 118 903", identification: "Passport", bankingType: "Conventional", branch: "Main Branch", registeredBy: "Hana Mohammed", status: "Active", registeredDate: "2026-09-05" },
  { id: 3, fullName: "Tigist Haile Mariam", phone: "+251 923 664 271", identification: "Kebele ID", bankingType: "Conventional", branch: "Bole Branch", registeredBy: "Sara Tesfaye", status: "Active", registeredDate: "2026-09-04" },
  { id: 4, fullName: "Kalid Seid Ibrahim", phone: "+251 924 337 558", identification: "National ID", bankingType: "IFB", branch: "Adama Branch", registeredBy: "Mohammed Ali", status: "Active", registeredDate: "2026-09-03" },
  { id: 5, fullName: "Bethlehem Assefa", phone: "+251 925 902 146", identification: "Driving License", bankingType: "Conventional", branch: "Main Branch", registeredBy: "Abebe Kebede", status: "Inactive", registeredDate: "2026-08-29" },
  { id: 6, fullName: "Nuredin Kemal", phone: "+251 926 471 330", identification: "National ID", bankingType: "IFB", branch: "Adama Branch", registeredBy: "Mohammed Ali", status: "Active", registeredDate: "2026-08-27" },
  { id: 7, fullName: "Rahel Girma Wolde", phone: "+251 927 220 884", identification: "Kebele ID", bankingType: "Conventional", branch: "Bole Branch", registeredBy: "Dawit Bekele", status: "Active", registeredDate: "2026-08-25" },
  { id: 8, fullName: "Fatuma Hassen", phone: "+251 928 776 019", identification: "National ID", bankingType: "IFB", branch: "Main Branch", registeredBy: "Hana Mohammed", status: "Active", registeredDate: "2026-08-22" },
];

export const ACCOUNTS: Account[] = [
  { id: 1, number: "1000 2345 8891", customer: "Ahmed Ali Yusuf", bankingType: "IFB", accountType: "Wadia Savings", openingAmount: 50_000, openedBy: "Abebe Kebede", openedDate: "2026-09-05", status: "Active" },
  { id: 2, number: "1000 2345 8892", customer: "Sara Mohammed Nur", bankingType: "Conventional", accountType: "Ordinary Savings", openingAmount: 12_500, openedBy: "Hana Mohammed", openedDate: "2026-09-05", status: "Active" },
  { id: 3, number: "1000 2345 8893", customer: "Tigist Haile Mariam", bankingType: "Conventional", accountType: "Current Account", openingAmount: 250_000, openedBy: "Sara Tesfaye", openedDate: "2026-09-04", status: "Active" },
  { id: 4, number: "1000 2345 8894", customer: "Kalid Seid Ibrahim", bankingType: "IFB", accountType: "Mudarabah Savings", openingAmount: 180_000, openedBy: "Mohammed Ali", openedDate: "2026-09-03", status: "Active" },
  { id: 5, number: "1000 2345 8895", customer: "Bethlehem Assefa", bankingType: "Conventional", accountType: "Ordinary Savings", openingAmount: 3_000, openedBy: "Abebe Kebede", openedDate: "2026-08-29", status: "Closed" },
  { id: 6, number: "1000 2345 8896", customer: "Nuredin Kemal", bankingType: "IFB", accountType: "Wadia Savings", openingAmount: 75_000, openedBy: "Mohammed Ali", openedDate: "2026-08-27", status: "Blocked" },
  { id: 7, number: "1000 2345 8897", customer: "Rahel Girma Wolde", bankingType: "Conventional", accountType: "Fixed Time Deposit", openingAmount: 1_000_000, openedBy: "Dawit Bekele", openedDate: "2026-08-25", status: "Active" },
  { id: 8, number: "1000 2345 8898", customer: "Fatuma Hassen", bankingType: "IFB", accountType: "Qard Current", openingAmount: 42_000, openedBy: "Hana Mohammed", openedDate: "2026-08-22", status: "Active" },
];

export const ACTIVITIES: Activity[] = [
  { id: 1, employee: "Abebe Kebede", customer: "Ahmed Ali Yusuf", account: "1000 2345 8891", activity: "Deposit", goal: "IFB Deposit", amount: 50_000, businessType: null, date: "2026-09-05", status: "Approved" },
  { id: 2, employee: "Hana Mohammed", customer: "Sara Mohammed Nur", account: "1000 2345 8892", activity: "Mobile Banking", goal: "Mobile Banking", amount: null, businessType: null, date: "2026-09-05", status: "Approved" },
  { id: 3, employee: "Sara Tesfaye", customer: "Tigist Haile Mariam", account: "1000 2345 8893", activity: "Deposit", goal: "Conventional Deposit", amount: 250_000, businessType: null, date: "2026-09-04", status: "Pending" },
  { id: 4, employee: "Mohammed Ali", customer: "Kalid Seid Ibrahim", account: "1000 2345 8894", activity: "QR Banking", goal: "QR Banking", amount: null, businessType: "Retail Shop", date: "2026-09-04", status: "Approved" },
  { id: 5, employee: "Abebe Kebede", customer: "Bethlehem Assefa", account: "1000 2345 8895", activity: "Customer Registration", goal: "Conventional Customer", amount: null, businessType: null, date: "2026-09-03", status: "Rejected" },
  { id: 6, employee: "Dawit Bekele", customer: "Rahel Girma Wolde", account: "1000 2345 8897", activity: "Card Banking", goal: "Card Banking", amount: null, businessType: null, date: "2026-09-03", status: "Approved" },
  { id: 7, employee: "Abebe Kebede", customer: "Fatuma Hassen", account: "1000 2345 8898", activity: "Internet Banking", goal: "Internet Banking", amount: null, businessType: null, date: "2026-09-02", status: "Pending" },
  { id: 8, employee: "Hana Mohammed", customer: "Nuredin Kemal", account: "1000 2345 8896", activity: "Deposit", goal: "IFB Deposit", amount: 75_000, businessType: null, date: "2026-09-02", status: "Approved" },
  { id: 9, employee: "Mohammed Ali", customer: "Ahmed Ali Yusuf", account: "1000 2345 8891", activity: "QR Banking", goal: "QR Banking", amount: null, businessType: "Restaurant", date: "2026-09-01", status: "Approved" },
  { id: 10, employee: "Abebe Kebede", customer: "Sara Mohammed Nur", account: "1000 2345 8892", activity: "Deposit", goal: "Conventional Deposit", amount: 420_000, businessType: null, date: "2026-09-01", status: "Approved" },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 1, date: "2026-09-05 09:41", user: "Abebe Kebede", action: "UPDATE", table: "activity_records", recordId: "#123", ip: "10.20.4.51", oldValue: { status: "Pending", amount: 40000 }, newValue: { status: "Approved", amount: 50000 } },
  { id: 2, date: "2026-09-05 09:12", user: "Hana Mohammed", action: "CREATE", table: "customers", recordId: "#45", ip: "10.20.4.77", oldValue: {}, newValue: { full_name: "Sara Mohammed Nur", banking_type: "Conventional" } },
  { id: 3, date: "2026-09-04 16:05", user: "Selam Girma", action: "UPDATE", table: "employee_targets", recordId: "#12", ip: "10.20.4.10", oldValue: { target: 8000000 }, newValue: { target: 10000000 } },
  { id: 4, date: "2026-09-04 08:30", user: "Sara Tesfaye", action: "LOGIN", table: "users", recordId: "#3", ip: "10.20.5.22", oldValue: {}, newValue: { result: "success" } },
  { id: 5, date: "2026-09-03 14:52", user: "Mohammed Ali", action: "DELETE", table: "activity_records", recordId: "#98", ip: "10.20.6.14", oldValue: { activity: "QR Banking", status: "Pending" }, newValue: {} },
];

export const DEPOSIT_TREND = [
  { month: "Apr", conventional: 12.4, ifb: 5.1 },
  { month: "May", conventional: 13.9, ifb: 5.8 },
  { month: "Jun", conventional: 15.2, ifb: 6.4 },
  { month: "Jul", conventional: 16.1, ifb: 7.2 },
  { month: "Aug", conventional: 16.8, ifb: 7.6 },
  { month: "Sep", conventional: 17.3, ifb: 7.7 },
];

export const BRANCH_SUMMARY = {
  totalDeposit: 25_000_000,
  conventionalDeposit: 17_300_000,
  ifbDeposit: 7_700_000,
  totalCustomers: 1_240,
  employees: 32,
  targetAchievement: 78,
};

export const BRANCH_INFO = {
  name: "Main Branch",
  code: "TB-MB-001",
  location: "Churchill Avenue, Addis Ababa",
  phone: "+251 111 552 300",
  email: "mainbranch@tshaybank.et",
};
