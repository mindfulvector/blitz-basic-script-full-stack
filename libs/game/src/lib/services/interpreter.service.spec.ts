import { TestBed } from '@angular/core/testing';

import { InterpreterService } from './interpreter.service';

describe('InterpreterService', () => {
  let service: InterpreterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(InterpreterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
