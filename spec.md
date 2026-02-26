# Specification

## Summary
**Goal:** Fix the Employee Dashboard "Add Bank Account" functionality so employees can successfully submit and save bank accounts under their own identity.

**Planned changes:**
- Fix the Add Bank Account form submission to save the new bank account to localStorage associated with the logged-in employee's identity, not the admin's.
- Set the initial status of newly submitted bank accounts to "Pending".
- Ensure the newly submitted account appears immediately in the employee's "My Bank Accounts" list after submission.
- Ensure the admin's "All Bank Accounts" section correctly displays employee-submitted accounts with the employee's name.
- Ensure the employee Add Bank Account form and the admin "My Accounts" form operate independently without interference.

**User-visible outcome:** A logged-in employee can fill out and submit the Add Bank Account form, and the new account immediately appears in their "My Bank Accounts" list with a "Pending" status, while the admin's own account management remains unaffected.
