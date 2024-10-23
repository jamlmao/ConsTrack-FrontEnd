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
import { ShomeComponent } from './pages/components/Staff/staff-dashboard/shome/shome.component';
import { ChomeComponent } from './pages/components/Client/client-dashboard/chome/chome.component';
import { FeedbackComponent } from './pages/components/Client/client-dashboard/feedback/feedback.component';
import { ViewstatusComponent } from './pages/components/Client/client-dashboard/viewstatus/viewstatus.component';
import { StaffclientaccComponent } from './pages/components/Staff/staff-dashboard/staffclientacc/staffclientacc.component';
import { StaffaddComponent } from './pages/components/Staff/staff-dashboard/staffadd/staffadd.component';
import { StafftaskComponent } from './pages/components/Staff/staff-dashboard/stafftask/stafftask.component';
import { StaffdocumentsComponent } from './pages/components/Staff/staff-dashboard/staffdocuments/staffdocuments.component';
import { StaffprofileComponent } from './pages/components/Staff/staff-dashboard/staffprofile/staffprofile.component';
import { TimelineComponent } from './pages/components/Staff/staff-dashboard/timeline/timeline.component';
import { ClientprofileComponent } from './pages/components/Client/client-dashboard/clientprofile/clientprofile.component';
import { ProjectDetailsComponent } from './pages/components/Staff/staff-dashboard/project-details/project-details.component';
import { TaskdetailsComponent } from './pages/components/Staff/staff-dashboard/taskdetails/taskdetails.component';
import { WebsiteComponent } from './website/website.component';
import { ClientupdatesComponent } from './pages/components/Client/client-dashboard/clientupdates/clientupdates.component';
import { SowaComponent } from './pages/components/Staff/sowa/sowa.component';
import { ResourcetableComponent } from './pages/components/Staff/resourcetable/resourcetable.component';
import { WebsiteportfolioComponent } from './websiteportfolio/websiteportfolio.component';
import { AppointmentComponent } from './pages/components/Staff/staff-dashboard/appointment/appointment.component';
import { GoalComponent } from './website/goal/goal.component';
import { ClientprojectComponent } from './pages/components/Client/clientproject/clientproject.component';



export const routes: Routes = [
    {
        path: '', redirectTo: 'Constrack/website',pathMatch: 'full'

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
        path: 'admin/accounts',
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
    },
    
    
    {
        path: 'staff/shome',
        component: ShomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff/appointment',
        component: AppointmentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client/chome',
        component: ChomeComponent,
        canActivate: [AuthGuard]
    },
    
    {
        path: 'client/feedback',
        component: FeedbackComponent,
        canActivate: [AuthGuard]
    }
    ,
    {
        path: 'client/clientproject/:projectId',
        component: ClientprojectComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client/viewstatus/:projectId',
        component: ViewstatusComponent,
        canActivate: [AuthGuard]
    },
    
    {
        path: 'staff/users',
        component: StaffclientaccComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff/add',
        component: StaffaddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff/task',
        component: StafftaskComponent,
        canActivate: [AuthGuard]
    }
    ,
    {
        path: 'staff/documents',
        component: StaffdocumentsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff/profile',
        component: StaffprofileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'staff/timeline',
        component: TimelineComponent,
        canActivate: [AuthGuard]
    }
    ,
    {
        path: 'client/profile',
        component: ClientprofileComponent,
        canActivate: [AuthGuard]
    },
    
    {
        path: 'project-details',
        component: ProjectDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa',
        component: SowaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'resources',
        component: ResourcetableComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'task-details',
        component: TaskdetailsComponent,
        canActivate: [AuthGuard]
    },
    
    {
        path: 'timeline/:id',
        component: TimelineComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'Constrack/website',
        component: WebsiteComponent,
    },
    {
        path: 'Constrack/website/portfolio',
        component: WebsiteportfolioComponent,
    },
    {
        path: 'Constrack/website/goal',
        component: GoalComponent,
    },
    {
        path: 'updates',
        component: ClientupdatesComponent,
        canActivate: [AuthGuard]
    },
];
