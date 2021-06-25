import { async, TestBed } from '@angular/core/testing';
import { AdminTeamBuildingAllowanceModule } from './admin-team-building-allowance.module';

describe('AdminTeamBuildingAllowanceModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AdminTeamBuildingAllowanceModule],
    }).compileComponents();
  }));

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AdminTeamBuildingAllowanceModule).toBeDefined();
  });
});
