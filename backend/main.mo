import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Blob "mo:core/Blob";
import Random "mo:core/Random";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Type Definitions
  type AccountStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type BankAccount = {
    employeeId : Text;
    bankName : Text;
    accountHolderName : Text;
    accountNumber : Text;
    ifscCode : Text;
    accountType : Text; // Savings or Current
    submissionDate : Time.Time;
    status : AccountStatus;
  };

  type ChatMessage = {
    senderId : Text;
    recipientId : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type BankAccountInput = {
    bankName : Text;
    accountHolderName : Text;
    accountNumber : Text;
    ifscCode : Text;
    accountType : Text;
  };

  type Employee = {
    id : Text;
    fullName : Text;
    username : Text;
    registrationDate : Time.Time;
  };

  module Employee {
    public func compare(a : Employee, b : Employee) : Order.Order {
      switch (Text.compare(a.fullName, b.fullName)) {
        case (#equal) { Text.compare(a.username, b.username) };
        case (other) { other };
      };
    };
  };

  type ChatMessageInput = {
    sender : Text;
    recipient : Text;
    message : Text;
  };

  // UserProfile type required by the frontend
  type UserProfile = {
    name : Text;
    username : Text;
  };

  // Include authorization component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let bankAccounts = Map.empty<Text, BankAccount>();
  let employees = Map.empty<Text, Employee>();
  let messages = List.empty<ChatMessage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the invite links system state
  let inviteState = InviteLinksModule.initState();

  // -----------------------------------------------------------------------
  // User Profile Functions (required by frontend)
  // -----------------------------------------------------------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  // -----------------------------------------------------------------------
  // Employee Management
  // -----------------------------------------------------------------------

  // createEmployee is called during registration (via invite link).
  // Guests (anonymous) are allowed since registration is open to invite holders.
  // The invite token validation is handled separately via submitRSVP / validateInviteCode.
  public shared ({ caller }) func createEmployee(id : Text, fullName : Text, username : Text) : async () {
    // Any caller (including guests) may register as an employee.
    // The invite-token gate is enforced on the frontend before calling this.
    switch (employees.get(id)) {
      case (null) {
        let newEmployee = {
          id;
          fullName;
          username;
          registrationDate = Time.now();
        };
        employees.add(id, newEmployee);
      };
      case (?_) { Runtime.trap("Employee already exists") };
    };
  };

  // Only admins may list all employees.
  public query ({ caller }) func getEmployees() : async [Employee] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can list employees");
    };
    employees.values().toArray().sort();
  };

  // Admins can edit any employee; employees can only edit their own record.
  // The employee's principal-based id is stored as a Text representation of their Principal.
  public shared ({ caller }) func saveEmployee(employee : Employee) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      // Non-admins may only update their own record
      let callerIdText = caller.toText();
      if (employee.id != callerIdText) {
        Runtime.trap("Unauthorized: You can only edit your own employee profile");
      };
      // Must be at least a registered user
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can update employee profiles");
      };
    };
    employees.add(employee.id, employee);
  };

  // Only admins may delete employees.
  public shared ({ caller }) func deleteEmployee(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?_) { employees.remove(id) };
    };
  };

  // -----------------------------------------------------------------------
  // Bank Account Management
  // -----------------------------------------------------------------------

  // Employees add their own bank accounts; admins may add accounts on behalf of anyone.
  public shared ({ caller }) func addBankAccount(employeeId : Text, account : BankAccountInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add bank accounts");
    };
    // Non-admins may only add accounts for themselves
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      let callerIdText = caller.toText();
      if (employeeId != callerIdText) {
        Runtime.trap("Unauthorized: You can only add bank accounts for yourself");
      };
    };
    let newAccount = {
      employeeId;
      bankName = account.bankName;
      accountHolderName = account.accountHolderName;
      accountNumber = account.accountNumber;
      ifscCode = account.ifscCode;
      accountType = account.accountType;
      submissionDate = Time.now();
      status = #pending;
    };
    bankAccounts.add(employeeId, newAccount);
  };

  // Only admins may view all bank accounts.
  public query ({ caller }) func getBankAccounts() : async [BankAccount] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all bank accounts");
    };
    bankAccounts.values().toArray();
  };

  // Only admins may view pending bank accounts.
  public query ({ caller }) func getPendingBankAccounts() : async [BankAccount] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending bank accounts");
    };
    bankAccounts.values().toArray().filter(func(a) { a.status == #pending });
  };

  // Employees can view their own bank accounts.
  public query ({ caller }) func getMyBankAccounts() : async [BankAccount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their bank accounts");
    };
    let callerIdText = caller.toText();
    bankAccounts.values().toArray().filter(func(a) { a.employeeId == callerIdText });
  };

  // Only admins may delete bank accounts.
  public shared ({ caller }) func deleteBankAccount(employeeId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete bank accounts");
    };
    switch (bankAccounts.get(employeeId)) {
      case (null) { Runtime.trap("Bank account not found") };
      case (?_) { bankAccounts.remove(employeeId) };
    };
  };

  // Only admins may approve or reject bank accounts.
  public shared ({ caller }) func updateBankAccountStatus(employeeId : Text, status : AccountStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update bank account status");
    };
    let current = bankAccounts.get(employeeId);
    switch (current) {
      case (null) { Runtime.trap("This bank account does not exist.") };
      case (?account) {
        bankAccounts.add(employeeId, { account with status });
      };
    };
  };

  // -----------------------------------------------------------------------
  // Messaging System
  // -----------------------------------------------------------------------

  // Only authenticated users (employees or admin) may send messages.
  public shared ({ caller }) func sendMessage(input : ChatMessageInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };
    // Ensure the sender field matches the caller's identity
    let callerIdText = caller.toText();
    if (not (AccessControl.isAdmin(accessControlState, caller)) and input.sender != callerIdText) {
      Runtime.trap("Unauthorized: You can only send messages as yourself");
    };
    let newMessage = {
      senderId = input.sender;
      recipientId = input.recipient;
      message = input.message;
      timestamp = Time.now();
    };
    messages.add(newMessage);
  };

  // Admins can retrieve messages for any recipient.
  // Employees can only retrieve messages where they are the recipient.
  public query ({ caller }) func getMessagesByRecipient(recipientId : Text) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read messages");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      let callerIdText = caller.toText();
      if (recipientId != callerIdText) {
        Runtime.trap("Unauthorized: You can only view your own messages");
      };
    };
    messages.values().filter(func(msg) { msg.recipientId == recipientId }).toArray();
  };

  // Retrieve the full conversation thread between two parties.
  // Admins can view any thread; employees can only view threads they are part of.
  public query ({ caller }) func getConversation(partyA : Text, partyB : Text) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can read messages");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      let callerIdText = caller.toText();
      if (callerIdText != partyA and callerIdText != partyB) {
        Runtime.trap("Unauthorized: You can only view conversations you are part of");
      };
    };
    messages.values().filter(func(msg) {
      (msg.senderId == partyA and msg.recipientId == partyB) or
      (msg.senderId == partyB and msg.recipientId == partyA)
    }).toArray();
  };

  // -----------------------------------------------------------------------
  // Invite Links Management (Admin Only)
  // -----------------------------------------------------------------------

  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite tokens");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };

  // submitRSVP is intentionally open to guests (used during registration with invite token).
  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };
};
