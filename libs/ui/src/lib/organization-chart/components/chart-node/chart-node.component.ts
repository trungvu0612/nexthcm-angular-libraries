import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Node } from '../../models/node';
import { NodeSelectService } from '../../services/node-select.service';

@Component({
  selector: 'hcm-chart-node',
  templateUrl: './chart-node.component.html',
  styleUrls: ['./chart-node.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state(
        'expanded',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      state(
        'collapsed',
        style({
          transform: 'translateY(-50px)',
          opacity: 0,
        })
      ),
      transition('expanded => collapsed', [animate('0.2s')]),
      transition('collapsed => expanded', [animate('0.2s')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartNodeComponent implements OnInit {
  @Input() datasource!: Node;
  @Input() nodeHeading: any;
  @Input() nodeContent: any;
  @Input() nodeTemplate!: TemplateRef<any> | undefined;
  @Input() groupScale!: number;
  @Input() select!: string;

  @Output() nodeClick = new EventEmitter<any>();

  Arr = Array; // Array type captured in a variable
  isCollapsed = false;
  ecStyles: any;
  isSelected: boolean | undefined;
  subscription: Subscription;

  constructor(private nodeSelectService: NodeSelectService) {
    // subscribe to node selection status
    this.subscription = this.nodeSelectService.getSelect().subscribe((selection) => {
      if (selection && selection.id) {
        this.isSelected = this.datasource.id === selection.id;
      } else {
        // clear selection when empty selection received
        this.isSelected = false;
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngOnInit() {}

  toggleChildren() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleAnimStart(event: any) {
    if (this.isCollapsed) {
      // 如果折叠的是根结点的子节点，那么根结点向下的连接线需要隐藏
      if (
        event.element.parentElement &&
        event.element.parentElement.parentElement &&
        event.element.parentElement.parentElement.classList.contains('orgchart')
      ) {
        event.element.previousElementSibling.classList.add('oc-is-collapsed');
      }
    } else {
      // 刚一展开的时候，需要马上把子节点们显示出来，以便看到“下滑”效果
      this.ecStyles = {
        display: 'flex',
      };
    }
  }

  toggleAnimEnd(event: any) {
    if (this.isCollapsed) {
      // 折叠时，“上滑”动画结束后，需要将子节点们隐藏，以便其不占用空间
      this.ecStyles = {
        display: 'none',
      };
    } else {
      // 如果展开的是根结点的子节点，那么根结点向下的连接线需要显示
      if (
        event.element.parentElement &&
        event.element.parentElement.parentElement &&
        event.element.parentElement.parentElement.classList.contains('orgchart')
      ) {
        event.element.previousElementSibling.classList.remove('oc-is-collapsed');
      }
    }
  }

  onClickNode(e: any) {
    this.nodeClick.emit(this.datasource);
    if (this.select === 'single') {
      this.nodeSelectService.sendSelect(this.datasource.id);
    } else if (this.select === 'multiple') {
      this.isSelected = !this.isSelected;
    }
  }

  onNodeClick(e: any) {
    this.nodeClick.emit(e);
  }
}
