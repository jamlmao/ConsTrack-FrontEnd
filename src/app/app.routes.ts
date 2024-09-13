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
import { DocumentsComponent } from './pages/components/Admin/admin-dashboard/documents/documents.component';
import { ShomeComponent } from './pages/components/Staff/staff-dashboard/shome/shome.component';
import { ChomeComponent } from './pages/components/Client/client-dashboard/chome/chome.component';
import { AddComponent } from './pages/components/Admin/admin-dashboard/add/add.component';
import { FeedbackComponent } from './pages/components/Client/client-dashboard/feedback/feedback.component';
import { ViewstatusComponent } from './pages/components/Client/client-dashboard/viewstatus/viewstatus.component';
import { ViewprojectComponent } from './pages/components/Client/client-dashboard/viewproject/viewproject.component';
import { StaffclientaccComponent } from './pages/components/Staff/staff-dashboard/staffclientacc/staffclientacc.component';
import { StaffaddComponent } from './pages/components/Staff/staff-dashboard/staffadd/staffadd.component';
import { StafftaskComponent } from './pages/components/Staff/staff-dashboard/stafftask/stafftask.component';
import { StaffdocumentsComponent } from './pages/components/Staff/staff-dashboard/staffdocuments/staffdocuments.component';
import { StaffprofileComponent } from './pages/components/Staff/staff-dashboard/staffprofile/staffprofile.component';
import { TimelineComponent } from './pages/components/Staff/staff-dashboard/timeline/timeline.component';
import { ClientprofileComponent } from './pages/components/Client/client-dashboard/clientprofile/clientprofile.component';
import { AdminprofileComponent } from './pages/components/Admin/admin-dashboard/adminprofile/adminprofile.component';
import { ProjectDetailsComponent } from './pages/components/Staff/staff-dashboard/project-details/project-details.component';
import { TaskdetailsComponent } from './pages/components/Staff/staff-dashboard/taskdetails/taskdetails.component';
import { GeneralrequirementComponent } from './pages/components/Staff/categories/generalrequirement/generalrequirement.component';
import { SiteworksComponent } from './pages/components/Staff/categories/siteworks/siteworks.component';
import { ConcreteworksComponent } from './pages/components/Staff/categories/concreteworks/concreteworks.component';
import { MetalworksComponent } from './pages/components/Staff/categories/metalworks/metalworks.component';
import { FormsComponent } from './pages/components/Staff/categories/forms/forms.component';
import { SteelworksComponent } from './pages/components/Staff/categories/steelworks/steelworks.component';
import { TinsmithryComponent } from './pages/components/Staff/categories/tinsmithry/tinsmithry.component';
import { PlasteringComponent } from './pages/components/Staff/categories/plastering/plastering.component';
import { PaintworksComponent } from './pages/components/Staff/categories/paintworks/paintworks.component';
import { PlumbingComponent } from './pages/components/Staff/categories/plumbing/plumbing.component';
import { ElectricalComponent } from './pages/components/Staff/categories/electrical/electrical.component';
import { CeilingworksComponent } from './pages/components/Staff/categories/ceilingworks/ceilingworks.component';
import { ArchitecturalComponent } from './pages/components/Staff/categories/architectural/architectural.component';
import { WebsiteComponent } from './website/website.component';
import { ClientupdatesComponent } from './pages/components/Client/client-dashboard/clientupdates/clientupdates.component';
import { TaskclientupdateComponent } from './pages/components/Client/client-dashboard/taskclientupdate/taskclientupdate.component';
import { SowaComponent } from './pages/components/Staff/sowa/sowa.component';
import { ResourcetableComponent } from './pages/components/Staff/resourcetable/resourcetable.component';
import { ClientprojectComponent } from './pages/components/Client/client-dashboard/clientproject/clientproject.component';
import { WebsiteportfolioComponent } from './websiteportfolio/websiteportfolio.component';
import { AppointmentComponent } from './pages/components/Staff/staff-dashboard/appointment/appointment.component';



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
        path: 'admin/document',
        component: DocumentsComponent,
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
        path: 'admin/add',
        component: AddComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client/feedback',
        component: FeedbackComponent,
        canActivate: [AuthGuard]
    }
    ,
    {
        path: 'client/viewstatus/:projectId',
        component: ViewstatusComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client/viewproject/:projectId',
        component: ViewprojectComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client/clientproject/:projectId',
        component: ClientprojectComponent,
        canActivate: [AuthGuard]
    }
    ,
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
        path: 'admin/profile',
        component: AdminprofileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'project-details/:projectId',
        component: ProjectDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId',
        component: SowaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'resources/:projectId',
        component: ResourcetableComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'task-details/:taskId',
        component: TaskdetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'timeline/:id',
        component: TimelineComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/general',
        component: GeneralrequirementComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/site',
        component: SiteworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/concrete',
        component: ConcreteworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/metal',
        component: MetalworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/forms',
        component: FormsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/steel',
        component: SteelworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/tinsmithry',
        component: TinsmithryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/plastering',
        component: PlasteringComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/paint',
        component: PaintworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/plumbing',
        component: PlumbingComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/electrical',
        component: ElectricalComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/ceiling',
        component: CeilingworksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'sowa/:projectId/architectural',
        component: ArchitecturalComponent,
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
        path: 'updates',
        component: ClientupdatesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'client/task-details/:taskId',
        component: TaskclientupdateComponent,
        canActivate: [AuthGuard]
    },
];
