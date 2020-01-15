import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})

@Injectable()
export class ServiceComponent implements OnInit, OnDestroy {

  private handleError;
  private currentProfileSubject: BehaviorSubject<ProfileResponse>;
  public currentProfile: Observable<ProfileResponse>;

  constructor(private http: HttpClient) {
    this.currentProfileSubject = new BehaviorSubject<ProfileResponse>(JSON.parse(localStorage.getItem('currentProfile')));
    this.currentProfile = this.currentProfileSubject.asObservable();
  }

  public get currentProfileValue(): ProfileResponse {
    return this.currentProfileSubject.value;
  }

  private registerForm: FormGroup;
  public idNumber: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public mobileNumber: string;
  public address: string;

  whitelistSubscription: Subscription;

  // enter your configID and name
  private whitelistUrl = 'https://www.intergreatme.com/api/self-kyc-util/whitelist/?config='//<YOUR CONFIG ID HERE>//'&'name='<//YOUR NAME HERE//>';
  private apiPath = 'https://dev.intergreatme.com/kyc/za/api/'; // "https://kyc.intergreatme.com/za/api" for prod
  private configId = '//<YOUR CONFIG ID HERE>//'; // the site Id you obtained from Intergreatme

  whitelistConfig = 'assets/tsconfig.json';
  private payloadContent: any;
  private jsonBodyString: string;
  private transactionId: any;
  private originId: null;
  private auth;

  // user profile;
  getWhitelistConfig(idNumber: string,
                     firstName: string,
                     surname: string,
                     email: string,
                     mobile: string,
                     unitComplex: string,
                     line1: string,
                     line2: string,
                     suburb: string,
                     city: string,
                     province: string,
                     postCode: string,
                     country: string,
                     latitude: string,
                     longitude: string) {

    let payloadString = '{' +
      '"id_number":"' + idNumber + '",' +
      '"first_name":"' + firstName + '",' +
      '"last_name":"' + surname + '",' +
      '"email":"' + email + '",' +
      '"mobile":"' + mobile + '",' +
      '"unitComplex":"' + unitComplex + '",' +
      '"line1":"' + line1 + '",' +
      '"line2":"' + line2 + '",' +
      '"suburb":"' + suburb + '",' +
      '"city":"' + city + '",' +
      '"province":"' + province + '",' +
      '"postCode":"' + postCode + '",' +
      '"country":"' + country + '",' +
      '"latitude":"' + latitude + '",' +
      '"longitude":"' + longitude + '"' +
      '}';

    payloadString = '{"payload":' + JSON.stringify(payloadString) + '}';
    console.log('pl : ' + payloadString);


    // const whitelistUrl = this.whitelistUrl;
    return this.http.post(this.whitelistUrl, payloadString);
  }

  checkEligibility(transactionId: string, originId: string) {
    return this.http.post(this.apiPath + 'user/eligible', JSON.stringify({
      'whitelist_id': transactionId, 'origin_tx_id': originId
    }), {
      headers: new HttpHeaders({'config': this.configId, 'Content-Type': 'application/json'})
    });
  }

  // user profile;
  getProfile(authToken: string) {
    const profileHttpOptions = {
      headers: new HttpHeaders({
        'config': this.configId,
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + authToken
      })
    };

    return this.http.get(this.apiPath + 'user/profile', profileHttpOptions);

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.whitelistSubscription.unsubscribe();
  }

  reset() {

  }
}

export interface WhitelistResponse {
  payload: string;
}

export interface StandardResponse {
  code: string;
  data: any;
}

export interface EligibleResponse {
  auth_token: string;
}

export interface ProfileResponse {
  id: string;
  unique_field: string;
  document_number: string;
  passport_country: string;
  use_passport: boolean;
  first_name: string;
  last_name: string;
  email_address: string;
  documents: any;
  share_status: any;
  share_success: boolean;
  liveliness_state: string;
  origin_tx_id: string;
  address?: {
    unit_complex: string;
    line1: string;
    line2: string;
    province: string;
    country: string;
    postal_code: string;
    latitude: string;
    longitude: string;
    plus_code: string;
  };
}

