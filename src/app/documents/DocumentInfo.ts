import { ListResponseBase } from '../_common/list-response-base';
import { PortalResponse } from '../_services';

export class SimpleDocumentInfo {
  Id : string;
  FileName: string;
  Size: number;
  CreatedOn : Date;

}

export class DocumentInfo extends SimpleDocumentInfo {
  FileType : string;
  Tags: string[];
  DocumentType: string;
  DocumentArea : string;
  IsReadOnly : boolean;
}

export class DocumentInfoList extends ListResponseBase<DocumentInfo> {  }
