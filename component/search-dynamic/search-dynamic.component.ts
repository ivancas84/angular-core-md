import { Input, Component, OnInit } from '@angular/core';
import { SearchDynamicOptions } from '@class/search-dynamic-options';
import { SearchComponent } from '@component/search/search.component';

@Component({
  selector: 'core-search-dynamic',
  templateUrl: './search-dynamic.component.html',
})
export class SearchDynamicComponent extends SearchComponent implements OnInit {
  @Input() options: { [index: string]: any } = {}
  @Input() title: string = "Opciones"
  
  opt: SearchDynamicOptions;
     
  ngOnInit(): void {
    this.opt = new SearchDynamicOptions(this.options);
  }
  
}
