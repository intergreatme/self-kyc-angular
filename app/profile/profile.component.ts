import {Component, Injectable, OnInit} from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import {ProfileResponse, ServiceComponent, StandardResponse} from '../service/service.component';
import {FormComponent} from '../form/form.component';
import {Input} from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
@Injectable()
export class ProfileComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  profile: ProfileResponse;
  returnUrl: string;
  error = '';

  constructor(
    private serviceComponent: ServiceComponent,
    private formComponent: FormComponent,
    private cookieService: CookieService,
    private http: HttpClient,
    ) { }


  @Input() submit: string;


  ngOnInit() {
    // read the cookie and alert the value inside
    const authToken = this.cookieService.get('authToken');

    // call this and pass value from the cookie
    this.serviceComponent.getProfile(authToken).pipe(
      map((profileResponse: StandardResponse) => {
        if (profileResponse.code === 'OK') {
          return profileResponse.data as ProfileResponse;
        } else {
          alert('err : ' + profileResponse.code);
          return null;
        }
      }), catchError((err) => {
        alert('err : ' + err.name + ':' + err.message);
        return null;
      })).subscribe((something: ProfileResponse) => {
        this.profile = something;

    });
  }

  private formGroup(param: {}) {

  }
}
