import { IReturn } from '@servicestack/client';

// only directly use it for none per folio based services
export class RequestBase<T> implements IReturn<T> {

  public createResponse(): T {
      return {} as T;
  }

  // please override the getTypeName if the client request class name is mismatched with service
  getTypeName(): string {
      // default: set client Request class name as the service Request class name
      return this.getClassName();
  }

  getClassName() : string {    
    return this.constructor.name;
  }
}

/// used for all per folio based services , and filter by FolioId
export class FolioRequestBase<T> extends RequestBase<T> {
   // global filters:
   FolioId : string;

   constructor() {
    super();
    this.FolioId = null;
   }
}

export class RequestListBase<T> extends FolioRequestBase<T> {
  PageSize : number;
  StartPage : number;
}
