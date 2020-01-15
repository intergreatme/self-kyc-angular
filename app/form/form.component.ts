import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl, Form} from '@angular/forms';
import {EligibleResponse, ServiceComponent, StandardResponse, WhitelistResponse} from '../service/service.component';
import {Router, ActivatedRoute} from '@angular/router';
import {catchError, first, map} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  @Output() formControlName = new EventEmitter<{ name: string }>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private serviceComponent: ServiceComponent,
    private cookieService: CookieService,
  ) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      idNumber: new FormControl(null, [Validators.required, Validators.minLength(13)]),
      firstName: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      email: new FormControl(),
      mobileNumber: new FormControl(),
      address: new FormControl(),
      unitComplex: new FormControl(),
      line1: new FormControl(),
      line2: new FormControl(),
      suburb: new FormControl(),
      city: new FormControl(),
      province: new FormControl(),
      postCode: new FormControl(),
      country: new FormControl(),
      latitude: new FormControl(),
      longitude: new FormControl(),
    });

    // reset login status
    this.serviceComponent.reset();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onCustomAction(event) {
    this.router.navigate(['/profile'])
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    //   alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    this.loading = true;
    this.serviceComponent.getWhitelistConfig(
      this.nullCheck(this.registerForm.controls.idNumber.value),
      this.nullCheck(this.registerForm.controls.firstName.value),
      this.nullCheck(this.registerForm.controls.surname.value),
      this.nullCheck(this.registerForm.controls.email.value),
      this.nullCheck(this.registerForm.controls.mobileNumber.value),
      this.nullCheck(this.registerForm.controls.unitComplex.value),
      this.nullCheck(this.registerForm.controls.line1.value),
      this.nullCheck(this.registerForm.controls.line2.value),
      this.nullCheck(this.registerForm.controls.suburb.value),
      this.nullCheck(this.registerForm.controls.city.value),
      this.nullCheck(this.registerForm.controls.province.value),
      this.nullCheck(this.registerForm.controls.postCode.value),
      this.nullCheck(this.registerForm.controls.country.value),
      this.nullCheck(this.registerForm.controls.latitude.value),
      this.nullCheck(this.registerForm.controls.longitude.value),
    ).pipe(
      map((response: WhitelistResponse) => {
        const responseJson = JSON.parse(response.payload);
        const transactionId = responseJson.tx_id;
        const originId = responseJson.origin_tx_id;

        this.serviceComponent.checkEligibility(transactionId, originId).pipe(
          map((eligibleResponse: StandardResponse) => {
            if (eligibleResponse.code === 'OK') {
              const eligiblePayload = eligibleResponse.data as EligibleResponse;

              // const authToken = eligiblePayload.auth_token;
              // alert('auth Token' + eligiblePayload.auth_token);
              return eligiblePayload.auth_token;

            } else {
              alert('failed to authenticate : ' + eligibleResponse.code);
              return null;
            }
          }), catchError((err) => {
            alert('failed to authenticate : ' + err.status + ':' + err.message);
            return null;
          })).subscribe((authToken: string) => {
            // create cookie containing the 'authToken'
          this.cookieService.set('authToken', authToken);
          // TODO Navigate user to the profile page

          console.log("result : " + authToken);
        });

      }), // retry failed request up to 3 times

      catchError((err) => {
        alert('Failed to complete whitelist : ' + err.status + ':' + err.message);
        return null;
      })).subscribe((value) => {
        // ignore result
    });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  nullCheck(input: string): string {
    if (input === null) {
      return '';
    } else {
      return input;
    }
  }
}
