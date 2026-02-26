// Custom auth layer using localStorage for username/password authentication
// This bridges the custom auth system with the backend's anonymous actor

export interface Session {
  role: 'admin' | 'employee';
  userId: string;
  username: string;
  fullName: string;
}

const SESSION_KEY = 'richpay_session';
const ADMIN_CREDS_KEY = 'richpay_admin_creds';
const EMPLOYEES_KEY = 'richpay_employees';
const BANK_ACCOUNTS_KEY = 'richpay_bank_accounts';

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface EmployeeRecord {
  id: string;
  fullName: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface LocalBankAccount {
  id: string; // unique account id
  employeeId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  submissionDate: string; // ISO string
  status: 'pending' | 'approved' | 'rejected';
}

// Default admin credentials
const DEFAULT_ADMIN: AdminCredentials = {
  username: 'Viper@123',
  password: 'Risktogain',
};

export function getAdminCredentials(): AdminCredentials {
  try {
    const stored = localStorage.getItem(ADMIN_CREDS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_ADMIN;
}

export function saveAdminCredentials(creds: AdminCredentials): void {
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
}

export function getEmployees(): EmployeeRecord[] {
  try {
    const stored = localStorage.getItem(EMPLOYEES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveEmployees(employees: EmployeeRecord[]): void {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
}

export function addEmployee(employee: EmployeeRecord): void {
  const employees = getEmployees();
  employees.push(employee);
  saveEmployees(employees);
}

export function updateEmployee(updated: EmployeeRecord): void {
  const employees = getEmployees();
  const idx = employees.findIndex(e => e.id === updated.id);
  if (idx >= 0) {
    employees[idx] = updated;
    saveEmployees(employees);
  }
}

export function getEmployeeById(id: string): EmployeeRecord | undefined {
  return getEmployees().find(e => e.id === id);
}

export function getEmployeeByUsername(username: string): EmployeeRecord | undefined {
  return getEmployees().find(e => e.username.toLowerCase() === username.toLowerCase());
}

export function authenticateAdmin(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  return creds.username === username && creds.password === password;
}

export function authenticateEmployee(username: string, password: string): EmployeeRecord | null {
  const employee = getEmployeeByUsername(username);
  if (employee && employee.password === password) return employee;
  return null;
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ─── Bank Account localStorage helpers ───────────────────────────────────────

export function getAllBankAccountsFromStorage(): LocalBankAccount[] {
  try {
    const stored = localStorage.getItem(BANK_ACCOUNTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveBankAccountsToStorage(accounts: LocalBankAccount[]): void {
  localStorage.setItem(BANK_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function addBankAccountToStorage(
  employeeId: string,
  account: {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: string;
  }
): LocalBankAccount {
  const accounts = getAllBankAccountsFromStorage();
  const newAccount: LocalBankAccount = {
    id: generateId(),
    employeeId,
    bankName: account.bankName,
    accountHolderName: account.accountHolderName,
    accountNumber: account.accountNumber,
    ifscCode: account.ifscCode,
    accountType: account.accountType,
    submissionDate: new Date().toISOString(),
    status: 'pending',
  };
  accounts.push(newAccount);
  saveBankAccountsToStorage(accounts);
  return newAccount;
}

export function updateBankAccountStatusInStorage(
  accountId: string,
  status: 'pending' | 'approved' | 'rejected'
): void {
  const accounts = getAllBankAccountsFromStorage();
  const idx = accounts.findIndex(a => a.id === accountId);
  if (idx >= 0) {
    accounts[idx] = { ...accounts[idx], status };
    saveBankAccountsToStorage(accounts);
  }
}

export function getMyBankAccountsFromStorage(employeeId: string): LocalBankAccount[] {
  return getAllBankAccountsFromStorage().filter(a => a.employeeId === employeeId);
}
