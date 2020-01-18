import { Injectable } from '@angular/core';
import { Candidate } from './candidate';



@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor() {
  }

  sortCandidates(candidates):Candidate[] {
    candidates.sort((a, b) =>{
      const difA=new Date().getTime() - new Date(a.interviewStartDateTime).getTime();
      const difB=new Date().getTime() - new Date(b.interviewStartDateTime).getTime();
      if(difA>0&&difB<0){
        return 1;
      }
      else if(difA<0&&difB>0){
        return -1;
      }
      else if(Math.abs(difA)>Math.abs(difB)){
        return 1;
      }
      else if(Math.abs(difB)>Math.abs(difA)){
        return -1;
      }
      else{
        return 0;
      }})
    return candidates;
  }



}
