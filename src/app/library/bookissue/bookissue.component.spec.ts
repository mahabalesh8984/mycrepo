import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookissueComponent } from './bookissue.component';

describe('BookissueComponent', () => {
  let component: BookissueComponent;
  let fixture: ComponentFixture<BookissueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookissueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
