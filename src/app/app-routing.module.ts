import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewComponent } from './interview/interview.component';
import { CandidateComponent } from './candidate/candidate.component';
import { MyCandidateComponent } from './my-candidate/my-candidate.component';





const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'interview', component: InterviewComponent },
  { path: 'candidate', component: CandidateComponent },
  { path: 'myCandidate', component: MyCandidateComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
