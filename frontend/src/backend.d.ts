import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export interface BankAccount {
    status: AccountStatus;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    employeeId: string;
    accountType: string;
    submissionDate: Time;
    accountNumber: string;
}
export type Time = bigint;
export interface ChatMessageInput {
    recipient: string;
    sender: string;
    message: string;
}
export interface ChatMessage {
    message: string;
    timestamp: Time;
    recipientId: string;
    senderId: string;
}
export interface Employee {
    id: string;
    username: string;
    fullName: string;
    registrationDate: Time;
}
export interface BankAccountInput {
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    accountType: string;
    accountNumber: string;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface UserProfile {
    username: string;
    name: string;
}
export enum AccountStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBankAccount(employeeId: string, account: BankAccountInput): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEmployee(id: string, fullName: string, username: string): Promise<void>;
    deleteBankAccount(employeeId: string): Promise<void>;
    deleteEmployee(id: string): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getBankAccounts(): Promise<Array<BankAccount>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversation(partyA: string, partyB: string): Promise<Array<ChatMessage>>;
    getEmployees(): Promise<Array<Employee>>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getMessagesByRecipient(recipientId: string): Promise<Array<ChatMessage>>;
    getMyBankAccounts(): Promise<Array<BankAccount>>;
    getPendingBankAccounts(): Promise<Array<BankAccount>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveEmployee(employee: Employee): Promise<void>;
    sendMessage(input: ChatMessageInput): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    updateBankAccountStatus(employeeId: string, status: AccountStatus): Promise<void>;
}
