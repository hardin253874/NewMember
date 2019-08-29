import { PortalResponse } from '../_services';

export class ListResponseBase<T> extends PortalResponse {
    List : T[];

    StartPage : number;

    HasMore : boolean;

    TotalRecords : number;
}
