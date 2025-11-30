import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultEditor } from './vault-editor';

describe('VaultEditor', () => {
  let component: VaultEditor;
  let fixture: ComponentFixture<VaultEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
