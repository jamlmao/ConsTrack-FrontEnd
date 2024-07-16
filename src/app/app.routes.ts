import { Routes } from '@angular/router';
import { AdminLComponent } from './pages/components/Admin/admin-l/admin-l.component';
import { ClientLComponent } from './pages/components/Client/client-l/client-l.component';
import { StaffLComponent } from './pages/components/Staff/staff-l/staff-l.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AdminDashboardComponent } from './pages/components/Admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './pages/guard/auth.guard';
import { StaffDashboardComponent } from './pages/components/Staff/staff-dashboard/staff-dashboard.component';



export const routes: Routes = [
    {
        path: '', redirectTo: 'Constrack',pathMatch: 'full'

    },
    {
        path: 'Constrack',
        component: MenuComponent,
    },
    {
        path: 'Client', 
        component: ClientLComponent,
    },
    {
        path: 'Admin',
        component: AdminLComponent
    },
    {
        path: 'Staff',
        component: StaffLComponent
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff-dashboard',
        component: StaffDashboardComponent,
        canActivate: [AuthGuard]
    }
];
