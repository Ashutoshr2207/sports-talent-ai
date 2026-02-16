import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { AthletesComponent } from './components/athletes/athletes.component';
import { AthleteDetailComponent } from './components/athlete-detail/athlete-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'athletes', component: AthletesComponent },
  { path: 'athletes/:id', component: AthleteDetailComponent },
  { path: '**', redirectTo: '' }
];
