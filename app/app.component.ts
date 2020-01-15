import {Component, NgModule, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieService) {}
  loadedFeature = 'igm-self-kyc';
  private cookieValue: string;

  videoWidth = 0;
  videoHeight = 0;


  public ngOnInit(): void {
    this.cookieService.set('cookie-name', 'our cookie value');
    this.cookieValue = this.cookieService.get('cookie-name');
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}


