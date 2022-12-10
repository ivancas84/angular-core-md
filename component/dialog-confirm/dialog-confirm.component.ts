import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@class/dialog-data';


@Component({
  selector: 'core-dialog-confirm',
  templateUrl: './dialog-confirm.component.html'
})
export class DialogConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  showMessage(){
    if(typeof this.data.message == "string") return this.data.message
    else return JSON.stringify(this.data.message);
  }
}

