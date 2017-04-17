import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPeopleItemEditorComponent } from './group-people-item-editor.component';

describe('GroupPeopleItemEditorComponent', () => {
  let component: GroupPeopleItemEditorComponent;
  let fixture: ComponentFixture<GroupPeopleItemEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPeopleItemEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPeopleItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
