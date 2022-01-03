import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'show-image-dialog',
  templateUrl: 'show-image.html',
  styleUrls: ['./show-image.css']
})
export class ShowImageComponent {
  image: SafeUrl;
  caption: string;

  constructor(
    private domSanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ShowImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageDialogData
  ) {
    this.image = this.domSanitizer.bypassSecurityTrustUrl(data.image);
    this.caption = data.caption;
  }
}

export interface ImageDialogData {
  image: string;
  caption: string
}
