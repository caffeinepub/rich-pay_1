import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import LandingPage from './pages/LandingPage';
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AllBankAccountsPage from './pages/admin/AllBankAccountsPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import ChatsPage from './pages/admin/ChatsPage';
import SettingsPage from './pages/admin/SettingsPage';
import MyAccountsPage from './pages/admin/MyAccountsPage';
import MyBankAccountsPage from './pages/employee/MyBankAccountsPage';
import AddBankAccountPage from './pages/employee/AddBankAccountPage';
import CommissionInfoPage from './pages/employee/CommissionInfoPage';
import ChatWithAdminPage from './pages/employee/ChatWithAdminPage';
import MyProfilePage from './pages/employee/MyProfilePage';
import { getSession } from './lib/auth';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: EmployeeRegistrationPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    const session = getSession();
    if (!session || session.role !== 'admin') {
      throw redirect({ to: '/' });
    }
  },
  component: AdminDashboard,
});

const adminAccountsRoute = createRoute({
  getParentRoute: () => adminDashboardRoute,
  path: '/accounts',
  component: AllBankAccountsPage,
});

const adminEmployeesRoute = createRoute({
  getParentRoute: () => adminDashboardRoute,
  path: '/employees',
  component: EmployeesPage,
});

const adminChatsRoute = createRoute({
  getParentRoute: () => adminDashboardRoute,
  path: '/chats',
  component: ChatsPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminDashboardRoute,
  path: '/settings',
  component: SettingsPage,
});

const adminMyAccountsRoute = createRoute({
  getParentRoute: () => adminDashboardRoute,
  path: '/my-accounts',
  component: MyAccountsPage,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee',
  beforeLoad: () => {
    const session = getSession();
    if (!session || session.role !== 'employee') {
      throw redirect({ to: '/' });
    }
  },
  component: EmployeeDashboard,
});

const employeeMyAccountsRoute = createRoute({
  getParentRoute: () => employeeDashboardRoute,
  path: '/my-accounts',
  component: MyBankAccountsPage,
});

const employeeAddAccountRoute = createRoute({
  getParentRoute: () => employeeDashboardRoute,
  path: '/add-account',
  component: AddBankAccountPage,
});

const employeeCommissionRoute = createRoute({
  getParentRoute: () => employeeDashboardRoute,
  path: '/commission',
  component: CommissionInfoPage,
});

const employeeChatRoute = createRoute({
  getParentRoute: () => employeeDashboardRoute,
  path: '/chat',
  component: ChatWithAdminPage,
});

const employeeProfileRoute = createRoute({
  getParentRoute: () => employeeDashboardRoute,
  path: '/profile',
  component: MyProfilePage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  registerRoute,
  adminDashboardRoute.addChildren([
    adminAccountsRoute,
    adminEmployeesRoute,
    adminChatsRoute,
    adminSettingsRoute,
    adminMyAccountsRoute,
  ]),
  employeeDashboardRoute.addChildren([
    employeeMyAccountsRoute,
    employeeAddAccountRoute,
    employeeCommissionRoute,
    employeeChatRoute,
    employeeProfileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
