import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPeopleEditorComponent } from './group-people-editor.component';

describe('GroupPeopleEditorComponent', () => {
  let component: GroupPeopleEditorComponent;
  let fixture: ComponentFixture<GroupPeopleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPeopleEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPeopleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
