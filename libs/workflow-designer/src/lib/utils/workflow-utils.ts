import { mxCell, mxEditor, mxEffects } from 'mxgraph';
import { WorkflowStatus } from '../models';
import mx from './mxgraph';

export class WorkflowUtils {
  /** Constructs a new application (returns an mxEditor instance) */
  static createEditor(config: string, splash: HTMLElement): mxEditor {
    let editor = new mx.mxEditor();
    try {
      if (!mx.mxClient.isBrowserSupported()) {
        mx.mxUtils.error('Browser is not supported!', 200, false);
      } else {
        mx.mxObjectCodec.allowEval = true;
        const graphNode = mx.mxUtils.load(config).getDocumentElement();
        editor = new mx.mxEditor(graphNode);
        mx.mxObjectCodec.allowEval = false;

        // Adds active border for panning inside the container
        editor.graph.createPanningManager = () => {
          const pm = new mx.mxPanningManager(editor.graph);
          pm.border = 30;
          return pm;
        };

        editor.graph.allowAutoPanning = true;
        editor.graph.timerAutoScroll = true;

        // Updates the window title after opening new files
        const title = document.title;
        const func = (sender: mxEditor) => {
          document.title = title + ' - ' + sender.getTitle();
        };

        editor.addListener(mx.mxEvent.OPEN, func);

        // Prints the current root in the window title if the
        // current root of the graph changes (drilling).
        editor.addListener(mx.mxEvent.ROOT, func);
        func(editor);

        // Shows the application
        this.hideSplash(splash);
      }
    } catch (e) {
      this.hideSplash(splash);
      throw e; // for debugging
    }

    return editor;
  }

  static setCellStyle(cell: mxCell, status: WorkflowStatus): string {
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

  /** Fades-out the splash screen */
  static hideSplash(splash: HTMLElement): void {
    if (splash) {
      try {
        mx.mxEvent.release(splash);
        mxEffects.fadeOut(splash, 100, true);
      } catch (e) {
        splash.parentNode?.removeChild(splash);
      }
    }
  }
}
