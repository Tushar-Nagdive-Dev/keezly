import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultItemCard } from './vault-item-card';

describe('VaultItemCard', () => {
  let component: VaultItemCard;
  let fixture: ComponentFixture<VaultItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
