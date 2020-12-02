import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'core-backup',
  templateUrl: './backup.component.html',
})
export class BackupComponent implements OnDestroy {

  readonly entityName: string = "system";
  protected subscriptions = new Subscription(); //suscripciones en el ts

  constructor( 
    protected dd: DataDefinitionService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
  ) {}

  onSubmit(){
    var s = this.dd._post("backup", this.entityName).subscribe(
      () => {
        this.snackBar.open("Backup realizado correctamente", "X");       
      },
      error => { 
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
      }
    );
    this.subscriptions.add(s);
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}

