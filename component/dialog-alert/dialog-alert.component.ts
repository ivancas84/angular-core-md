import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: any;
  status?: string;
}

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html'
})
export class DialogAlertComponent { //v1

  constructor(
    public dialogRef: MatDialogRef<DialogAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  showMessage(){
    if(typeof this.data.message == "string") return this.data.message
    else return JSON.stringify(this.data.message);
  }
}
