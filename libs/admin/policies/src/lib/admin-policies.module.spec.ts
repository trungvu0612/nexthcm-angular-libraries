import { async, TestBed } from '@angular/core/testing';
import { AdminPoliciesModule } from './admin-policies.module';

describe('AdminPoliciesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminPoliciesModule]
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AdminPoliciesModule).toBeDefined();
  });
});
