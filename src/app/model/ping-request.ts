import { RequestBase } from '../_common/request-base';


// @Route("/test/ping")
export class PingSec extends RequestBase<PingResponse> {
  Message: string;

  getTypeName() { return 'PingSec'; }
}

export class PingResponse
{
  Result: string;
}
