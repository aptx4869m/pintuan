import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSingleItemEditorComponent } from './group-single-item-editor.component';

describe('GroupSingleItemEditorComponent', () => {
  let component: GroupSingleItemEditorComponent;
  let fixture: ComponentFixture<GroupSingleItemEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSingleItemEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSingleItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
