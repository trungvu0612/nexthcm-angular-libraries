import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { mxCell, mxEditor, mxEventObject } from 'mxgraph';
import { State, Transition } from './models';
import { createEditor } from './utils/create-editor';
import mx from './utils/mxgraph';

@Component({
  selector: 'hcm-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowEditorComponent implements OnInit {
  @ViewChild('splash', { static: true }) splash!: ElementRef<HTMLDivElement>;
  @Input() editMode = true;
  @Input() xmlContent = '';

  initial = true;
  editor!: mxEditor;

  constructor() {
    //
  }

  ngOnInit(): void {
    this.configGraph();
    this.editor = createEditor('config/workflow-editor.xml', this.splash.nativeElement);
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
      this.editor.graph.addListener(mx.mxEvent.CHANGE, (sender) => this.handleChangeEvent(sender));
      this.editor.graph.addListener(mx.mxEvent.DOUBLE_CLICK, () => {
        // this.onEditCell();
      });
    }
  }

  getXMLGraph(): string {
    const encoder = new mx.mxCodec();
    const node = encoder.encode(this.editor.graph.getModel());
    return mx.mxUtils.getXml(node);
  }

  private drawState(state?: State): mxCell {
    const parent = this.editor.graph.getDefaultParent();
    const model = this.editor.graph.getModel();
    let cell = model.cloneCell(this.editor.templates.symbol);
    cell.setAttribute('label', '');
    cell.setGeometry(new mx.mxGeometry(-100, 0, 32, 32));
    console.log(cell);
    if (state) {
      cell = model.cloneCell(this.editor.templates.task);
      cell.setId(state.id);
      cell.setAttribute('label', state.name);
      cell.setStyle(mx.mxUtils.setStyle(cell.style, mx.mxConstants.STYLE_FILLCOLOR, state.color));
      cell.setStyle(mx.mxUtils.setStyle(cell.style, mx.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, state.color));
      cell.setStyle(mx.mxUtils.setStyle(cell.style, mx.mxConstants.STYLE_FONTCOLOR, 'white'));
      // if (!this.initial) {
      //   this.workflowService.addedStates.push(state);
      //   this.workflowService.workflowActions.push({ action: 'addState', state });
      // }
    }
    model.beginUpdate();
    try {
      this.editor.graph.addCell(cell, parent);
    } finally {
      model.endUpdate();
    }
    if (!this.initial) {
      this.editor.graph.getSelectionModel().setCell(cell);
    } else {
      this.initial = false;
    }
    return cell;
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
    const initialState = this.drawState();
    this.initial = true;
    // this.workflowService.addState$.pipe(untilDestroyed(this)).subscribe((state) => {
    //   this.drawState(state);
    // });
    const model = this.editor.graph.getModel();
    const parent = this.editor.graph.getDefaultParent();
    const target = model.getCell('');
    const edge = model.cloneCell(this.editor.templates.edge);
    edge.setAttribute('label', 'Begin');
    model.beginUpdate();
    try {
      // this.editor.graph.addEdge(edge, parent, initialState, target);
    } finally {
      model.endUpdate();
    }
    initialState.setConnectable(false);
  }

  private drawTransition(transition: Transition, options = { emitAction: true }): void {
    const model = this.editor.graph.getModel();
    const parent = this.editor.graph.getDefaultParent();
    const source = model.getCell(transition.source);
    const target = model.getCell(transition.target);
    const edge = model.cloneCell(this.editor.templates.edge);
    edge.setId(transition.transitionId);
    edge.setAttribute('label', transition.nameAction);
    model.beginUpdate();
    try {
      this.editor.graph.addEdge(edge, parent, source, target);
    } finally {
      model.endUpdate();
    }
    // if (options.emitAction) {
    //   this.workflowService.workflowActions.push(transition);
    // }
    // this.workflowService.addedTransitions.push(transition);
    this.editor.graph.getSelectionModel().setCell(edge);
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
    const model = this.editor.graph.getModel();
    const label = edge.getAttribute('label', '');
    // this.upsertTransition(model, 'updateTransition', edge, edge.source, edge.target, label);
  }

  private handleChangeEvent(sender: any): void {
    console.log(sender);
    const selectedCell = sender.cells[0] as mxCell;
    if (!selectedCell) {
      // unselect cell
      // this.selectedCell = {};
    } else if (selectedCell.isEdge()) {
      // if the cell is a transition
      // const selectedTransition = this.workflowService.addedTransitions.find(
      //   (transition) => transition.transitionId === selectedCell.getId()
      // );
      // if (selectedTransition) {
      //   this.selectedCell = { title: selectedTransition.nameAction, value: selectedTransition, cell: selectedCell };
      // }
    } else {
      // if the cell is a task
      // const selectedState = this.workflowService.addedStates.find((state) => state.id === selectedCell.getId());
      // if (selectedState) {
      //   this.selectedCell = { title: selectedState.name, value: selectedState, cell: selectedCell };
      // }
    }
  }
}
