import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';


export class User{
  constructor(
    public status: string,
     ) {}
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient ) {
     }

     authenticate(username, password) {
      // console.log('Bearer ' + btoa(username + ':' + password));
      // const headers = new HttpHeaders({ Authorization: 'Bearer ' + btoa(username + ':' + password) }
      // );
      // return this.httpClient.get<User>('api/employees/validateLogin', { headers}).pipe(
      //  map(
      //    userData => {
          sessionStorage.setItem('username', username);
      //     return userData;
      //    }
      //  )
      // );
    }


  isUserLoggedIn() {
    const user = sessionStorage.getItem('username');
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('username');
  }
}
