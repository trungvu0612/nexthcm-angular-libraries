import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingFileComponent } from './sharing-file.component';

describe('SharingFileComponent', () => {
  let component: SharingFileComponent;
  let fixture: ComponentFixture<SharingFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharingFileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
