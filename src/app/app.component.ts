import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { WebService } from './web.service';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  positions$: Observable<string[]>;
  positions: string[];
  model;
  public value: Date = new Date ();
  constructor(private router: Router,private ws: WebService) {
}
ngOnInit() {
  this.positions$ = this.ws.getPosition()
  .pipe(map(data => data));
  this.positions$.subscribe(data => this.positions = data);
}
goHome() {
  this.router.navigate(['home']);
}

goCandidate() {
  this.router.navigate(['candidate']);
}

goMyCandidate() {
  this.router.navigate(['myCandidate']);
}
}
