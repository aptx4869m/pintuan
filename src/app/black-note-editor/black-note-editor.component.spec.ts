import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackNoteEditorComponent } from './black-note-editor.component';

describe('BlackNoteEditorComponent', () => {
  let component: BlackNoteEditorComponent;
  let fixture: ComponentFixture<BlackNoteEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlackNoteEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackNoteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
