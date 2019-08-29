import { FormatTimePipe } from './_pipes/format-time';
import { TransactionsService } from './transactions/transactions.service';
import { UpcomingEventService } from './upcoming-event/upcoming-event.service';
import { UtilityService } from './_common/utility.service';
import { IPortalStorage, PortalLocalStorage, PortalCookieStorage } from './_common/portal-storage-index';
import { PortalSession } from './_common/portal-session';
import { CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective } from 'ng2-file-upload';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard, TenantGuard } from './_guards/index';
import { AuthenticationService } from './_services/authentication.service';
import { PortalErrorHandlerService } from './_services/portal-error-handler.service';
import { RouterExtService } from './_services/router-ext.service';
import { TestService } from './_services/test.service';
import { PortalClientFactory } from './_services/portal-client-factory';
import { ClientFactoryService } from './_services/client-factory.service';
import { AgentCardComponent } from './agent-card/agent-card.component';
import { RentingCardComponent, RentingsComponent } from './renting-card/index';
import { NavigationComponent, NavCardComponent } from './navigation/index';
import {
  ActivityFeedComponent,
  ActivityFeedDocComponent,
  ActivityFeedJobComponent,
  ActivityFeedPaymentComponent,
  ActivityFeedInspectionComponent
} from './activity-feed/index';
import { ToastMessageComponent} from './messages/index';
import { ErrorAlertComponent } from './error-alert/error-alert.component';
import { ErrorComponent } from './error-alert/error.component';
import { ConnectDialogComponent } from './connect-dialog/connect-dialog.component';
import { SignInDialogComponent } from './sign-in/sign-in-dialog.component';
import { AppWideEventService } from './_services/app-wide-events.service';
import { ToastMessageService } from './_services/toast-message.service';
import {
  ProfileComponent,
  ProfileCardComponent,
  MemberService,
  ChangePasswordDialogComponent,
  ChangeEmailDialogComponent,
  ActivateEmailComponent
} from './member/index';
import {
  GetInitialsPipe,
  ServerUrlPipe,
  ManagerAppUrlPipe,
  PMCurrencyPipe,
  LocalDatePipe,
  InspecitonTypePipe,
  DaysInArrearsPipe,
  AddressTextPipe,
  FormatDatePipe,
  FormatFileSizePipe
} from  './_pipes/index';
import { EditComponent } from './member/edit/edit.component';
import { FormFieldComponent } from './_components/form-field/form-field.component';
import { SignUpEmailComponent } from './sign-up/email/email.component';
import { SignUpService } from './sign-up/services/sign-up.service';
import { ActviateComponent } from './sign-up/actviate/actviate.component';
import { LoadingComponent } from './_components/loading/loading.component';
import { HomeComponent } from './home/home.component';
import { TenancyService } from './renting-card/services/tenancy.service';
import { AgentService } from './agent-card/services/agent.service';
import { PropertyService } from './property/services/property.service';
import { JobService } from './jobs/services/job.service';
import { MessageService } from './message/services/message.service';
import { ActivityService } from './activity/activity.service';
import { ImageUploadComponent } from './_components/image-upload/image-upload.component';
import { ImageService } from './_services/image-upload.service';
import { ResetPasswordDialogComponent } from './sign-in/reset-password/reset-password-dialog/reset-password-dialog.component';
import { AcceptTermsDialogComponent } from './sign-in/accept-terms/accept-terms-dialog.component';
import { AcceptTermsService } from './sign-in/accept-terms/accept-terms.service';
import { ResetPasswordService } from './sign-in/reset-password/reset-password.service';
import { NewPasswordComponent } from './sign-in/reset-password/new-password/new-password.component';
import { RequestMaintenanceComponent } from './jobs/request-maintenance/request-maintenance.component';
import { MaintenanceListComponent } from './jobs/maintenance-list/maintenance-list.component';
import { JobTaskDetailComponent } from './jobs/jobtask-detail/jobtask-detail.component';
import { JobPhotosComponent } from './jobs/job-photos/job-photos.component';
import { AboutComponent, HelpComponent, TermsComponent } from './layout/index';
import { DocumentService } from './documents/document.service';
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { ActivityFeedService } from './activity-feed/services/activity-feed.service';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { PaymentHistoryChartComponent } from './_components/payment-history-chart/payment-history-chart.component';
import { ChartsModule } from 'ng2-charts';
import { UpcomingEventsComponent } from './upcoming-event/upcoming-events/upcoming-events.component';
import { UpcomingEventInvoiceComponent } from './upcoming-event/upcoming-event-invoice/upcoming-event-invoice.component';
import { UpcomingEventRentAdjustComponent } from './upcoming-event/upcoming-event-rent-adjust/upcoming-event-rent-adjust.component';
import { UpcomingEventAgreementEndComponent } from './upcoming-event/upcoming-event-agreement-end/upcoming-event-agreement-end.component';
import { UpcomingEventRentDueComponent } from './upcoming-event/upcoming-event-rent-due/upcoming-event-rent-due.component';
import { UpcomingEventMoveOutComponent } from './upcoming-event/upcoming-event-move-out/upcoming-event-move-out.component';
import { UpcomingEventInspectionComponent } from './upcoming-event/upcoming-event-inspection/upcoming-event-inspection.component';
import { CloseEventComponent } from './upcoming-event/close-event/close-event.component';
import { CommonActionsComponent } from './_components/common-actions/common-actions.component';
import { TransactionHistoryComponent } from './transactions/transaction-history/transaction-history.component';
import { TransactionCardComponent } from './transactions/transaction-card/transaction-card.component';
import { TransactionReportComponent } from './transactions/transaction-report/transaction-report.component';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { AgentPreviewComponent } from './sign-in/agent-preview/agent-preview.component';
import { ActivityFeedAgreementEndComponent } from './activity-feed/activity-feed-agreement-end/activity-feed-agreement-end.component';
import { ActivityFeedMoveOutComponent } from './activity-feed/activity-feed-move-out/activity-feed-move-out.component';
import { UpcomingEventBondArrearsComponent } from './upcoming-event/upcoming-event-bond-arrears/upcoming-event-bond-arrears.component';
import { RaygunErrorHandler } from './app.raygun.setup';
import { MessageAgentComponent } from './message/message-agent/message-agent.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    AgentCardComponent,
    RentingCardComponent,
    ActivityFeedComponent,
    ActivityFeedJobComponent,
    ActivityFeedDocComponent,
    NavigationComponent,
    NavCardComponent,
    ErrorAlertComponent,
    ErrorComponent,
    ConnectDialogComponent,
    SignInDialogComponent,
    ProfileComponent,
    GetInitialsPipe,
    ServerUrlPipe,
    ManagerAppUrlPipe,
    PMCurrencyPipe,
    LocalDatePipe,
    FormatDatePipe,
    InspecitonTypePipe,
    DaysInArrearsPipe,
    FormatTimePipe,
    AddressTextPipe,
    FormatFileSizePipe,
    EditComponent,
    FormFieldComponent,
    SignUpEmailComponent,
    ActviateComponent,
    LoadingComponent,
    HomeComponent,
    ImageUploadComponent,
    ResetPasswordDialogComponent,
    NewPasswordComponent,
    RequestMaintenanceComponent,
    MaintenanceListComponent,
    JobTaskDetailComponent,
    JobPhotosComponent,
    AboutComponent,
    HelpComponent,
    TermsComponent,
    ChangePasswordDialogComponent,
    ChangeEmailDialogComponent,
    ActivateEmailComponent,
    DocumentListComponent,
    RentingsComponent,
    ActivityFeedPaymentComponent,
    ActivityFeedInspectionComponent,
    PaymentHistoryChartComponent,
    ProfileCardComponent,
    ActivityListComponent,
    UpcomingEventsComponent,
    UpcomingEventInvoiceComponent,
    UpcomingEventRentAdjustComponent,
    UpcomingEventAgreementEndComponent,
    UpcomingEventRentDueComponent,
    UpcomingEventMoveOutComponent,
    UpcomingEventInspectionComponent,
    CloseEventComponent,
    CommonActionsComponent,
    TransactionHistoryComponent,
    TransactionCardComponent,
    TransactionReportComponent,
    TransactionComponent,
    AgentPreviewComponent,
    ActivityFeedAgreementEndComponent,
    ActivityFeedMoveOutComponent,
    UpcomingEventBondArrearsComponent,
    ToastMessageComponent,
    MessageAgentComponent,
    AcceptTermsDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ChartsModule,
    routing,
    NgbModule.forRoot(),
    ToastyModule.forRoot()
  ],
  providers: [
    CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'en-au' },
    { provide: ErrorHandler, useClass: PortalErrorHandlerService },
    { provide: PortalClientFactory, useClass: ClientFactoryService },
    AuthGuard,
    TenantGuard,
    AuthenticationService,
    TestService,
    AppWideEventService,
    MemberService,
    SignUpService,
    TenancyService,
    AgentService,
    PropertyService,
    JobService,
    ActivityService,
    DocumentService,
    ImageService,
    ResetPasswordService,
    ActivityFeedService,
    PortalLocalStorage,
    PortalCookieStorage,
    PortalSession,
    UtilityService,
    UpcomingEventService,
    TransactionsService,
    ToastMessageService,
    RouterExtService,
    MessageService,
    AcceptTermsService,
    { provide: ErrorHandler, useClass: RaygunErrorHandler}
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ErrorAlertComponent,
    ConnectDialogComponent,
    SignInDialogComponent,
    SignUpEmailComponent,
    ResetPasswordDialogComponent,
      AcceptTermsDialogComponent,
    JobPhotosComponent,
    JobTaskDetailComponent,
    TransactionReportComponent,
    AgentPreviewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
