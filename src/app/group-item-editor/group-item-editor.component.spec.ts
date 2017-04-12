import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupItemEditorComponent } from './group-item-editor.component';

describe('GroupItemEditorComponent', () => {
  let component: GroupItemEditorComponent;
  let fixture: ComponentFixture<GroupItemEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupItemEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
