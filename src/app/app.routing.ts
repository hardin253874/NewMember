import { TransactionComponent } from './transactions/transaction/transaction.component';
import { TransactionReportComponent } from './transactions/transaction-report/transaction-report.component';
import { RentingsComponent } from './renting-card';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/index';
import { ActviateComponent } from './sign-up/actviate/actviate.component';
import { AuthGuard, TenantGuard } from './_guards/index';
import {
  ProfileComponent,
  EditComponent,
  ChangePasswordDialogComponent,
  ChangeEmailDialogComponent,
  ActivateEmailComponent
} from './member/index';
import { NewPasswordComponent } from './sign-in/reset-password/new-password/new-password.component';
import { MaintenanceListComponent } from './jobs/maintenance-list/maintenance-list.component';
import { AboutComponent, HelpComponent, TermsComponent } from './layout/index';
import { DocumentListComponent } from 'app/documents/document-list/document-list.component';
import { AgentPreviewComponent } from 'app/sign-in/agent-preview/agent-preview.component';
import { ErrorComponent} from './error-alert/error.component';
import { ToastMessageComponent } from './messages/toast-message.component';
const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [TenantGuard] },
  { path: 'sign-in', component: SignInComponent},
  { path: 'portfolio', component: SignInComponent},
  { path: 'error', component: ErrorComponent},
  { path: 'agent-preview', component: AgentPreviewComponent },
  { path: 'activate/:id', component: ActviateComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'sign-in/reset-password/:id', component: NewPasswordComponent},
  { path: 'maintenance', component: MaintenanceListComponent, canActivate: [TenantGuard] },
  { path: 'activities', component: ActivityListComponent, canActivate: [TenantGuard] },
  { path: 'documents', component: DocumentListComponent, canActivate: [TenantGuard] },
  { path: 'transactions', component: TransactionComponent, canActivate: [TenantGuard] },
  { path: 'member/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'member/property', component: RentingsComponent, canActivate: [TenantGuard] },
  { path: 'member/edit', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'member/changepassword', component: ChangePasswordDialogComponent, canActivate: [AuthGuard]},
  { path: 'member/changeemail', component: ChangeEmailDialogComponent, canActivate: [AuthGuard]},
  { path: 'member/activate-email/:id', component: ActivateEmailComponent },
  { path: 'history-report', component: TransactionReportComponent},
  { path: 'toast-message', component: ToastMessageComponent},
  // otherwise redirect to home
  { path: 'owner/*', redirectTo: 'owner/'},
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
