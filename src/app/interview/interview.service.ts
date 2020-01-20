import { Injectable } from '@angular/core';
import { Interview} from './interview';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  interviewlist: BehaviorSubject<Interview[][]>;
  tempinterviewlist: Interview[][];

  constructor() { }

  setInterviewlist(interviewList:Interview[][]){
    this.tempinterviewlist = interviewList;
    this.interviewlist = new BehaviorSubject(interviewList);
  }

  getInterviewlist( ) {
    return this.interviewlist.asObservable();
  }

  addinterview(currentlist: Interview){

    const interview = new Interview();
    interview.interviewStartDateTime = '';
    interview.sequence = currentlist.sequence + 1;
    interview.interviewStatus = 'Pending';
    interview.comment = '';
    interview.interviewerFirstName = currentlist.interviewerFirstName;
    interview.interviewerLastName = currentlist.interviewerLastName;

    interview.intervieweeFirstName = currentlist.intervieweeFirstName;
    interview.intervieweeLastName = currentlist.intervieweeLastName;

    interview.positionName = currentlist.positionName;
    interview.resumeFileLocation = currentlist.resumeFileLocation;
    interview.id = -1;
    interview.interviewDuration = 0;



    for (const tempinterview of this.tempinterviewlist) {
      const found = tempinterview.find(a => a.id === currentlist.id);
      if ( found) {
        tempinterview.push(interview);
        break;
      }
  }
    this.interviewlist.next(this.tempinterviewlist);
}
}
