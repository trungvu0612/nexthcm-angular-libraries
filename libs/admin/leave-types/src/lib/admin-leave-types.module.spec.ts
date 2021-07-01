import { async, TestBed } from '@angular/core/testing';
import { AdminLeaveTypesModule } from './admin-leave-types.module';

describe('AdminLeaveTypesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminLeaveTypesModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AdminLeaveTypesModule).toBeDefined();
  });
});
