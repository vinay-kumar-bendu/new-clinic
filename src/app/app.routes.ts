import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { TreatmentsComponent } from './treatments/treatments.component';
import { BillingComponent } from './billing/billing.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'patients', component: PatientListComponent, canActivate: [authGuard] },
  { path: 'patients/new', component: PatientFormComponent, canActivate: [authGuard] },
  { path: 'patients/edit/:id', component: PatientFormComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard] },
  { path: 'treatments', component: TreatmentsComponent, canActivate: [authGuard] },
  { path: 'billing', component: BillingComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
