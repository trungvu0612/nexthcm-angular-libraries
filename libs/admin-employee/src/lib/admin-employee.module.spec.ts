import { async, TestBed } from '@angular/core/testing';
import { AdminEmployeeModule } from './admin-employee.module';

describe('AdminEmployeeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminEmployeeModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AdminEmployeeModule).toBeDefined();
  });
});
