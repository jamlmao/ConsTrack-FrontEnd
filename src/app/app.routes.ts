import { Routes } from '@angular/router';
import { AdminLComponent } from './pages/admin-l/admin-l.component';
import { ClientLComponent } from './pages/client-l/client-l.component';
import { StaffLComponent } from './pages/staff-l/staff-l.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './pages/guard/auth.guard';



export const routes: Routes = [
    {
        path: '', redirectTo: 'menu',pathMatch: 'full'

    },
    {
        path: 'menu',
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
    }
    
];
