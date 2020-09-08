import { Component, Inject, OnInit } from '@angular/core';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'core-clear-cache',
  templateUrl: './clear-cache.component.html'
})
export class ClearCacheComponent implements OnInit {

  constructor(
    protected storage: SessionStorageService, 
    protected location: Location
  ) { }

  ngOnInit(): void {
    this.storage.clear();
  }

  back() { this.location.back(); }

}
