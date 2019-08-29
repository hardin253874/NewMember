import {FolioRequestBase, RequestBase} from '../_common/request-base';
import { ResponseStatus } from  'servicestack-client';
import {TenancyInfo, TenancyListInfo} from '../renting-card/services/tenancy.service';
import {AgentInfo} from '../agent-card/services/agent.service';

export class Authenticate extends RequestBase<AuthenticateResponse> {
  UserName: string;
  Password: string;
  Provider: string;

  RememberMe: boolean;
 // UseTokenCookie: boolean;

  getTypeName() { return 'Authenticate'; }
}

export class AgentPreviewAuthRequest extends RequestBase<AuthenticateResponse> {
  Token: string;
  ReferrerUrl: string;

  getTypeName() { return 'AgentPreviewAuthRequest'; }
}

export class PortfolioRequest extends RequestBase<PortfolioResponse> {
  Code: string;

  getTypeName() { return 'PortfolioRequest'; }
}

export class PortalSessionRequest extends FolioRequestBase<PortalSessionResponse> {
    getTypeName() { return 'GetPortalSession'; }
}

export class AuthenticateResponse {
  DisplayName: string;

  UserName: string;

  UserId: string;

  SessionId: string;

  responseStatus: ResponseStatus;

  Meta: any;

  ReferrerUrl: string;
}

export class PortfolioResponse {
  Id: string;
  CompanyName: string;
  PrintNameNextToLogo: boolean;
  LogoDocumentStorageId: string;

}

export class PortalSessionResponse {
    Agent: AgentInfo;
    TenancyList: TenancyInfo[];
}
