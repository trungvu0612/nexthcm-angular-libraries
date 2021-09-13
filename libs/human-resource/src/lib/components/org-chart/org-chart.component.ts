import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrgRes } from '../../models/node';
import { HumanResourceService } from '../../services/human-resource.service';

@Component({
  selector: 'hcm-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartComponent implements OnInit {
  @Input() data$!: Observable<OrgRes[]>;
  isHover?: boolean = false;

  open = true;
  index = 0;

  idLeader?: string = '';
  idEmployee = '';


  readonly context!: { $implicit: OrgRes[] };

  ctx = "Okeeeeeeeee";

  constructor(private humanResourceService: HumanResourceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onClick() {
    this.open = false;
    this.index = 1;
  }

  changeInfoCss(id: string): void {
    if (id == this.idLeader) {
      this.idLeader == '';
    } else {
      this.idLeader = id;
      this.data$ = this.humanResourceService.getOrg(id).pipe(map((data) => [data]));
    }
  }

  changeInfo(id: string): void {
    if (id == this.idLeader) {
      this.idLeader == '';
    } else {
      this.data$ = this.humanResourceService.getOrg(id).pipe(map((data) => [data]));
      this.idEmployee = id;
      this.idLeader = id;
    }
  }
}
