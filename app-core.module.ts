import { HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputTextComponent } from "@component/input-text/input-text.component";
import { InputYearComponent } from '@component/input-year/input-year.component';
import { AppRoutingModule } from "@config/app-routing.module";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { AppMaterialModule } from "./app-material.module";

import { TextareaComponent } from '@component/textarea/textarea.component';
import { ControlDateComponent } from "@component/control-date/control-date.component";
import { ControlLabelComponent } from "@component/control-label/control-label.component";
import { ControlValueComponent } from "@component/control-value/control-value.component";
import { FieldWrapComponent } from "@component/field-wrap/field-wrap.component";
import { AbstractControlViewComponent } from "@component/abstract-control-view/abstract-control-view.component";
import { InputAutocompleteComponent } from "@component/input-autocomplete/input-autocomplete.component";
import { InputAutocompleteValueComponent } from "@component/input-autocomplete-value/input-autocomplete-value.component";
import { InputCheckboxComponent } from "@component/input-checkbox/input-checkbox.component";
import { InputDateComponent } from "@component/input-date/input-date.component";
import { InputSelectCheckboxComponent } from "@component/input-select-checkbox/input-select-checkbox.component";
import { InputSelectComponent } from "@component/input-select/input-select.component";
import { InputSelectParamComponent } from "@component/input-select-param/input-select-param.component";
import { InputYmComponent } from "@component/input-ym/input-ym.component";
import { InputSelectValueComponent } from "@component/input-select-value/input-select-value.component";
import { InputSelectLabelComponent } from "@component/input-select-label/input-select-label.component";
import { InputSearchGoComponent } from "@component/input-search-go/input-search-go.component";
import { InputPersistComponent } from "@component/input-persist/input-persist.component";
import { FieldWrapCardComponent } from "@component/field-wrap-card/field-wrap-card.component";
import { FieldWrapRouterLinkComponent } from "@component/field-wrap-router-link/field-wrap-router-link.component";
import { EventButtonComponent } from "@component/event-button/event-button.component";
import { EventIconComponent } from "@component/event-icon/event-icon.component";
import { LinkTextComponent } from "@component/link-text/link-text.component";
import { RouteIconComponent } from "@component/route-icon/route-icon.component";
import { CardDynamicComponent } from "@component/card/card-dynamic.component";
import { ErrorUniqueRouteComponent } from "@component/error-unique/error-unique-route.component";
import { FieldLabelComponent } from "@component/field-label/field-label.component";
import { FieldTreeLabelComponent } from "@component/field-tree-label/field-tree-label.component";
import { FieldTreeComponent } from "@component/field-tree/field-tree.component";
import { FieldsetArrayDynamicComponent } from "@component/fieldset-array/fieldset-array-dynamic.component";
import { FieldsetOptionsComponent } from "@component/fieldset-options/fieldset-options.component";
import { FieldsetDynamicComponent } from "@component/fieldset/fieldset-dynamic.component";
import { LabelComponent } from "@component/label/label.component";
import { RelLabelComponent } from "@component/rel-label/rel-label.component";
import { SearchDynamicComponent } from "@component/search/search-dynamic.component";
import { TableDynamicComponent } from "@component/table/table-dynamic.component";
import { ControlDirective } from "@directive/control.directive";
import { BackupComponent } from "@component/backup/backup.component";
import { DialogAlertComponent } from "@component/dialog-alert/dialog-alert.component";
import { DialogConfirmComponent } from "@component/dialog-confirm/dialog-confirm.component";
import { HomeComponent } from "@component/home/home.component";
import { LoginComponent } from "@component/login/login.component";
import { LogoutComponent } from "@component/logout/logout.component";
import { SocialLoginComponent } from "@component/social-login/social-login.component";
import { SiNoPipe } from "@pipe/si-no.pipe";
import { StoragePipe } from "@pipe/storage.pipe";
import { SummaryPipe } from "@pipe/summary.pipe";
import { ToDatePipe } from "@pipe/to-date.pipe";
import { ToTimePipe } from "@pipe/to-time.pipe";
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { AuthService } from "@service/auth/auth.service";
import { DataDefinitionLabelService } from "@service/data-definition-label/data-definition-label.service";
import { DataDefinitionRelLabelService } from "@service/data-definition/data-definition-rel-label.service";
import { DataDefinitionStorageService } from "@service/data-definition/data-definition-storage-service";
import { DataDefinitionToolService } from "@service/data-definition/data-definition-tool.service";
import { DataDefinitionService } from "@service/data-definition/data-definition.service";
import { SessionStorageService } from "@service/storage/session-storage.service";
import { ValidatorsService } from "@service/validators/validators.service";
import { CookieService } from "ngx-cookie-service";
import { CommonModule, registerLocaleData } from "@angular/common";

