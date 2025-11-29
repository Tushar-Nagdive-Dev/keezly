import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

type FeatureStatus = 'done' | 'in-progress' | 'planned';

interface Feature {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;       // emoji or svg path
  status: FeatureStatus;
  route?: string;      // optional route to navigate when clicked
  cta?: string;        // button text (e.g., "Open", "Build", "Learn")
}

@Component({
  selector: 'app-feature-cards',
  imports: [CommonModule],
  templateUrl: './feature-cards.component.html',
  styleUrl: './feature-cards.component.scss',
})
export class FeatureCardsComponent {

  private router = inject(Router);

  // Update this list as features are implemented or planned.
  protected features: Feature[] = [
    { id: 'vault-list', title: 'Vault List', subtitle: 'Core', description: 'Grid/list view of saved credentials — the central dashboard.', icon: '📁', status: 'in-progress', route: '/vault', cta: 'Open' },
    { id: 'add-edit', title: 'Add / Edit Credential', subtitle: 'CRUD', description: 'Create and edit credentials with title, username, password, url and notes.', icon: '✏️', status: 'planned', route: '/vault/new', cta: 'Build' },
    { id: 'delete', title: 'Delete Item', subtitle: 'CRUD', description: 'Securely remove credentials with confirmation and audit trail.', icon: '🗑️', status: 'planned', cta: 'Build' },
    { id: 'reveal-copy', title: 'Reveal & Copy', subtitle: 'UX', description: 'Reveal password on-demand + copy to clipboard with auto-clear.', icon: '🔒', status: 'planned', cta: 'Implement' },
    { id: 'generator', title: 'Password Generator', subtitle: 'Utility', description: 'Generate secure passwords with complexity controls and passphrase option.', icon: '🔢', status: 'planned', cta: 'Add' },
    { id: 'search', title: 'Search & Filter', subtitle: 'UX', description: 'Quick search across title, username and URL; filter by tags & favorites.', icon: '🔎', status: 'planned', cta: 'Add' },
    { id: 'tags', title: 'Tags / Folders', subtitle: 'Organization', description: 'Organize credentials using tags and folders; Favorites support.', icon: '🏷️', status: 'planned', cta: 'Add' },
    { id: 'strength', title: 'Password Strength', subtitle: 'Security', description: 'zxcvbn-based strength meter and suggestions to improve passwords.', icon: '💪', status: 'planned', cta: 'Add' },
    { id: 'export', title: 'Export / Import (Encrypted)', subtitle: 'Backup', description: 'Download encrypted backup and import encrypted backup files safely.', icon: '📦', status: 'planned', cta: 'Add' },
    { id: 'autolock', title: 'Auto-lock & Session', subtitle: 'Security', description: 'Auto-lock on idle, lock on blur, manual lock button and logout.', icon: '⏱️', status: 'planned', cta: 'Add' },
    { id: 'totp', title: 'TOTP Authenticator', subtitle: 'Advanced', description: 'Store 2FA secrets and generate rotating codes (QR scanner + copy).', icon: '🔐', status: 'planned', cta: 'Future' },
    { id: 'attachments', title: 'Encrypted Attachments', subtitle: 'Advanced', description: 'Attach encrypted files to items (IDs, documents).', icon: '📎', status: 'planned', cta: 'Future' },
    { id: 'share', title: 'Secure Sharing (E2E)', subtitle: 'Pro', description: 'Share credentials end-to-end encrypted with other users.', icon: '🤝', status: 'planned', cta: 'Future' },
    { id: 'sync', title: 'Multi-device Sync', subtitle: 'Pro', description: 'Encrypted sync across devices via optional cloud or local Wi-Fi.', icon: '☁️', status: 'planned', cta: 'Future' },
  ];

  // simple helper to map status to class
  statusClass(s: FeatureStatus) {
    return {
      'done': 'status-done',
      'in-progress': 'status-inprogress',
      'planned': 'status-planned'
    }[s];
  }

  onAction(f: Feature) {
    if (f.route) {
      // navigate if route exists
      this.router.navigate([f.route]);
      return;
    }
    // fallback — provide quick feedback for planned features
    alert(`${f.title} — action: ${f.cta ?? 'Open'}\n\n${f.description}`);
  }

  onAlert(f: any) {
    alert(`${f.title} — action: ${f.cta ?? 'Open'}\n\n${f.description}`);
  }
}
