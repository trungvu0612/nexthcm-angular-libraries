import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

const CONTENT_LENGTH = 243;

@Component({
  selector: 'hcm-request-comment',
  templateUrl: './request-comment.component.html',
  styleUrls: ['./request-comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestCommentComponent {
  @Input() id = '';
  @Input() comment = '';
  @Input() wordLimit = CONTENT_LENGTH;

  isShowMore = false;

  toggleShowMore(): void {
    this.isShowMore = !this.isShowMore;
  }
}

@NgModule({
  declarations: [RequestCommentComponent],
  imports: [CommonModule],
  exports: [RequestCommentComponent],
})
export class RequestCommentComponentModule {}
