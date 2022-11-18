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
import { FieldWrapComponent } from "@component/field-wrap/field-wrap.component";
import { InputSearchGoComponent } from "@component/input-search-go/input-search-go.component";
import { AbstractControlViewComponent } from "@component/abstract-control-view/abstract-control-view.component";
import { ControlBooleanComponent } from "@component/control-boolean/control-boolean.component";
import { ControlDateComponent } from "@component/control-date/control-date.component";
import { ControlLabelComponent } from "@component/control-label/control-label.component";
import { ControlValueComponent } from "@component/control-value/control-value.component";
import { DownloadComponent } from "@component/download/download.component";
import { FieldWrapCardComponent } from "@component/field-wrap-card/field-wrap-card.component";
import { FieldWrapRouterLinkComponent } from "@component/field-wrap-router-link/field-wrap-router-link.component";
import { InputAutocompleteValueComponent } from "@component/input-autocomplete-value/input-autocomplete-value.component";
import { InputAutocompleteComponent } from "@component/input-autocomplete/input-autocomplete.component";
import { InputCheckboxComponent } from "@component/input-checkbox/input-checkbox.component";
import { InputDateComponent } from "@component/input-date/input-date.component";
import { InputSelectCheckboxComponent } from "@component/input-select-checkbox/input-select-checkbox.component";
import { InputSelectLabelComponent } from "@component/input-select-label/input-select-label.component";
import { InputSelectParamComponent } from "@component/input-select-param/input-select-param.component";
import { InputSelectValueComponent } from "@component/input-select-value/input-select-value.component";
import { InputSelectComponent } from "@component/input-select/input-select.component";
import { InputTextComponent } from "@component/input-text/input-text.component";
import { InputTimepicker2Component } from "@component/input-timepicker2/input-timepicker2.component";
import { InputUploadComponent } from "@component/input-upload/input-upload.component";
import { InputYearComponent } from "@component/input-year/input-year.component";
import { InputYmComponent } from "@component/input-ym/input-ym.component";
import { LabelComponent } from "@component/label/label.component";
import { TextareaComponent } from "@component/textarea/textarea.component";
import { RouteIconComponent } from "@component/route-icon/route-icon.component";
import { AppRoutingModule } from "@config/app-routing.module";
import { RouteTextComponent } from "@component/route-text/route-text.component";
import { LinkTextComponent } from "@component/link-text/link-text.component";
import { EventButtonComponent } from "@component/event-button/event-button.component";
import { EventIconComponent } from "@component/event-icon/event-icon.component";
import { HomeComponent } from "@component/home/home.component";
import { TableComponent } from "@component/structure/table.component";
import { ControlDirective } from "@directive/control.directive";
import { ValidatorsService } from "@service/validators/validators.service";
import { DataDefinitionStorageService } from "@service/data-definition/data-definition-storage-service";
import { SearchComponent } from "@component/search/search.component";
import { AbstractControlFormGroupComponent } from "@component/abstract-control-form-group/abstract-control-form-group.component";
import { DetailComponent } from "@component/structure/detail.component";
import { TableOneComponent } from "@component/structure/table-one.component";
import { LinkValueComponent } from "@component/link-value/link-value.component";
import { UploadComponent } from "@component/upload/upload.component";
import { BackupComponent } from "@component/backup/backup.component";
import { LinkIconComponent } from "@component/link-icon/link-icon.component";
import { ControlNumberComponent } from "@component/control-number/control-number.component";
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
    DetailComponent,
    DialogAlertComponent,
    DialogConfirmComponent,
    InputSearchGoComponent,
    SearchComponent,
    TableOneComponent,
    UploadComponent,
    /**
     * No hace falta declararla ya que es una clase semiabstracta, pero si no 
     * se declara, tira errores el template
     */
    //ErrorUniqueRouteComponent, 
    /**
     * @deprecated los ruteos para campos unicos deben manejarse como un even-
     * to o desde otro lugar
     */

    /**************************************************************************
     * Lista de componentes dinamicos definidos mediante una clase de configu-
     * racion
     *************************************************************************/
    AbstractControlViewComponent,
    AbstractControlFormGroupComponent,
    BackupComponent,
    ControlBooleanComponent,
    ControlDateComponent,
    ControlLabelComponent,
    ControlValueComponent,
    ControlNumberComponent,
    DownloadComponent,
    EventButtonComponent,
    EventIconComponent,
    // FieldLabelComponent,
    /**
     * @deprecated Debe ser refactorizado (se elimino para que no dispare e-
     * rrores, consultar la version anterior para una referencia)
     */
    // FieldTreeComponent,
    /**
     * @deprecated Debe ser refactorizado (se elimino para que no dispare e-
     * rrores, consultar la version anterior para una referencia)
     */
    // FieldTreeLabelComponent,
    /**
     * @deprecated Debe ser refactorizado (se elimino para que no dispare e-
     * rrores, consultar la version anterior para una referencia)
     */
    FieldWrapComponent,
    FieldWrapCardComponent,
    FieldWrapRouterLinkComponent,
    InputAutocompleteComponent,
    InputAutocompleteValueComponent,
    InputCheckboxComponent,
    InputDateComponent,
    InputSelectCheckboxComponent,
    InputSelectComponent,
    InputSelectLabelComponent,
    InputSelectParamComponent,
    InputSelectValueComponent,
    //InputPersistComponent,
    /**
     * @deprecated Debe ser refactorizado
     */
    InputTextComponent,
    //InputTimepickerComponent
    /**
     * @deprecated Para no depender de librerias no mantenidas de teceros, se
     * reemplazo por una implementacion mas sencilla InputTimepicker2
     */
    InputTimepicker2Component,
    InputYearComponent,
    InputYmComponent,
    InputUploadComponent,
    LabelComponent,
    LinkIconComponent,
    LinkTextComponent,
    LinkValueComponent,
    RouteIconComponent,
    RouteTextComponent,
    TableComponent,
    TextareaComponent,
    // ,
    // TableDynamicComponent,
    // CardDynamicComponent,
    // FieldsetDynamicComponent,
    // FieldsetOptionsComponent,
    // FieldsetArrayDynamicComponent,
    // SearchDynamicComponent,
    
    
    // RelLabelComponent,
    
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

    DetailComponent,
    DialogAlertComponent,
    DialogConfirmComponent,
    InputSearchGoComponent,
    SearchComponent,
    TableComponent,
    TableOneComponent,
    UploadComponent,

    AbstractControlViewComponent,
    AbstractControlFormGroupComponent,
    BackupComponent,
    ControlBooleanComponent,
    ControlDateComponent,
    ControlLabelComponent,
    ControlValueComponent,
    ControlNumberComponent,
    DownloadComponent,
    EventButtonComponent,
    EventIconComponent,
    FieldWrapComponent,
    FieldWrapCardComponent,
    FieldWrapRouterLinkComponent,
    InputAutocompleteComponent,
    InputAutocompleteValueComponent,
    InputCheckboxComponent,
    InputDateComponent,
    InputSelectCheckboxComponent,
    InputSelectComponent,
    InputSelectLabelComponent,
    InputSelectParamComponent,
    InputSelectValueComponent,
    InputTextComponent,
    InputTimepicker2Component,
    InputYearComponent,
    InputYmComponent,
    InputUploadComponent,
    LabelComponent,
    LinkTextComponent,
    LinkValueComponent,
    RouteIconComponent,
    RouteTextComponent,
    TextareaComponent,
    
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
