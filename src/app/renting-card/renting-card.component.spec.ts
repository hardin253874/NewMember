import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routing } from '../app.routing';
import { RouterTestingModule } from '@angular/router/testing';

import { TenancyService, TenancyInfo } from './services/tenancy.service';
import { AgentService } from '../agent-card/services/agent.service';
import { PortalClientFactory } from '../_services/portal-client-factory';
import { AuthenticationService } from '../_services/authentication.service';
import { AppWideEventService } from '../_services/app-wide-events.service';
import { HomeComponent } from '../home/home.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { ActviateComponent } from '../sign-up/actviate/actviate.component';
import { ProfileComponent, MemberService } from '../member/index';
import { EditComponent } from '../member/edit/edit.component';
import { SignUpService} from '../sign-up/services/sign-up.service';
import { NewPasswordComponent} from '../sign-in/reset-password/new-password/new-password.component';
import { FormsModule } from '@angular/forms';
import { PortalLocalStorage, PortalCookieStorage } from '../_common/portal-storage'
import { PortalSession } from '../_common/portal-session';
import { RentingCardComponent } from './renting-card.component';
import { PropertyService } from '../property/services/property.service';

describe('RentingCardComponent', () => {
  let component: RentingCardComponent;
  let fixture: ComponentFixture<RentingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      {
        declarations: [RentingCardComponent],
        imports: [RouterTestingModule, NgbModule.forRoot()],
        providers: [AuthenticationService, PortalClientFactory, AppWideEventService,
          AgentService, TenancyService, PropertyService, PortalSession, PortalLocalStorage, PortalCookieStorage]

      }
    ).overrideComponent(RentingCardComponent, {set: {template: ''}});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should getDaysInArrears function work', () => {
    const tenancyInfo = new TenancyInfo();
    expect(component.getDaysInArrears).toBeTruthy();
    expect(component.getDaysInArrears()).toBe(0);
  });

  it ('should displayFullAddress function work', () => {
    const tenancyInfo = new TenancyInfo();
    expect(component.displayFullAddress).toBeTruthy();
    expect(component.displayFullAddress(tenancyInfo)).toBe('');
  });
});
