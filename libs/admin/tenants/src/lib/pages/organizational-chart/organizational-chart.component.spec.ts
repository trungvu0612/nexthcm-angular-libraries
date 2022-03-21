import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalChartComponent } from './organizational-chart.component';

describe('OrganizationalChartComponent', () => {
  let component: OrganizationalChartComponent;
  let fixture: ComponentFixture<OrganizationalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationalChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
