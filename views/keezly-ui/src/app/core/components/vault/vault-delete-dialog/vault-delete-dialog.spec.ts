import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultDeleteDialog } from './vault-delete-dialog';

describe('VaultDeleteDialog', () => {
  let component: VaultDeleteDialog;
  let fixture: ComponentFixture<VaultDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultDeleteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultDeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
