import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllWorkComponent } from './all-work.component';

describe('AllWorkComponent', () => {
  let component: AllWorkComponent;
  let fixture: ComponentFixture<AllWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
