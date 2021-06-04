import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrgRes } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';

@Component({
  selector: 'hcm-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationChartComponent implements OnInit {
  data: Observable<OrgRes[]> = this.humanResourceService.getOrg('').pipe(map((data) => [data]));

  constructor(private humanResourceService: HumanResourceService) {}

  ngOnInit(): void {}
}
