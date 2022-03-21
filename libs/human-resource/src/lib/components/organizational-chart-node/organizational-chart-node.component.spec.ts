import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartNodeComponent } from './organizational-chart-node.component';

describe('OrganizationalChartNodeComponent', () => {
  let component: OrganizationalChartNodeComponent;
  let fixture: ComponentFixture<OrganizationalChartNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationalChartNodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalChartNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
