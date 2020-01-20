import { EmailTemplate } from './../candidate/emailTemplate';
import { MyCandidate } from './myCandidate';
import { Component, OnInit ,Input} from '@angular/core';
import { WebService } from './../web.service';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-modal-sendemail',
  templateUrl: './sendEmail.html',
})
export class SendEmail{
  @Input() chosenArray;
  templates$: Observable<EmailTemplate[]>;
  templates: EmailTemplate[];
  currentCandiate: number ;
  templateName = new FormControl('', [Validators.required]);
  constructor(public SendEmailModal: NgbActiveModal, private ws: WebService) {
    this.currentCandiate=0;
  }
  ngOnInit () {
    this.templates$ = this.ws.getTemplate()
    .pipe(map(data => data));
    this.templates$.subscribe(data => this.templates = data);
  }
  getTemplatecontent(candidate: MyCandidate) {
    const content = this.templates.find(data => data.emailTemplateName === candidate.emailTemplateName);
    const re = /xxxxx/gi;
    const str = content.emailTemplateContent;
    const newstr = str.replace(re,candidate.firstName);
    return newstr;

  }

  getTemplateSubject(candidate) {
    const content = this.templates.find(data => data.emailTemplateName === candidate.emailTemplateName);
    return content.emailSubject;

  }
  close(){
    this.SendEmailModal.close('Close click')
  }
  next(){
    this.currentCandiate+=1
  }
  previous(){
    this.currentCandiate-=1

  }
  submit(){

    this.ws.UpdateMyCandidate(this.chosenArray).subscribe((result) => {console.log('a'); } );
    window.location.reload();
    this.SendEmailModal.close('Close click')

  }
}

@Component({
  selector: 'app-my-candidate',
  templateUrl: './my-candidate.component.html',
  styleUrls: ['./my-candidate.component.css']
})
export class MyCandidateComponent implements OnInit {
  myCandidate$: Observable<MyCandidate[]>;
  myCandidates: MyCandidate[];
  tempMyCandidates: MyCandidate[];
  page: number;
  pages: number[];
  myCandidateSet: Set<number>;

  constructor(private ws: WebService,private modalService: NgbModal) {
    this.myCandidateSet = new Set();
    this.myCandidates=[];
    this.page=0;
  }

  ngOnInit() {
    this.page=0;
    this.myCandidate$ = this.ws.getMyCandidate()
    .pipe(map(data => data));
    this.myCandidate$.subscribe(data => this.myCandidates = data);
  }
  string2Date(date:string){return new Date(date);}
  checkMyCandiate(candidate){
    if (this.myCandidateSet.has(candidate)){
      this.myCandidateSet.delete(candidate);
    } else
    {
      this.myCandidateSet.add(candidate);
    }
  }
  sendEmail(){
    const modalRef = this.modalService.open(SendEmail);
    if(this.myCandidateSet.size===0){
      modalRef.componentInstance.chosenArray = this.myCandidates.slice(
        this.page, Math.min(this.page+20,
          this.myCandidates.length));
    }
    else{
      modalRef.componentInstance.chosenArray = Array.from(this.myCandidateSet.values());
    }
  }

  temp(){
    this.tempMyCandidates=this.myCandidates.slice(
      this.page, Math.min(this.page+20,
        this.myCandidates.length));
    return this.tempMyCandidates;
  }
  jump(i:number){
    this.page=(i-1)*20
}
    getPages(){
this.pages=[];
for(var i=1;i<=Math.floor(this.myCandidates.length / 20)+1;i++){
   this.pages.push(i);
 }
return this.pages;
}
next(){
 this.page=this.page+20;
}
previous(){
 this.page=this.page-20;
}

}
