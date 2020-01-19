import { Injectable } from '@angular/core';
import { Candidate } from './home/candidate';
import { HttpClient } from '@angular/common/http';
import { Interview} from './interview/interview';
import { AllCandidate} from './candidate/allcandidate';
import { HttpHeaders } from '@angular/common/http';
import { MyCandidate } from './my-candidate/myCandidate';
import { EmailTemplate } from './candidate/emailTemplate';
import {UserInformation} from './login/userInformation';
import {UserLogin} from './login/userLogin';







@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private http: HttpClient) { }
  getMyInterview() {
    return this.http.get<Candidate[]>('api/home')
    ;
  }
  getMyInterviews(PositionName: string ) {
    const myObj = {
      positionName : PositionName
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post<Interview[][]>('api/Interview', JSON.stringify(myObj), httpOptions);
  }
  authenticate(username, password) {
    const ui: UserInformation = new UserInformation();
    ui.username=username;
    ui.password=password;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post<UserLogin>('api/login', JSON.stringify(ui), httpOptions);
  }
  getCandidate() {
    return this.http.get<AllCandidate[]>('api/AllCandidate')
    ;
  }
  getMyCandidate() {
    return this.http.get<MyCandidate[]>('api/MyCandidate');
  }
  getPosition() {
    return this.http.get<string[]>('api/ListPosition');
  }
  getTemplatename() {
    return this.http.get<string[]>('api/ListEmailTemplateName');
  }
  getTemplate() {
    return this.http.get<EmailTemplate[]>('api/ListEmailTemplate');
  }

  getEmployeeName() {
    return this.http.get<string[]>('api/EmployeeName');
  }

  getCandidateName() {
    return this.http.get<string[]>('api/CandidateName');
  }


  postMyCandidate(candidatearray) {
    const myObj = {
      candidate: candidatearray
    };
    console.log(candidatearray);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post('api/AddToCandidate', JSON.stringify(myObj), httpOptions);
  }


  postNewCandidate(newCandidate) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post('api/NewCandidate', JSON.stringify(newCandidate), httpOptions);
  }

  postNewInteview(NewInterview) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post('api/NewInterview', JSON.stringify(NewInterview), httpOptions);
  }

  PostNewTemplate(NewTemplate) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post('api/EmailTemplate', JSON.stringify(NewTemplate), httpOptions);
  }

  UpdateMyCandidate( MyCandidate: MyCandidate[]) {
    const myObj = {
      candidateList: MyCandidate
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json; charset=UTF-8'})};
    return this.http.post('api/UpdateCandidate', JSON.stringify(myObj), httpOptions);
  }




}
