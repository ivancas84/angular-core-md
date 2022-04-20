import { Input, Component, ElementRef, ViewChild } from '@angular/core';

declare function copyFormatted(html): any;
declare function printHtml(html): any;

@Component({
  selector: 'core-card',
  template: '',
})
export abstract class CardComponent {
  /**
   * Componente card
   */

  @Input() data: any; //datos del formulario
  @Input() entityName: string; //entidad principal del componente
  @ViewChild("content", {read: ElementRef}) content: ElementRef; //contenido para copiar o imprimir
  

  copyContent(): void {
    if(this.content) copyFormatted(this.content.nativeElement.innerHTML);
  }

  printContent(): void {
    if(this.content) printHtml(this.content.nativeElement.innerHTML);
  }
}
