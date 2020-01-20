import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  onNavigateGoogle() {
    window.open("https://www.google.com", "_blank");
  }

  onNavigateLinkedIn() {
    window.open("https://www.linkedin.com", "_blank");
  }

  onNavigateMonster() {
    window.open("https://www.monster.com", "_blank");
  }

  onNavigateTwitter() {
    window.open("https://www.twitter.com", "_blank");
  }

  onNavigateYoutube() {
    window.open("https://www.youtube.com", "_blank");
  }


}
