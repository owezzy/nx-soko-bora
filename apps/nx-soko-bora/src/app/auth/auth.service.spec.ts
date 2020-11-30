import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { commonTestingModules } from '../common/common.testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [commonTestingModules],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
