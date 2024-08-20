import { Routes } from '@angular/router';

import { MenuComponent } from './pages/menu/menu.component';
import { AdminDashboardComponent } from './pages/components/Admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './pages/guard/auth.guard';
import { StaffDashboardComponent } from './pages/components/Staff/staff-dashboard/staff-dashboard.component';
import { ClientDashboardComponent } from './pages/components/Client/client-dashboard/client-dashboard.component';
import { HomeComponent } from './pages/components/Admin/admin-dashboard/home/home.component';
import { AccountComponent } from './pages/components/Admin/admin-dashboard/account/account.component';
import { HeaderComponent } from './pages/components/Admin/admin-dashboard/header/header.component';
import { SidenavComponent } from './pages/components/Admin/admin-dashboard/sidenav/sidenav.component';
import { TaskComponent } from './pages/components/Admin/admin-dashboard/task/task.component';



export const routes: Routes = [
    {
        path: '', redirectTo: 'Constrack',pathMatch: 'full'

    },
    {
        path: 'Constrack',
        component: MenuComponent,
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff',
        component: StaffDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client',
        component: ClientDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin/home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin/account',
        component: AccountComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin/header',
        component: HeaderComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin/sidenav',
        component: SidenavComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin/task',
        component: TaskComponent,
        canActivate: [AuthGuard]
    }
];
