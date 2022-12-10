import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { AppMaterialModule } from "./app-material.module";

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { CookieService } from "ngx-cookie-service";
import { CommonModule, registerLocaleData } from "@angular/common";

import localeEsAr from '@angular/common/locales/es-AR';
import { ToDatePipe } from "@pipe/to-date.pipe";
import { ToTimePipe } from "@pipe/to-time.pipe";
import { SiNoPipe } from "@pipe/si-no.pipe";
import { StoragePipe } from "@pipe/storage.pipe";
import { SummaryPipe } from "@pipe/summary.pipe";
import { DataDefinitionService } from "@service/data-definition/data-definition.service";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { DialogConfirmComponent } from "@component/dialog-confirm/dialog-confirm.component";
import { InputSearchGoComponent } from "@component/input-search-go/input-search-go.component";
import { LabelComponent } from "@component/label/label.component";
import { AppRoutingModule } from "@config/app-routing.module";
import { HomeComponent } from "@component/home/home.component";
import { ControlDirective } from "@directive/control.directive";
import { ValidatorsService } from "@service/validators/validators.service";
import { DataDefinitionStorageService } from "@service/data-definition/data-definition-storage-service";
import { BackupComponent } from "@component/backup/backup.component";
import { CustomDateFormatDdMmYyyy, CustomDateFormatYyyy, CustomDateFormatYyyyMm } from "@directive/date.directive";

registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
  declarations: [
    ToDatePipe,
    ToTimePipe,
    SiNoPipe, 
    SummaryPipe, 
    StoragePipe,

    ControlDirective,
    CustomDateFormatYyyy,
    CustomDateFormatYyyyMm,
    CustomDateFormatDdMmYyyy,

    /**************************************************************************
     * Lista de componentes
     *************************************************************************/
    HomeComponent,
    DialogAlertComponent,
    DialogConfirmComponent,
    InputSearchGoComponent,
    BackupComponent,
    LabelComponent,
    
  ],
  exports: [
    ToDatePipe,
    ToTimePipe,
    SiNoPipe, 
    SummaryPipe, 
    StoragePipe, 

    ControlDirective,
    CustomDateFormatYyyy,
    CustomDateFormatYyyyMm,
    CustomDateFormatDdMmYyyy,

    DialogAlertComponent,
    DialogConfirmComponent,
    InputSearchGoComponent,
    BackupComponent,
    LabelComponent,
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    //SocialLoginModule,
    //ClipboardModule,

    AppMaterialModule,

    MaterialFileInputModule,
    //MatTimepickerModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, verticalPosition:"top", horizontalPosition:"right"}},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    CookieService,

    DataDefinitionService,
    DataDefinitionToolService,
    SessionStorageService,
    ValidatorsService,
    
    DataDefinitionStorageService, 
    /**
     * Este servicio debe existir en la app
     */

    /*{provide: 'SocialAuthServiceConfig', useValue: { autoLogin: false,  providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
      },
    ]} as SocialAuthServiceConfig, }*/

  ],
})
export class AppCoreModule {}
