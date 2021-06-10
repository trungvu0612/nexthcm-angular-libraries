import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { mxCell, mxEditor, mxEventObject, mxGraphModel, mxGraphSelectionModel } from 'mxgraph';
import { v4 as uuidv4 } from 'uuid';
import { Status, Transition, WorkflowAPI, WorkflowAPIType, WorkflowEvent } from './models';
import { createEditor } from './utils/create-editor';
import mx from './utils/mxgraph';

@Component({
  selector: 'hcm-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowEditorComponent implements OnInit {
  @ViewChild('splash', { static: true }) splash!: ElementRef<HTMLDivElement>;
  @Input() editMode = true;
  @Input() xmlContent = '';
  @Output() readonly event = new EventEmitter<{ event: WorkflowEvent; value: mxCell }>();

  initial = true;
  editor!: mxEditor;
  graphParent!: mxCell;
  graphModel!: mxGraphModel;
  graphSelectionModel!: mxGraphSelectionModel;

  constructor() {
    //
  }

  ngOnInit(): void {
    this.configGraph();
    this.editor = createEditor('config/workflow-editor.xml', this.splash.nativeElement);
    this.graphParent = this.editor.graph.getDefaultParent();
    this.graphModel = this.editor.graph.getModel();
    this.graphSelectionModel = this.editor.graph.getSelectionModel();
    if (this.xmlContent) {
      this.decodeXMLToGraph(this.xmlContent);
    } else {
      this.drawInitialState();
    }
    this.editor.graph.center();
    if (this.editMode) {
      this.editor.graph.setEnabled(true);
      this.editor.graph.setConnectable(true);
      this.editor.graph.connectionHandler.addListener(mx.mxEvent.CONNECT, (_, evt) => this.handleConnectEvent(evt));
      this.editor.graph.addListener(mx.mxEvent.CONNECT_CELL, (_, evt: mxEventObject) =>
        this.handleConnectCellEvent(evt)
      );
      this.graphSelectionModel.addListener(mx.mxEvent.CHANGE, (sender) => this.handleSelectCell(sender));
      this.editor.graph.addListener(mx.mxEvent.DOUBLE_CLICK, (evt) => {
        console.log(evt);
        // this.onEditCell();
      });
    }
  }

  getGraphXML(): string {
    return mx.mxUtils.getXml(new mx.mxCodec().encode(this.graphModel));
  }

  apiEvent(api: WorkflowAPIType): string | void {
    return this.bindApi(api);
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
    mx.mxGraph.prototype.allowLoops = true;
    mx.mxGraph.prototype.setEdgeLabelsMovable(false);
    mx.mxGraph.prototype.setCellsEditable(false);
    mx.mxConnectionHandler.prototype.connectImage = new mx.mxImage('/images/connector.gif', 16, 16);
    mx.mxGraphSelectionModel.prototype.setSingleSelection(true);
    mx.mxTooltipHandler.prototype.setHideOnHover(true);
  }

  private drawInitialState(): void {
    const originState = this.drawStatus();
    this.initial = true;
    const initialState = this.drawStatus(new Status(uuidv4(), 'OPEN', '#42526e', '#42526e'));
    initialState.setGeometry(new mx.mxGeometry(0, 70, 32, 32));
    const edge = this.graphModel.cloneCell(this.editor.templates.edge);
    edge.setAttribute('label', 'Begin');
    this.graphModel.beginUpdate();
    try {
      this.editor.graph.addEdge(edge, this.graphParent, originState, initialState);
    } finally {
      this.graphModel.endUpdate();
    }
    originState.setConnectable(false);
  }

  private drawStatus(status?: Status): mxCell {
    let cell: mxCell;
    if (status) {
      cell = this.graphModel.cloneCell(this.editor.templates.task);
      cell.setId(status.id);
      cell.setAttribute('label', status.label);
      if (status.fillColor) {
        cell.setStyle(mx.mxUtils.setStyle(cell.style, mx.mxConstants.STYLE_FILLCOLOR, status.fillColor));
      }
      if (status.labelBackgroundColor) {
        cell.setStyle(
          mx.mxUtils.setStyle(cell.style, mx.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, status.labelBackgroundColor)
        );
      }
      if (status.fontColor) {
        cell.setStyle(mx.mxUtils.setStyle(cell.style, mx.mxConstants.STYLE_FONTCOLOR, status.fontColor));
      }
    } else {
      cell = this.graphModel.cloneCell(this.editor.templates.symbol);
      cell.setAttribute('label', '');
    }
    cell.setGeometry(new mx.mxGeometry(0, 0, 32, 32));
    this.graphModel.beginUpdate();
    try {
      this.editor.graph.addCell(cell, this.graphParent);
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

  private drawTransition(transition: Transition): void {
    const model = this.editor.graph.getModel();
    const parent = this.editor.graph.getDefaultParent();
    const source = model.getCell(transition.source);
    const target = model.getCell(transition.target);
    const edge = model.cloneCell(this.editor.templates.edge);
    edge.setId(transition.id);
    edge.setAttribute('label', transition.label);
    model.beginUpdate();
    try {
      this.editor.graph.addEdge(edge, parent, source, target);
    } finally {
      model.endUpdate();
    }
    this.graphSelectionModel.setCell(edge);
  }

  // Decodes the given XML node.
  private decodeXMLToGraph(xml: string): void {
    this.editor.graph.removeCells(this.editor.graph.getChildVertices(this.editor.graph.getDefaultParent()), true);
    const xmlDocument = mx.mxUtils.parseXml(xml);
    const decoder = new mx.mxCodec(xmlDocument);
    const node = xmlDocument.documentElement;
    if (node?.nodeName === 'mxGraphModel') {
      decoder.decode(node, this.editor?.graph.getModel());
      this.editor.graph.center();
    }
  }

  private handleConnectEvent(event: mxEventObject): void {
    const edge: mxCell = event.getProperty('cell');
    const model = this.editor.graph.getModel();
    const source = model.getTerminal(edge, true);
    const target = model.getTerminal(edge, false);
    const label = edge.getAttribute('label', '');
    // this.upsertTransition(model, 'addNewTransition', edge, source, target, label);
  }

  private handleConnectCellEvent(event: mxEventObject): void {
    if ((event.getProperty('previous') as mxCell).mxObjectId === (event.getProperty('terminal') as mxCell).mxObjectId) {
      return;
    }
    const edge: mxCell = event.getProperty('edge');
    const label = edge.getAttribute('label', '');
    // this.upsertTransition(model, 'updateTransition', edge, edge.source, edge.target, label);
  }

  private handleSelectCell(sender: any): void {
    console.log(sender);
    const selectedCell: mxCell = sender.cells[0];
    if (selectedCell) {
      this.emitEvent(
        selectedCell.isEdge() ? WorkflowEvent.onSelectTransition : WorkflowEvent.onSelectStatus,
        selectedCell
      );
    }
  }

  private emitEvent(event: WorkflowEvent, value: mxCell): void {
    this.event.emit({ event, value });
  }

  private bindApi(api: WorkflowAPIType): string | void {
    switch (api.type) {
      case WorkflowAPI.drawStatus:
        this.drawStatus(api.value);
        break;
      case WorkflowAPI.drawTransition:
        this.drawTransition(api.value);
        break;
      case WorkflowAPI.getXML:
        return this.getGraphXML();
      default:
        break;
    }
  }
}
