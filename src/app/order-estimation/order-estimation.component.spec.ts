import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEstimationComponent } from './order-estimation.component';

describe('OrderEstimationComponent', () => {
  let component: OrderEstimationComponent;
  let fixture: ComponentFixture<OrderEstimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEstimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
