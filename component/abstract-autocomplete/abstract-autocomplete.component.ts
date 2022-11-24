import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ComponentToolsService } from '@service/component-tools/component-tools.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-abstract-autocomplete',
  template: ''
})
export abstract class AbstractAutocompleteComponent implements OnInit {

  entityName!: string;
  title: string = "";


  @Input() control!: AbstractControl //control

  loadAutocomplete$!: Observable<any>; //inicializar
  searchControl: FormControl = new FormControl(null); //control para busqueda, no interfiere con el control del fieldset principal
  filteredOptions$!: Observable<Array<{ [key: string]: any; }>>; //opciones de busqueda
  label: string = ""; //label para mostrar si hay inicializado un valor
  
  constructor(
    protected tools: ComponentToolsService,
  ) { }


  ngOnInit(): void {
    this.filteredOptions$ = this.tools.filteredOptionsAutocomplete({
      entityName:this.entityName,
      control:this.control,
      searchControl:this.searchControl,
    })
 
    this.loadAutocomplete$ = this.tools.labelAutocomplete({
      entityName:this.entityName,
      control:this.control,
      searchControl:this.searchControl,
    }).pipe(
         map(
           label => {
             this.label = label;
             return true;
           }
         )
       )

  }

}
