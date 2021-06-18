import { mxCell } from 'mxgraph';
import { WorkflowStatus } from '../models';
import mx from './mxgraph';

export function setCellStyle(cell: mxCell, status: WorkflowStatus): string {
  let style = cell.getStyle();
  if (status.fillColor) {
    style = mx.mxUtils.setStyle(style, mx.mxConstants.STYLE_FILLCOLOR, status.fillColor);
  }
  if (status.labelBackgroundColor) {
    style = mx.mxUtils.setStyle(style, mx.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, status.labelBackgroundColor);
  }
  if (status.fontColor) {
    style = mx.mxUtils.setStyle(style, mx.mxConstants.STYLE_FONTCOLOR, status.fontColor);
  }
  return style;
}
