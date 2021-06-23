import { async, TestBed } from '@angular/core/testing';
import { AdminJobLevelModule } from './admin-job-level.module';

describe('AdminJobLevelModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminJobLevelModule]
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AdminJobLevelModule).toBeDefined();
  });
});
