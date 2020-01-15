import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormComponent } from './form/form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { ServiceComponent } from './service/service.component';
import { User } from './user';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { AddIdCardComponent } from './profile/add-id-card/add-id-card.component';
import { AddPorComponent } from './profile/add-por/add-por.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormComponent,
    ServiceComponent,
    ProfileComponent,
    AddIdCardComponent,
    AddPorComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,

  ],
  providers: [User, ServiceComponent, FormComponent, ProfileComponent, CookieService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
