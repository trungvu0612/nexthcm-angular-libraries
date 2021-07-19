import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KnowledgeBaseService } from '../../knowledge-base.service';
import { Policy } from '../../models/policy';

@Component({
  selector: 'hcm-policy-detail',
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyDetailComponent implements OnInit {
  id!: string;
  data$!: Observable<Policy>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private policiesService: KnowledgeBaseService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.get();
  }

  get(): void {
    if (this.id) {
      this.data$ = this.policiesService.getPolicy(this.id);
    }
  }
}
