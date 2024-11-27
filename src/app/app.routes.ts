import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import { ErrorComponent } from './features/error/error.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home/dashboard', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'investorTestComponent',
        loadComponent: () =>
          import('./components/investor-test/investor-test.component').then(
            (c) => c.InvestorTestComponent
          ),
      },
      {
        path: 'educationContent',
        loadComponent: () =>
          import(
            './components/education-content/education-content.component'
          ).then((c) => c.EducationContentComponent),
      },
      {
        path: 'fraudAlertsComponent',
        loadComponent: () =>
          import('./components/fraud-alerts/fraud-alerts.component').then(
            (c) => c.FraudAlertsComponent
          ),
      },
    ],
  },
  { path: 'error', component: ErrorComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: '**', redirectTo: 'error' },
];
