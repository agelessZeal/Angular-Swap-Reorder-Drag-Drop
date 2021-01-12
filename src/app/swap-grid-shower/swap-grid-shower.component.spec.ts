import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapGridShowerComponent } from './swap-grid-shower.component';

describe('SwapGridShowerComponent', () => {
  let component: SwapGridShowerComponent;
  let fixture: ComponentFixture<SwapGridShowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapGridShowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapGridShowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
