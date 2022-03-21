import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import {
  defaultEditorExtensions,
  defaultEditorTools,
  tiptapEditorStyles,
  TUI_EDITOR_EXTENSIONS,
  TUI_EDITOR_STYLES,
} from '@taiga-ui/addon-editor';

@Component({
  selector: 'hcm-formly-editor',
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: TUI_EDITOR_EXTENSIONS, useValue: defaultEditorExtensions },
    { provide: TUI_EDITOR_STYLES, useValue: tiptapEditorStyles },
  ],
})
export class EditorComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      textfieldSize: 'l',
      tools: defaultEditorTools,
    },
  };
}
