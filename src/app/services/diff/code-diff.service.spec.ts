import { TestBed } from '@angular/core/testing';

import { CodeDiffService } from './code-diff.service';

describe('CodeDiffService', () => {
  let service: CodeDiffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeDiffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
