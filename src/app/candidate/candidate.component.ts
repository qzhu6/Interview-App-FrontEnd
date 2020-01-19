import { AllCandidate } from './allcandidate';
import { EmailTemplate } from './emailTemplate';

import { Component, OnInit,Input } from '@angular/core';
import {Observable} from 'rxjs';
import { WebService } from './../web.service';
import { FormBuilder} from '@angular/forms';
import { map } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-newroundornot',
  templateUrl: './EmailTemplate.html',
})
export class newEmailTemplate{
@Input() tempTemplate;
templates$: Observable<string[]>;

  newTemplateForm = this.fb.group({
    emailTemplateName:[''],
    emailSubject: [''],
    emailTemplateContent: ['']
  });
  constructor(private fb: FormBuilder, public newEmailTemplateModal: NgbActiveModal, private ws: WebService,
    private modalService: NgbModal ) {}

  ngOnInit() {

  }

  close(){
    this.newEmailTemplateModal.close('Close click');
  }

  submit(){
    const tempTemplate = new EmailTemplate();
    tempTemplate.emailSubject = this.newTemplateForm.get('emailSubject').value;
    tempTemplate.emailTemplateName = this.newTemplateForm.get('emailTemplateName').value;
    tempTemplate.emailTemplateContent = this.newTemplateForm.get('emailTemplateContent').value;
    this.ws.PostNewTemplate(tempTemplate).subscribe((result) => {console.log('a'); } );
    this.tempTemplate.push(tempTemplate.emailTemplateName);
    this.newEmailTemplateModal.close('Close click');

  }
}

@Component({
  selector: 'app-modal-newroundornot',
  templateUrl: './candidateModal.html',
})
export class newCandidate{
  templates$: Observable<string[]>;
  templates: string[];
  positions$: Observable<string[]>;
  positions: string[];
  newCandidateForm = this.fb.group({
    comment:[''],
    firstName: [''],
    lastName: [''],
    email: [''],
    emailTemplateName: [''],
    cellPhone: [''],
    positionName: [''],
    resource: [''],
    resumeFileLocation: [''],
  });
  constructor(private fb: FormBuilder, public newCandidateModal: NgbActiveModal, private ws: WebService,
    private modalService: NgbModal) {}

  ngOnInit () {
    this.templates$ = this.ws.getTemplatename()
    .pipe(map(data => data));
    this.templates$.subscribe(data => this.templates = data);
    this.positions$ = this.ws.getPosition()
    .pipe(map(data => data));
    this.positions$.subscribe(data => this.positions = data);
  }

  close(){
    this.newCandidateModal.close('Close click');
  }
  createNewTemplate(){
    if(this.newCandidateForm.get('emailTemplateName').value === 'new'){
      const modalRef = this.modalService.open(newEmailTemplate);
      modalRef.componentInstance.tempTemplate=this.templates;
    }
  }


  submit(){
    const newCandidate: AllCandidate = new AllCandidate();
    newCandidate.email = this.newCandidateForm.get('email').value;
    newCandidate.emailTemplateName = this.newCandidateForm.get('emailTemplateName').value;
    newCandidate.firstName = this.newCandidateForm.get('firstName').value;
    newCandidate.lastName = this.newCandidateForm.get('lastName').value;
    newCandidate.positionName = this.newCandidateForm.get('positionName').value;
    newCandidate.resource = this.newCandidateForm.get('resource').value;
    newCandidate.cellPhone = this.newCandidateForm.get('cellPhone').value;
    newCandidate.comment = this.newCandidateForm.get('comment').value;
    newCandidate.resumeFileLocation = this.newCandidateForm.get('resumeFileLocation').value;
    this.ws.postNewCandidate(newCandidate).subscribe((result) => {console.log('a'); } );
    this.newCandidateModal.close('Close click');
    window.location.reload();
  }
}

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {
  candidate$: Observable<AllCandidate[]>;
  candidates: AllCandidate[];
  tempCandidates: AllCandidate[];
  page: number;
  pages: number[];
  candidateSet: Set<number>;
  constructor(private fb: FormBuilder, private ws: WebService, private modalService: NgbModal) {
    this.candidateSet = new Set();
    this.candidates = [];
    this.page = 0 ;
  }
  ngOnInit() {
    this.page=0;
    this.candidate$ = this.ws.getCandidate()
    .pipe(map(data => data));
    this.candidate$.subscribe(data => this.candidates = data);
  }
  checkCandiate(candidateID){
    if (this.candidateSet.has(candidateID)){
      this.candidateSet.delete(candidateID);
    } else
    {
      this.candidateSet.add(candidateID);
    }
  }
  addCandiate(candidateID){
    const candidateArray: number []= [];
    candidateArray.push(candidateID);
    this.ws.postMyCandidate(candidateArray).subscribe((result) => {console.log('a')});
    }


  orderByDate(){
    this.page=0;
    this.candidates.sort((a, b) => a.createDate < b.createDate ? -1 : a.createDate > b.createDate ? 1 : 0);
  }
  orderByPosition(){
    this.page=0;
    this.candidates.sort((a, b) => a.positionName < b.positionName ? -1 : a.positionName > b.positionName ? 1 : 0);
  }
  orderByFirstName(){
    this.page=0;
    this.candidates.sort((a, b) => a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1 : 0);
  }
  orderByLastName(){
    this.page=0;
    this.candidates.sort((a, b) => a.lastName < b.lastName ? -1 : a.lastName > b.lastName ? 1 : 0);

  }
  addAllCandidate(){
    const candidateArray: number[] =  Array.from(this.candidateSet.values());
    this.ws.postMyCandidate(candidateArray).subscribe((result) => {console.log('a')});
  }
  createNewCandidate(){
    const modalRef = this.modalService.open(newCandidate);
  }

  string2Date(date: string){return new Date(date);}


  temp(){
    this.tempCandidates=this.candidates.slice(
      this.page, Math.min(this.page+20,
        this.candidates.length));
    return this.tempCandidates
  }
  jump(i:number){
    this.page=(i-1)*20
}
    getPages(){
this.pages=[];
for(var i=1;i<=Math.floor(this.candidates.length / 20)+1;i++){
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

