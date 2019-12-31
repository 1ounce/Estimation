import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairEstimationComponent } from './repair-estimation.component';

describe('RepairEstimationComponent', () => {
  let component: RepairEstimationComponent;
  let fixture: ComponentFixture<RepairEstimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairEstimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
