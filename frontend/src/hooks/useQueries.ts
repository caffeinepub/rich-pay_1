import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Employee, type ChatMessage, type InviteCode } from '../backend';
import {
  getSession,
  getEmployeeById,
  getAllBankAccountsFromStorage,
  getMyBankAccountsFromStorage,
  addBankAccountToStorage,
  updateBankAccountStatusInStorage,
  type LocalBankAccount,
} from '../lib/auth';

// ─── Bank Accounts (localStorage-based) ──────────────────────────────────────

export function useGetAllBankAccounts() {
  const session = getSession();
  return useQuery<LocalBankAccount[]>({
    queryKey: ['bankAccounts', 'all'],
    queryFn: async () => {
      return getAllBankAccountsFromStorage();
    },
    enabled: !!session,
  });
}

export function useGetMyBankAccounts() {
  const session = getSession();
  return useQuery<LocalBankAccount[]>({
    queryKey: ['bankAccounts', 'mine', session?.userId],
    queryFn: async () => {
      if (!session) return [];
      return getMyBankAccountsFromStorage(session.userId);
    },
    enabled: !!session,
  });
}

export function useAddBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      employeeId: string;
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      accountType: string;
    }) => {
      return addBankAccountToStorage(params.employeeId, {
        bankName: params.bankName,
        accountHolderName: params.accountHolderName,
        accountNumber: params.accountNumber,
        ifscCode: params.ifscCode,
        accountType: params.accountType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
}

export function useUpdateBankAccountStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { employeeId: string; status: 'pending' | 'approved' | 'rejected' }) => {
      updateBankAccountStatusInStorage(params.employeeId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
}

// ─── Employees ───────────────────────────────────────────────────────────────

export function useGetEmployees() {
  const { actor, isFetching } = useActor();
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getEmployees();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employee: Employee) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveEmployee(employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useCreateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; fullName: string; username: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createEmployee(params.id, params.fullName, params.username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export function useGetConversation(partyA: string, partyB: string, enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ['conversation', partyA, partyB],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getConversation(partyA, partyB);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && enabled && !!partyA && !!partyB,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { sender: string; recipient: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.sendMessage({ sender: params.sender, recipient: params.recipient, message: params.message });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.sender, variables.recipient] });
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.recipient, variables.sender] });
    },
  });
}

// ─── Invite Codes ─────────────────────────────────────────────────────────────

export function useGetInviteCodes() {
  const { actor, isFetching } = useActor();
  return useQuery<InviteCode[]>({
    queryKey: ['inviteCodes'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getInviteCodes();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.generateInviteCode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCodes'] });
    },
  });
}

export function useValidateInviteCode() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      const codes = await actor.getInviteCodes();
      const found = codes.find(c => c.code === code);
      if (!found) throw new Error('Invalid invite code');
      if (found.used) throw new Error('Invite code already used');
      return found;
    },
  });
}

// ─── Helper: get employee name by id ─────────────────────────────────────────

export function getEmployeeNameById(id: string): string {
  const local = getEmployeeById(id);
  if (local) return local.fullName;
  if (id === 'admin') return 'Admin';
  return id;
}
