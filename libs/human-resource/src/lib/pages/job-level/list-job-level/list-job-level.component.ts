import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Level } from '../../../models/level';
import { JobLevelService } from '../../../services/job-level.service';

@Component({
  selector: 'hcm-list-job-level',
  templateUrl: './list-job-level.component.html',
  styleUrls: ['./list-job-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListJobLevelComponent implements OnInit {
  length = 0;
  index = 0;
  total = 0;

  levels!: Level[];

  constructor(private jobLevelService: JobLevelService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.jobLevelService.getLevels(this.index, 1).subscribe((item) => {
      this.length = item.totalPage;
      this.levels = item.items;
      this.cdr.detectChanges();
    });
  }

  readonly columns = ['name', 'description', 'action'];

  goToPage(index: number) {
    this.index = index;
  }
}
