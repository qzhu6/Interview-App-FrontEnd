import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewComponent } from './interview/interview.component';
import { CandidateComponent } from './candidate/candidate.component';
import { MyCandidateComponent } from './my-candidate/my-candidate.component';
import { LoginComponent } from './login/login.component';
import { AuthGaurdService } from './auth-gaurd.service';







const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGaurdService]},
  { path: 'interview', component: InterviewComponent , canActivate:[AuthGaurdService]},
  { path: 'candidate', component: CandidateComponent , canActivate:[AuthGaurdService]},
  { path: 'myCandidate', component: MyCandidateComponent , canActivate:[AuthGaurdService]},
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
