import { TestBed } from '@angular/core/testing';

import { HistService } from './hist.service';

describe('HistService', () => {
  let service: HistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
