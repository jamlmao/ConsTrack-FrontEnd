import { Routes } from '@angular/router';

import { MenuComponent } from './pages/menu/menu.component';
import { AdminDashboardComponent } from './pages/components/Admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './pages/guard/auth.guard';
import { StaffDashboardComponent } from './pages/components/Staff/staff-dashboard/staff-dashboard.component';
import { ClientDashboardComponent } from './pages/components/Client/client-dashboard/client-dashboard.component';



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
    }
];
