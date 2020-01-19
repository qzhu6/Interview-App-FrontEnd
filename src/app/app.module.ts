import { AuthenticationService } from './authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { InterviewComponent, NgbdModalContent , NewRoundOrNot} from './interview/interview.component';
import { CandidateComponent, newCandidate , newEmailTemplate} from './candidate/candidate.component';
import { MyCandidateComponent, SendEmail} from './my-candidate/my-candidate.component';


import { AuthGaurdService } from './auth-gaurd.service';
import { HomeService } from './home/home.service';
import { WebService } from './web.service';
import { InterviewService } from './interview/interview.service';
import { LoginComponent } from './login/login.component';

import {FileUploadModule} from 'ng2-file-upload';
import {DownloadService} from './download.service';








@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InterviewComponent,
    NgbdModalContent,
    NewRoundOrNot,
    CandidateComponent,
    newCandidate,
    MyCandidateComponent,
    newEmailTemplate,
    SendEmail,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FileUploadModule
  ],
  providers: [HomeService, WebService, InterviewService,AuthenticationService,AuthGaurdService,DownloadService],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent, NewRoundOrNot, newCandidate, newEmailTemplate, SendEmail]
})
export class AppModule { }
