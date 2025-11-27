import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectValidation } from './project-validation';

describe('ProjectValidation', () => {
  let component: ProjectValidation;
  let fixture: ComponentFixture<ProjectValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
