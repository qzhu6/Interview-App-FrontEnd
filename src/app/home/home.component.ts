import { WebService } from './../web.service';
import { Candidate } from './candidate';
import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  candidate$: Observable<Candidate[]>;
  candidates: Candidate[];
  tempCandidates: Candidate[];
  page: number;
  pages: number[];
  profileForm = this.fb.group({
  });


  constructor(private hs: HomeService,private fb: FormBuilder, private ws: WebService) {
    this.candidates=[];
    this.page=0;
  }
  ngOnInit() {
    this.candidate$=this.ws.getMyInterview()
    .pipe(map(data => data));
    this.candidate$.subscribe(data => this.candidates =
      this.hs.sortCandidates(data));
}
  outOfDate(date:string){
      if(new Date().getTime() - new Date(date).getTime()>=0){
        return true;
      }
      else{
        return false;
      }
    }
  string2Date(date:string){return new Date(date);}
  temp(){
    return this.tempCandidates=this.candidates.slice(
      this.page, Math.min(this.page+20,
        this.candidates.length))
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









