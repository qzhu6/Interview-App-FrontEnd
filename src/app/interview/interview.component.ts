import { InterviewService } from './interview.service';
import { Component, OnInit, Input} from '@angular/core';
import { Interview} from './interview';
import { WebService } from './../web.service';
import { FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import { map, debounceTime, distinctUntilChanged, } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';




@Component({
  selector: 'app-modal-newroundornot',
  templateUrl: './newRound.html',
})
export class NewRoundOrNot{
  @Input() currentlist;
  constructor(public newRoundOrNotModal: NgbActiveModal, private is: InterviewService) {}
  close(){
    this.newRoundOrNotModal.close('Close click')
  }
  submit(){
    this.is.addinterview(this.currentlist);
    this.newRoundOrNotModal.close('Close click')
  }
}

@Component({
  selector: 'app-modal-content',
  templateUrl: './modalContent.html',
})
export class NgbdModalContent {
  changeForm = this.fb.group({
    candidateName: [''],
    interviewerName: [''],
    positionName: [''],
    interviewStartDate : [''],
    hour: [''],
    minute: [''],
    interviewDuration: []
  });
  positions$: Observable<string[]>;
  positions: string[];
  position = (positionName$: Observable<string>) =>
  positionName$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 3 ? []
      : this.positions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )
  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal, private ws: WebService) {}
  ngOnInit() {
    this.positions$ = this.ws.getPosition()
    .pipe(map(data => data));
    this.positions$.subscribe(data => this.positions = data);
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

  date = new FormControl('');
  hour = new FormControl('');
  minute = new FormControl('');




  constructor(private fb: FormBuilder, private ws: WebService, private modalService: NgbModal,
              private is: InterviewService ) { }

  ngOnInit() {
    this.myMap = new Map();
    this.interviews$ = this.ws.getMyInterviews()
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
      window.location.reload();
      break;
      }
    }
  }


 change() {
  const modalRef = this.modalService.open(NgbdModalContent);
}
changeStatus(event: any, current: number){
  for (const interview of this.interviews) {
    const found = interview.find(({ id }) => id === current);
    if ( found) {
      found.interviewStatus = event.target.value;
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
