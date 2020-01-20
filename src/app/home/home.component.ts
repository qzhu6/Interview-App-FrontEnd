import { WebService } from './../web.service';
import { Candidate } from './candidate';
import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import * as fileSaver from 'file-saver';
import {DownloadService} from './../download.service';
import {ActivatedRoute, Router } from '@angular/router';


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


  constructor(private hs: HomeService,private fb: FormBuilder, private ws: WebService,
    private downloadService: DownloadService,  private router: Router
    ) {


    this.candidates=[];
    this.page=0;
  }
  ngOnInit() {
    this.candidate$=this.ws.getMyInterview()
    .pipe(map(data => data));
    this.candidate$.subscribe(data => this.candidates =
      this.hs.sortCandidates(data));
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
  onUpdate(positionName){
    console.log(positionName);
    this.router.navigate(['/interview'], { queryParams: {positionName: positionName}});
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









