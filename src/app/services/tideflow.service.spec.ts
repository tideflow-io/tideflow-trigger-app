import { TestBed } from '@angular/core/testing';

import { TideflowService } from './tideflow.service';

describe('TideflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TideflowService = TestBed.get(TideflowService);
    expect(service).toBeTruthy();
  });
});
