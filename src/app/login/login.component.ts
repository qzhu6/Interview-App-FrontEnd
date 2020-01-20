import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { WebService } from './../web.service';







@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Status:string;
  UserName:string;
  loginForm = this.fb.group({
    userName: ['',Validators.required],
    passWord: ['',Validators.required]
  });
  invalidLogin = false;

  constructor(private fb: FormBuilder, private router: Router,private ws: WebService, private loginservice: AuthenticationService) { }

  ngOnInit() {
  }
  SignIn(){
    this.ws.authenticate(this.loginForm.get('userName').value, this.loginForm.get('passWord').value)
    .subscribe(responseData => {
      this.Status=responseData['loginStatus'],
      this.UserName=responseData['userName']
    });

  }
  isWrong(){
    if(this.Status==null){
      return false;
   }
   else{
     return true;
   }
  }
  isLoggedIn(){
    if(this.Status==='Success'){
       sessionStorage.setItem('username', this.UserName);
       return true;
    }
    else{
      return this.loginservice.isUserLoggedIn();
    }
  }


}
