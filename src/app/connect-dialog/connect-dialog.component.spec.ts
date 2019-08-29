import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ConnectDialogComponent } from './connect-dialog.component';

describe('ConnectDialogComponent', () => {
  let component: ConnectDialogComponent;
  let fixture: ComponentFixture<ConnectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  ConnectDialogComponent ],
      imports: [NgbModule.forRoot()],
      providers: [NgbActiveModal],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(ConnectDialogComponent, {set: {template: ''}});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
