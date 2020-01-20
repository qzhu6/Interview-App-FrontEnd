import { InterviewService } from './interview.service';
import { Component, OnInit, Input} from '@angular/core';
import { Interview} from './interview';
import { WebService } from './../web.service';
import {Observable} from 'rxjs';
import { map, debounceTime, distinctUntilChanged, } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import {DownloadService} from './../download.service';



@Component({
  selector: 'app-modal-newroundornot',
  templateUrl: './newRound.html',
})
export class NewRoundOrNot{
  @Input() currentlist;
  constructor(public newRoundOrNotModal: NgbActiveModal, private is: InterviewService) {}
  close() {
    this.newRoundOrNotModal.close('Close click');
  }
  submit(){
    this.is.addinterview(this.currentlist);
    this.newRoundOrNotModal.close('Close click');
  }
}

@Component({
  selector: 'app-modal-content',
  templateUrl: './modalContent.html',
})
export class NgbdModalContent {
  changeForm = this.fb.group({
    candidateName: ['', Validators.required],
    interviewerName: ['', Validators.required],
    positionName: ['', Validators.required],
    interviewStartDate : ['', Validators.required],
    hour: ['', [Validators.max(24), Validators.min(0), Validators.required]],
    minute: ['', [Validators.max(60), Validators.min(0), Validators.required]],
    interviewDuration: ['', [Validators.min(0), Validators.max(5), Validators.required]]
  });
  positions$: Observable<string[]>;
  positions: string[];
  position = (positionName$: Observable<string>) =>
  positionName$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 3 ? []
      : this.positions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  employeeName$: Observable<string[]>;
  employeeName: string[];
  employee = (employee$: Observable<string>) =>
  employee$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 3 ? []
      : this.employeeName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  candidateName$: Observable<string[]>;
  candidateName: string[];
  candidate = (candidate$: Observable<string>) =>
  candidate$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 3 ? []
      : this.candidateName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )
  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private ws: WebService, private router: Router) {}
  ngOnInit() {
    this.positions$ = this.ws.getPosition()
    .pipe(map(data => data));
    this.positions$.subscribe(data => this.positions = data);
    this.employeeName$ = this.ws.getEmployeeName()
    .pipe(map(data => data));
    this.employeeName$.subscribe(data => this.employeeName = data);
    this.candidateName$ = this.ws.getCandidateName()
    .pipe(map(data => data));
    this.candidateName$.subscribe(data => this.candidateName = data);
  }
  close(){
    this.activeModal.close('Close click')
  }
  submit(){
    const newInterview= new Interview();
    newInterview.positionName = this.changeForm.get('positionName').value;
    let d = new Date();
    d.setFullYear(this.changeForm.get('interviewStartDate').value.year);
    d.setMonth(this.changeForm.get('interviewStartDate').value.month);
    d.setDate(this.changeForm.get('interviewStartDate').value.day);
    d.setHours(+this.changeForm.get('hour').value);
    d.setMinutes(+this.changeForm.get('minute').value);
    newInterview.interviewStartDateTime = d.toJSON();
    const splittedCandidate = this.changeForm.get('candidateName').value.split(' ', 2);
    newInterview.intervieweeFirstName = splittedCandidate[0];
    newInterview.intervieweeLastName = splittedCandidate[1];
    const splittedInterviewer = this.changeForm.get('interviewerName').value.split(' ', 2);
    newInterview.interviewerFirstName = splittedInterviewer[0];
    newInterview.interviewerLastName = splittedInterviewer[1];
    newInterview.interviewDuration = this.changeForm.get('interviewDuration').value;
    newInterview.interviewStatus = 'Pending';
    newInterview.sequence = 1;
    newInterview.id = -1;
    this.ws.postNewInteview(newInterview).subscribe((result) => {console.log('a'); } );
    window.location.href = this.router.url;
    this.activeModal.close('Close click');
  }
}

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {
  interviews$: Observable<Interview[][]>;
  interviews: Interview[][];
  myMap: Map<number, boolean>;
  positionName: string;

  date = new FormControl('');
  hour = new FormControl('');
  minute = new FormControl('');

  constructor(private fb: FormBuilder, private ws: WebService, private modalService: NgbModal,
              private is: InterviewService, private route: ActivatedRoute,private router: Router,
              private downloadService: DownloadService
              ) {
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;

              }

  ngOnInit() {
    this.myMap = new Map();
    this.route.queryParams.subscribe(params => {
      this.positionName = params['positionName'];
  });
    this.interviews$ = this.ws.getMyInterviews(this.positionName)
    .pipe(map(data => data));
    this.interviews$.subscribe(data => this.interviews =
     data);
 }
 storeInterview(current){
  for (const interview of this.interviews) {
    const found = interview.find(({ id }) => id === current);
    if( found) {
      let d = new Date();
      d.setFullYear(this.date.value.year);
      d.setMonth(this.date.value.month);
      d.setDate(this.date.value.day);
      d.setHours(+this.hour.value);
      d.setMinutes(+this.minute.value);
      found.interviewStartDateTime = d.toJSON();
      this.ws.postNewInteview(found).subscribe((result) => {console.log('a'); } );
      window.location.href = this.router.url;
      break;
      }
    }
  }

  allDone(interview: Interview){
    if(interview.interviewDuration === null||this.hour.value===''||this.minute.value==='') {
      return true;
    }
    if(+this.hour.value > 24 || +this.hour.value < 0){
      return true;
    }
    if(+this.minute.value > 60 || +this.minute.value < 0 ){
      return true;
    }
    return false;

  }
  downloadFileSystem(file) {
    this.downloadService.downloadFileSystem(file)
      .subscribe(response => {
        const filename = response.headers.get('filename');

        this.saveFile(response.body, filename);
      });
  }
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], {type: 'text/pdf; charset=utf-8'});
    fileSaver.saveAs(blob, filename);
  }

 change() {
  const modalRef = this.modalService.open(NgbdModalContent);
}
changeStatus(event: any, current: number){
  for (const interview of this.interviews) {
    const found = interview.find(({ id }) => id === current);
    if ( found) {
      found.interviewStatus = event.target.value;
      this.ws.updateInterview(found).subscribe((result) => {console.log('a'); } );
      if (event.target.value === 'Pass'){
        this.is.setInterviewlist(this.interviews);
        this.is.getInterviewlist().subscribe(
          data => this.interviews = data );
        const modalRef = this.modalService.open(NewRoundOrNot);
        modalRef.componentInstance.currentlist = found;
      }
      break;
    }
  }

}

  string2Date(date: string) {return new Date(date); }

  expand(i){
    this.myMap.set(i, true);
  }
  collapse(i){
    this.myMap.delete(i);
  }

  isShows(index: number){
    if (!this.myMap.has(index)){
      return false;
    } else {
        return this.myMap.get(index);
    }
  }


}
