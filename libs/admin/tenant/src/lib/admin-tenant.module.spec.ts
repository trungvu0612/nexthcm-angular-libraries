import { async, TestBed } from '@angular/core/testing';
import { AdminTenantModule } from './admin-tenant.module';

describe('AdminTenantModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminTenantModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AdminTenantModule).toBeDefined();
  });
});
