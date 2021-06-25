import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Policy } from '../../models/policy';

@Component({
  selector: 'hcm-policy',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoliciesComponent {
  data: Policy[] = [];
}
