import { SessionStorageService } from '../service/storage/session-storage.service';
import { ParserService } from '../service/parser/parser.service';

export abstract class DataDefinition {
  entity: string;

  constructor(protected stg: SessionStorageService, protected parser: ParserService){ }

  abstract storage(row: { [index: string]: any }): void;

  label (id: string | number): string {
    /**
     * etiqueta de identificacion
     * sobrescribir si la entidad se identifica con campos diferentes de id
     * si se sobrescribe, cuidado con las recursiones infinitas
     * es necesario pasar como parametro a dd para evitar dependencia ciclica
     * analizar la posibilidad de descartar el uso de dd
     */
    var row = this.stg.getItem(this.entity + id);
    if(!row) return null;
 
    let ret = "";
    if (row["id"]) ret = ret + " " + row["id"];
    return ret;
  }

}
