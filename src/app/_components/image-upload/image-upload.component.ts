import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ImageService } from '../../_services/image-upload.service';

export class FileHolder {
  public serverResponse: { status: number, response: any };
  public pending: boolean = false;

  constructor(public src: string, public file: File) {
  }
}

// https://github.com/aberezkin/ng2-image-upload/tree/master/src/image-upload

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() max: number = 100;
  @Input() url: string;
 // @Input() headers: Header[];
  @Input() preview: boolean = true;
  @Input() maxFileSize: number;
  @Input() withCredentials: boolean = false;
  @Input() partName: string;

  @Output()
  isPending: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  onFileUploadFinish: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();
  @Output()
  onRemove: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();

  files: FileHolder[] = [];
  showFileTooLargeMessage: boolean = false;

  private fileCounter: number = 0;
  private pendingFilesCounter: number = 0;

  isFileOver: boolean = false;

  @Input()
  buttonCaption: string = 'Select Images';
  @Input()
  dropBoxMessage: string = 'Drop your images here!';
  @Input()
  fileTooLargeMessage: string;

  constructor(private imageService: ImageService) {
  }

  ngOnInit() {
    if (!this.fileTooLargeMessage) {
      this.fileTooLargeMessage = 'An image was too large and was not uploaded.' + (this.maxFileSize ? (' The maximum file size is ' + this.maxFileSize / 1024) + 'KiB.' : '');
    }
  }

  fileChange(files: FileList) {
    const remainingSlots = this.countRemainingSlots();
    const filesToUploadNum = files.length > remainingSlots ? remainingSlots : files.length;

    if (this.url && filesToUploadNum != 0) {
      this.isPending.emit(true);
    }

    this.fileCounter += filesToUploadNum;
    this.showFileTooLargeMessage = false;
    this.uploadFiles(files, filesToUploadNum);
  }

  deleteFile(file: FileHolder): void {
    const index = this.files.indexOf(file);
    this.files.splice(index, 1);
    this.fileCounter--;

    this.onRemove.emit(file);
  }

  fileOver(isOver) {
    this.isFileOver = isOver;
  }

  private uploadFiles(files: FileList, filesToUploadNum: number) {
    for (let i = 0; i < filesToUploadNum; i++) {
      const file = files[i];

      if (this.maxFileSize && file.size > this.maxFileSize) {
        this.showFileTooLargeMessage = true;
        continue;
      }

      const img = document.createElement('img');
      img.src = window.URL.createObjectURL(file);

      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        const fileHolder: FileHolder = new FileHolder(event.target.result, file);

        this.uploadSingleFile(fileHolder);

        this.files.push(fileHolder);

      }, false);


      reader.readAsDataURL(file);
    }
  }

  private onResponse(response, fileHolder: FileHolder) {
    fileHolder.serverResponse = response;
    fileHolder.pending = false;

    this.onFileUploadFinish.emit(fileHolder);

    if (--this.pendingFilesCounter == 0) {
      this.isPending.emit(false);
    }
  }

  private uploadSingleFile(fileHolder: FileHolder) {
    if (this.url) {
      this.pendingFilesCounter++;
      fileHolder.pending = true;

      this.imageService
//        .postImage(this.url, fileHolder.file, this.headers, this.partName, this.withCredentials)
        .postImage(this.url, fileHolder.file, this.partName)
        .subscribe(
          response => this.onResponse(response, fileHolder),
          error => {
            this.onResponse(error, fileHolder);
            this.deleteFile(fileHolder);
          }
        );
    } else {
      this.onFileUploadFinish.emit(fileHolder);
    }
  }

  private countRemainingSlots() {
    return this.max - this.fileCounter;
  }
}
