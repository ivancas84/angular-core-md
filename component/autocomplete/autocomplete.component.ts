import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ComponentToolsService } from '@service/component-tools/component-tools.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'core-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent implements OnInit {

  @Input() entity_name!: string;
  @Input() title: string = "";
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
      entity_name:this.entity_name,
      control:this.control,
      searchControl:this.searchControl,
    })
 
    this.loadAutocomplete$ = this.tools.labelAutocomplete({
      entity_name:this.entity_name,
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
