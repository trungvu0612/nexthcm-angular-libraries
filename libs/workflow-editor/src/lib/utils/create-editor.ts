import { mxEditor, mxEffects } from 'mxgraph';
import mx from './mxgraph';

/** Constructs a new application (returns an mxEditor instance) */
export function createEditor(config: string, splash: HTMLElement): mxEditor {
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
      hideSplash(splash);
    }
  } catch (e) {
    hideSplash(splash);
    throw e; // for debugging
  }

  return editor;
}

/** Fades-out the splash screen */
function hideSplash(splash: HTMLElement): void {
  if (splash) {
    try {
      mx.mxEvent.release(splash);
      mxEffects.fadeOut(splash, 100, true);
    } catch (e) {
      splash.parentNode?.removeChild(splash);
    }
  }
}
