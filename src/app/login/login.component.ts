import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    userName: [''],
    passWord: ['']
  });
  invalidLogin = false;

  constructor(private fb: FormBuilder, private router: Router,private loginservice: AuthenticationService) { }

  ngOnInit() {
  }
  SignIn(){
    this.loginservice.authenticate(this.loginForm.get('userName').value, this.loginForm.get('passWord').value)
    // ).
    // subscribe(
    //   data => {
    this.router.navigate(['']);
    this.invalidLogin = false;
    //   },
    //   error => {
    //     this.invalidLogin = true;
    //   }
    // )
    // );
  }

}