import localeEsAr from '@angular/common/locales/es-AR';
import { ControlBooleanComponent } from "@component/control-boolean/control-boolean.component";
registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
  declarations: [
    ToDatePipe, 
    ToTimePipe, 
    SiNoPipe, 
    SummaryPipe, 
    StoragePipe,

    LoginComponent,
    SocialLoginComponent,
    LogoutComponent,
    HomeComponent,
    BackupComponent,

    DialogAlertComponent,
    DialogConfirmComponent,
    ControlValueComponent,
    ControlLabelComponent,
    ControlDateComponent,
    InputTextComponent,
    InputYearComponent,
    TextareaComponent,
    InputCheckboxComponent,
    InputDateComponent,
    FieldWrapComponent,
    AbstractControlViewComponent,
    InputAutocompleteComponent,
    InputAutocompleteValueComponent,
    InputSelectCheckboxComponent,
    InputSelectComponent,
    InputSelectParamComponent,
    InputYmComponent,
    InputSelectValueComponent,
    InputSelectLabelComponent,
    InputSearchGoComponent,
    InputPersistComponent,
    FieldWrapCardComponent,
    FieldWrapRouterLinkComponent,
    RouteIconComponent,
    LinkTextComponent,
    EventButtonComponent,
    EventIconComponent,
    //InputTimepickerComponent,
    LabelComponent,
    FieldLabelComponent,
    FieldTreeLabelComponent,
    FieldTreeComponent,
    TableDynamicComponent,
    CardDynamicComponent,
    FieldsetDynamicComponent,
    FieldsetOptionsComponent,
    FieldsetArrayDynamicComponent,
    SearchDynamicComponent,
    ErrorUniqueRouteComponent,
    RelLabelComponent,
    ControlDirective,
    ControlBooleanComponent,
  ],
  exports: [
    ToDatePipe, 
    ToTimePipe, 
    SiNoPipe, 
    SummaryPipe, 
    StoragePipe,

    LoginComponent,
    SocialLoginComponent,
    LogoutComponent,
    HomeComponent,
    BackupComponent,

    DialogAlertComponent,
    DialogConfirmComponent,
    ControlValueComponent,
    ControlLabelComponent,
    ControlDateComponent,
    ControlBooleanComponent,
    InputTextComponent,
    InputYearComponent,
    TextareaComponent,
    InputCheckboxComponent,
    InputDateComponent,
    FieldWrapComponent,
    AbstractControlViewComponent,
    InputAutocompleteComponent,
    InputAutocompleteValueComponent,
    InputSelectCheckboxComponent,
    InputSelectComponent,
    InputSelectParamComponent,
    InputYmComponent,
    InputSelectValueComponent,
    InputSelectLabelComponent,
    InputSearchGoComponent,
    InputPersistComponent,
    FieldWrapCardComponent,
    FieldWrapRouterLinkComponent,
    RouteIconComponent,
    LinkTextComponent,
    EventButtonComponent,
    EventIconComponent,
    //InputTimepickerComponent,
    LabelComponent,
    FieldLabelComponent,
    FieldTreeLabelComponent,
    FieldTreeComponent,
    TableDynamicComponent,
    CardDynamicComponent,
    FieldsetDynamicComponent,
    FieldsetOptionsComponent,
    FieldsetArrayDynamicComponent,
    SearchDynamicComponent,
    ErrorUniqueRouteComponent,
    RelLabelComponent,
    ControlDirective,
    //DynamicTableComponent,
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
    
    AuthService,
    DataDefinitionService, 
    DataDefinitionToolService,
    SessionStorageService, 
    ValidatorsService,
    
    DataDefinitionStorageService, 
    DataDefinitionLabelService,
    DataDefinitionRelLabelService, 

    /*{provide: 'SocialAuthServiceConfig', useValue: { autoLogin: false,  providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
      },
    ]} as SocialAuthServiceConfig, }*/

  ],
})
export class AppCoreModule {}
