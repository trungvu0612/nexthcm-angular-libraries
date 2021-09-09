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
import { createEditor } from './utils/create-editor';
import mx from './utils/mxgraph';
import { setCellStyle } from './utils/set-cell-style';

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

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.editor.graph.center();
  }

  ngOnInit(): void {
    this.configGraph();
    this.editor = createEditor('config/workflow-designer.xml', this.splash.nativeElement);
    this.originStatus = this.drawStatus();
    this.editor.graph.center();
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
    mx.mxConnectionHandler.prototype.connectImage = new mx.mxImage('/images/connector.gif', 16, 16);
    mx.mxGraphSelectionModel.prototype.setSingleSelection(true);
    mx.mxTooltipHandler.prototype.setHideOnHover(true);
  }

  private drawStatus(status?: WorkflowStatus): mxCell {
    let cell: mxCell;
    if (status) {
      cell = this.graphModel.cloneCell(this.editor.templates.task);
      cell.setId(status.id);
      cell.setAttribute('label', status.label);
      cell.setStyle(setCellStyle(cell, status));
      cell.setGeometry(new mx.mxGeometry(-30, 100, 100, 40));
    } else {
      // origin status
      cell = this.graphModel.cloneCell(this.editor.templates.symbol);
      cell.setAttribute('label', '');
      cell.setGeometry(new mx.mxGeometry(0, 0, 40, 40));
    }
    this.graphModel.beginUpdate();
    try {
      this.editor.graph.addCell(cell, this.editor.graph.getDefaultParent());
    } finally {
      this.graphModel.endUpdate();
    }
    if (this.initial) {
      this.initial = false;
    } else {
      this.graphSelectionModel.setCell(cell);
    }
    return cell;
  }

  private updateStatus(status: WorkflowStatus): void {
    const cell = this.graphModel.getCell(status.id);
    const value = cell.getValue();
    value.setAttribute('label', status.label);
    this.graphModel.setValue(cell, value);
    this.graphModel.setStyle(cell, setCellStyle(cell, status));
    this.graphSelectionModel.setCell(cell);
  }

  private drawTransition(transition: WorkflowTransition): void {
    const source = transition.sourceId ? this.graphModel.getCell(transition.sourceId) : this.originStatus;
    const target = this.graphModel.getCell(transition.targetId);
    const edge = this.graphModel.cloneCell(this.editor.templates.edge);
    edge.setId(transition.id);
    edge.setAttribute('label', transition.label);
    this.graphModel.beginUpdate();
    try {
      this.editor.graph.addEdge(edge, this.graphParent, source, target);
    } finally {
      this.graphModel.endUpdate();
    }
    if (transition.sourceId) {
      this.graphSelectionModel.setCell(edge);
    } else {
      // Initial status
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
    const selectedCell: mxCell = sender.cells[0];
    if (selectedCell) {
      this.event.emit({
        event: selectedCell.isEdge() ? WorkflowEvent.onSelectTransition : WorkflowEvent.onSelectStatus,
        value: selectedCell.getId(),
      });
    } else {
      this.event.emit({ event: WorkflowEvent.onUnSelectCell });
    }
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
      case WorkflowAPI.updateTransition:
        this.updateTransition(api.value);
        break;
      case WorkflowAPI.getXML:
        return this.getGraphXML();
      case WorkflowAPI.setInitial:
        this.initial = true;
        break;
      case WorkflowAPI.removeCell:
        this.graphModel.remove(this.graphModel.getCell(api.value));
        break;
      case WorkflowAPI.decodeXML:
        this.decodeXMLToGraph(api.value);
        break;
      default:
        break;
    }
  }

  private handleEditCell(): void {
    this.event.emit({ event: WorkflowEvent.onEditCell });
  }
}
