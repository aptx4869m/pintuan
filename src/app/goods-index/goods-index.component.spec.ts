import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsIndexComponent } from './goods-index.component';

describe('GoodsIndexComponent', () => {
  let component: GoodsIndexComponent;
  let fixture: ComponentFixture<GoodsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
