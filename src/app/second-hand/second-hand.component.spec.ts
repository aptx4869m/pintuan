import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondHandComponent } from './second-hand.component';

describe('SecondHandComponent', () => {
  let component: SecondHandComponent;
  let fixture: ComponentFixture<SecondHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
