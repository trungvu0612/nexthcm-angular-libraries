import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { mxCell, mxEditor, mxEventObject, mxGraphModel, mxGraphSelectionModel } from 'mxgraph';

import {
  WorkflowAPI,
  WorkflowAPIType,
  WorkflowEvent,
  WorkflowEventType,
  WorkflowStatus,
  WorkflowTransition,
} from './models';
import mx from './utils/mxgraph';
import { WorkflowUtils } from './utils/workflow-utils';

@Component({
  selector: 'hcm-workflow-designer',
  templateUrl: './workflow-designer.component.html',
  styleUrls: ['./workflow-designer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowDesignerComponent implements OnInit {
  @ViewChild('splash', { static: true }) splash!: ElementRef<HTMLDivElement>;
  @Input() editMode = false;
  @Output() readonly event = new EventEmitter<WorkflowEventType>();

  originStatus!: mxCell;
  editor!: mxEditor;
  private initial = true;

  get graphModel(): mxGraphModel {
    return this.editor.graph.getModel();
  }

  get graphParent(): mxCell {
    return this.editor.graph.getDefaultParent();
  }

  get graphSelectionModel(): mxGraphSelectionModel {
    return this.editor.graph.getSelectionModel();
  }

  @HostListener('window:resize', ['$event']) onResize(): void {
    this.editor.graph.center();
  }

  ngOnInit(): void {
    this.configGraph();
    this.editor = WorkflowUtils.createEditor('config/workflow-designer.xml', this.splash.nativeElement);
    this.originStatus = this.drawStatus();
    this.editor.graph.center();
    this.editor.graph.setPanning(true);
    this.editor.graph.panningHandler.useLeftButtonForPanning = true;
    this.graphSelectionModel.addListener(mx.mxEvent.CHANGE, (sender) => this.handleSelectCell(sender));
    if (this.editMode) {
      this.editor.graph.setEnabled(true);
      this.editor.graph.setConnectable(true);
      this.editor.graph.connectionHandler.addListener(mx.mxEvent.CONNECT, (_, evt) => this.handleConnectEvent(evt));
      this.editor.graph.addListener(mx.mxEvent.CONNECT_CELL, (_, evt: mxEventObject) =>
        this.handleConnectCellEvent(evt)
      );
      this.editor.graph.addListener(mx.mxEvent.DOUBLE_CLICK, () => this.handleEditCell());
    }
  }

  apiEvent(api: WorkflowAPIType): string | void {
    return this.bindApi(api);
  }

  private getGraphXML(): string {
    return mx.mxUtils.getXml(new mx.mxCodec().encode(this.graphModel));
  }

  private configGraph(): void {
    mx.mxGraph.prototype.htmlLabels = true;
    mx.mxGraph.prototype.isWrapping = () => true;
    mx.mxConstants.DEFAULT_HOTSPOT = 1;
    mx.mxGraphHandler.prototype.guidesEnabled = true;
    mx.mxGuide.prototype.isEnabledForEvent = (evt) => !mx.mxEvent.isAltDown(evt as MouseEvent);
    mx.mxEdgeHandler.prototype.snapToTerminals = true;
    mx.mxGraph.prototype.disconnectOnMove = false;
    mx.mxGraph.prototype.allowDanglingEdges = false;
    mx.mxGraph.prototype.allowLoops = false;
    mx.mxGraph.prototype.setEdgeLabelsMovable(false);
    mx.mxGraph.prototype.setCellsEditable(false);
    mx.mxGraph.prototype.foldingEnabled = false;
    mx.mxConnectionHandler.prototype.connectImage = new mx.mxImage('/images/connector.gif', 16, 16);
    mx.mxGraphSelectionModel.prototype.setSingleSelection(true);
    mx.mxTooltipHandler.prototype.setHideOnHover(true);
  }

  private drawStatus(status?: WorkflowStatus, targetAll?: mxCell): mxCell {
    let cell: mxCell;
    const DEFAULT_WIDTH = 40;
    const DEFAULT_HEIGHT = 40;

    if (status) {
      cell = this.graphModel.cloneCell(this.editor.templates.subprocess);
      cell.setId(status.id);
      cell.setAttribute('label', status.label.toUpperCase());
      cell.setStyle(WorkflowUtils.setCellStyle(cell, status));
      cell.setGeometry(new mx.mxGeometry(-30, 100, 100, DEFAULT_HEIGHT));
    } else if (targetAll) {
      cell = this.graphModel.cloneCell(this.editor.templates.rhombus);
      cell.setAttribute('label', 'All');
      const targetGeometry = targetAll.getGeometry();
      cell.setGeometry(new mx.mxGeometry(targetGeometry.x + 200, targetGeometry.y, DEFAULT_WIDTH, DEFAULT_HEIGHT));
    } else {
      // origin status
      cell = this.graphModel.cloneCell(this.editor.templates.symbol);
      cell.setAttribute('label', '');
      cell.setGeometry(new mx.mxGeometry(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT));
    }
    this.graphModel.beginUpdate();
    try {
      this.editor.graph.addCell(cell, this.editor.graph.getDefaultParent());
    } finally {
      this.graphModel.endUpdate();
    }
    if (this.initial) {
      cell.setAttribute('initial', '1'); // mark as initial status
      this.initial = false;
    } else {
      this.graphSelectionModel.setCell(cell);
    }
    return cell;
  }

  private updateStatus(status: WorkflowStatus): void {
    const cell = this.graphModel.getCell(status.id);
    const value = cell.getValue();
    value.setAttribute('label', status.label.toUpperCase());
    this.graphModel.setValue(cell, value);
    this.graphModel.setStyle(cell, WorkflowUtils.setCellStyle(cell, status));
    this.graphSelectionModel.setCell(cell);
  }

  private drawTransition(transition: WorkflowTransition, statusAll?: mxCell): void {
    const source = transition.sourceId
      ? this.graphModel.getCell(transition.sourceId)
      : statusAll
      ? statusAll
      : this.originStatus;
    const target = this.graphModel.getCell(transition.targetId);
    const edge = this.graphModel.cloneCell(this.editor.templates.edge);
    edge.setId(transition.id);
    if (!statusAll) {
      edge.setAttribute('label', transition.label);
    } else {
      statusAll.setAttribute('transitionAll', transition.id);
    }
    this.graphModel.beginUpdate();
    try {
      this.editor.graph.addEdge(edge, this.graphParent, source, target);
    } finally {
      this.graphModel.endUpdate();
    }
    if (statusAll) {
      statusAll.setConnectable(false);
      mx.mxGraphSelectionModel.prototype.setSingleSelection(false);
      this.graphSelectionModel.setCells([target, edge, statusAll]);
      const groupCells: mxCell = this.editor.groupCells();
      this.editor.graph.setSelectionCell(groupCells);
      statusAll.setAttribute('group', groupCells.getId());
      target.setAttribute('group', groupCells.getId());
      mx.mxGraphSelectionModel.prototype.setSingleSelection(true);
    } else if (transition.sourceId) {
      this.graphSelectionModel.setCell(edge);
    } else {
      // Initial status
      this.originStatus.setAttribute('initialTransition', edge.getId());
      this.originStatus.setConnectable(false);
    }
  }

  private updateTransition(transition: WorkflowTransition): void {
    this.graphModel.remove(this.graphModel.getCell(transition.id));
    this.drawTransition(transition);
  }

  // Decodes the given XML node.
  private decodeXMLToGraph(xml: string): void {
    this.editor.graph.removeCells(this.editor.graph.getChildVertices(this.graphParent), true);
    const xmlDocument = mx.mxUtils.parseXml(xml);
    const decoder = new mx.mxCodec(xmlDocument);
    const node = xmlDocument.documentElement;
    decoder.decode(node, this.graphModel);
    this.editor.graph.center();
  }

  private handleConnectEvent(event: mxEventObject): void {
    const edge: mxCell = event.getProperty('cell');
    const source = this.graphModel.getTerminal(edge, true);
    const target = this.graphModel.getTerminal(edge, false);
    this.event.emit({
      event: WorkflowEvent.onAddTransition,
      value: { transitionId: edge.getId(), sourceId: source.getId(), targetId: target.getId() },
    });
    this.graphModel.remove(edge);
  }

  private handleConnectCellEvent(event: mxEventObject): void {
    if ((event.getProperty('previous') as mxCell).mxObjectId === (event.getProperty('terminal') as mxCell).mxObjectId) {
      return;
    }
    const edge: mxCell = event.getProperty('edge');
    const previous: mxCell = event.getProperty('previous');
    this.event.emit({
      event: WorkflowEvent.onChangeTransition,
      value: {
        transitionId: edge.getId(),
        sourceId: edge.source.getId(),
        targetId: edge.target.getId(),
        previousId: previous.getId(),
      },
    });
  }

  private handleSelectCell(sender: any): void {
    if (sender.cells.length === 1) {
      const selectedCell: mxCell = sender.cells[0];
      if (selectedCell) {
        if (selectedCell.isEdge()) {
          this.event.emit({
            event: WorkflowEvent.onSelectTransition,
            value: selectedCell.getId(),
          });
        } else {
          const transitionAllId = selectedCell.getAttribute('transitionAll', null);
          if (transitionAllId) {
            const transitionAll = this.graphModel.getCell(transitionAllId);
            this.graphSelectionModel.setCell(transitionAll);
          } else {
            this.event.emit({
              event: WorkflowEvent.onSelectStatus,
              value: selectedCell.getId(),
            });
          }
        }
      }
    } else {
      this.event.emit({ event: WorkflowEvent.onUnSelectCell });
    }
  }

  private drawAllStatusesTransition(transition: WorkflowTransition) {
    const target = this.graphModel.getCell(transition.targetId);
    const statusAll = this.drawStatus(undefined, target);
    this.drawTransition(transition, statusAll);
  }

  private bindApi(api: WorkflowAPIType): string | void {
    switch (api.type) {
      case WorkflowAPI.drawStatus:
        this.drawStatus(api.value);
        break;
      case WorkflowAPI.updateStatus:
        this.updateStatus(api.value);
        break;
      case WorkflowAPI.drawTransition:
        this.drawTransition(api.value);
        break;
      case WorkflowAPI.drawAllStatusesTransition:
        this.drawAllStatusesTransition(api.value);
        break;
      case WorkflowAPI.updateTransition:
        this.updateTransition(api.value);
        break;
      case WorkflowAPI.getXML:
        return this.getGraphXML();
      case WorkflowAPI.setInitial:
        this.initial = true;
        break;
      case WorkflowAPI.removeStatus:
        this.onRemoveCell(this.graphModel.getCell(api.value));
        break;
      case WorkflowAPI.removeTransition:
        this.onRemoveTransition(this.graphModel.getCell(api.value));
        break;
      case WorkflowAPI.decodeXML:
        this.decodeXMLToGraph(api.value);
        break;
      case WorkflowAPI.selectCell:
        this.onSelectCell(api.value);
        break;
      case WorkflowAPI.zoomIn:
        this.editor.graph.zoomIn();
        break;
      case WorkflowAPI.zoomOut:
        this.editor.graph.zoomOut();
        break;
      default:
        break;
    }
  }

  private handleEditCell(): void {
    this.event.emit({ event: WorkflowEvent.onEditCell });
  }

  private onRemoveCell(cell: mxCell): void {
    if (cell.hasAttribute('initial')) {
      this.event.emit({ event: WorkflowEvent.cannotRemove });
    } else {
      if (cell.hasAttribute('group')) {
        this.graphModel.remove(this.graphModel.getCell(cell.getAttribute('group', '')));
      }
      this.graphModel.remove(cell);
    }
  }

  private onRemoveTransition(edge: mxCell): void {
    const statusAll = this.graphModel.getTerminal(edge, true);
    if (statusAll.hasAttribute('transitionAll')) {
      this.graphModel.remove(statusAll);
      this.graphSelectionModel.setCell(this.graphModel.getCell(statusAll.getAttribute('group', '')));
      this.editor.graph.ungroupCells(null as unknown as mxCell[]);
    }
    this.onRemoveCell(edge);
  }

  private onSelectCell(cellId: string): void {
    this.graphSelectionModel.setCell(this.graphModel.getCell(cellId));
  }
}
