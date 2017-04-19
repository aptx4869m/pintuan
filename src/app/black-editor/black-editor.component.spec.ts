import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackEditorComponent } from './black-editor.component';

describe('BlackEditorComponent', () => {
  let component: BlackEditorComponent;
  let fixture: ComponentFixture<BlackEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
