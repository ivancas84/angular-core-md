import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Subscription } from 'rxjs';
import { DialogAlertComponent } from '@component/dialog-alert/dialog-alert.component';
import { logValidationErrors } from '@function/log-validation-errors';
import { markAllAsDirty } from '@function/mark-all-as-dirty';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from '@service/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isSubmitted: boolean = false;
  form: FormGroup = this.fb.group({});
  protected subscriptions = new Subscription();

  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar,
    protected auth: AuthService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      user: [null, {
        validators: [Validators.required],
      }],
      password: [null, {
        validators: [Validators.required],
      }],
    });
  }

  reload(response){
    this.auth.login(response["jwt"]);


    /**
     * Redireccionar a login efectuado
     */
    this.snackBar.open("Login realizado", "X");
  }

  onSubmit(): void {
    this.isSubmitted = true;
    
    if (!this.form.valid) {
      this.cancelSubmit();
    } else {
      this.submit();
    }
  }

  cancelSubmit(){
    markAllAsDirty(this.form);
    logValidationErrors(this.form);
    const dialogRef = this.dialog.open(DialogAlertComponent, {
      data: {title: "Error", message: "El formulario posee errores."}
    });
    this.isSubmitted = false;
  }

  submit(){
    var s = this.dd.post("login", "user", this.form.value).subscribe(
      response => {
        this.reload(response);
      },
      error => { 
        console.log(error);
        this.dialog.open(DialogAlertComponent, {
          data: {title: "Error", message: error.error}
        });
        this.isSubmitted = false;
      }
    );
    this.subscriptions.add(s);
  }
  
  get user() { return this.form.get('user')}
  get password() { return this.form.get('password')}
}

