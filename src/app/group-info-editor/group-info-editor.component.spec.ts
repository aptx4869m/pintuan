import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInfoEditorComponent } from './group-info-editor.component';

describe('GroupInfoEditorComponent', () => {
  let component: GroupInfoEditorComponent;
  let fixture: ComponentFixture<GroupInfoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInfoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
