import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapDragComponent } from './swap-drag.component';

describe('SwapDragComponent', () => {
  let component: SwapDragComponent;
  let fixture: ComponentFixture<SwapDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
