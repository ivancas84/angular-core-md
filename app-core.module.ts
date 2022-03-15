import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
//import { AppRoutingModule } from "@config/app-routing.module";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { AppMaterialModule } from "./app-material.module";

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { CookieService } from "ngx-cookie-service";
import { CommonModule, registerLocaleData } from "@angular/common";

import localeEsAr from '@angular/common/locales/es-AR';

registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
  declarations: [

  ],
  exports: [
   
  ],
  imports: [
    CommonModule,
    //AppRoutingModule,
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
    
    
    /*{provide: 'SocialAuthServiceConfig', useValue: { autoLogin: false,  providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
      },
    ]} as SocialAuthServiceConfig, }*/

  ],
})
export class AppCoreModule {}
