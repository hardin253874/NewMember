import { TenancyInfo } from '../renting-card/services/tenancy.service';
import { Injectable, EventEmitter }   from '@angular/core';
import { ConnectStatusTypes }         from './connect-status-types';
import { AgentInfo }       from '../agent-card/services/agent.service';
import { SessionInfo } from 'app/_services';

export class ErrorEvent {
  constructor(public message : string, public stack : string) { }
}

export class ConnectStatusEvent {
  constructor(public status : ConnectStatusTypes, public message : string) { }
}

export class NewSessionEvent {
  constructor(public session : SessionInfo) {  }
}

export class DefaultAgentEvent {
  constructor(public agent : AgentInfo) {  }
}

export class CheckAppVersionEvent {
  constructor() {}
}

export class SignInEvent {
    constructor() {}
}

export class MessageEvent {
    constructor(public type: string, public title: string,  public message: string) {}
}

@Injectable()
export class AppWideEventService {
  public unhandledError$       : EventEmitter<ErrorEvent>;
  public connectStatusEvent$   : EventEmitter<ConnectStatusEvent>;
  public newSessionEvent$      : EventEmitter<NewSessionEvent>;
  public defaultAgentEvent$    : EventEmitter<DefaultAgentEvent>;
  public currentTenantEvent$   : EventEmitter<TenancyInfo>;
  public checkAppVersionEvent$ : EventEmitter<CheckAppVersionEvent>;
  public signInEvent$          : EventEmitter<SignInEvent>;
  public messageEvent$         : EventEmitter<MessageEvent>;

  constructor() {
    this.unhandledError$ = new EventEmitter();
    this.connectStatusEvent$ = new EventEmitter();
    this.newSessionEvent$ = new EventEmitter();
    this.defaultAgentEvent$ = new EventEmitter();
    this.currentTenantEvent$ = new EventEmitter();
    this.checkAppVersionEvent$ = new EventEmitter();
    this.signInEvent$ = new EventEmitter();
    this.messageEvent$ = new EventEmitter();
  }

  public emitError(error) {
    this.unhandledError$.emit(new ErrorEvent(error.message, error.stack));
  }

  public emitConnectStatus(status : ConnectStatusTypes, message : string) {
    this.connectStatusEvent$.emit(new ConnectStatusEvent(status, message));
  }

  public emitNewSession(session : SessionInfo) {
    this.newSessionEvent$.emit(new NewSessionEvent(session));
  }

  public emitDefaultAgentEvent(agent : AgentInfo) {
    this.defaultAgentEvent$.emit(new DefaultAgentEvent(agent));
  }

  public emitCurrentTenantEvent(tenant : TenancyInfo) {
    this.currentTenantEvent$.emit(tenant);
  }

  public emitCheckAppVersion() {
    this.checkAppVersionEvent$.emit();
  }

  public emitMessageEvent(type: string, title: string, message: string) {
     this.messageEvent$.emit(new MessageEvent(type, title, message));
  }

  public emitSignInEvent() {
      this.signInEvent$.emit();
  }
}
