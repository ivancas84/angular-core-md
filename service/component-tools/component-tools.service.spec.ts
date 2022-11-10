import { TestBed } from '@angular/core/testing';

import { ComponentToolsService } from './component-tools.service';

describe('ComponentToolsService', () => {
  let service: ComponentToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
