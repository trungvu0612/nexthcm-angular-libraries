import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmailVariable } from '@nexthcm/cdk';
import { FieldType } from '@ngx-formly/core';
import { TuiValidationError } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';
import { EditorChangeContent } from 'ngx-quill/lib/quill-editor.component';
import Quill from 'quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

import { TemplateVariablesQuery } from '../../state';

@Component({
  selector: 'hcm-formly-quill-template-variable',
  templateUrl: './formly-quill-template-variable.component.html',
  styleUrls: ['./formly-quill-template-variable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyQuillTemplateVariableComponent extends FieldType implements OnInit {
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<Record<string, never>>;
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;

  error: TuiValidationError | null = null;
  readonly templateVariables$ = this.templateVariablesQuery.selectAll();
  readonly templateVariableCtrl = new FormControl();
  readonly context!: { $implicit: unknown };

  constructor(private readonly templateVariablesQuery: TemplateVariablesQuery) {
    super();
  }

  ngOnInit(): void {
    this.error = new TuiValidationError(this.errorContent || '');
  }

  onAddTemplateVariable({ name, marker }: EmailVariable): void {
    const range = this.editor.quillEditor.getSelection(true);
    this.editor.quillEditor.insertEmbed(range.index, 'TemplateVariable', { name, marker });
    this.editor.quillEditor.insertText(range.index + 1, '', Quill.sources.USER);
    this.editor.quillEditor.setSelection(range.index + 1, 0, Quill.sources.SILENT);
  }

  onEditorChanged($event: EditorChangeContent | EditorChangeSelection): void {
    if ($event.event === 'text-change') {
      const delta = $event.editor.getContents();
      const converter = new QuillDeltaToHtmlConverter(delta.ops);
      converter.renderCustomWith((customOp) => {
        if (customOp.insert.type === 'TemplateVariable') {
          return customOp.insert.value.marker;
        }
        return '';
      });
      if (this.to.onTextChange) {
        this.to.onTextChange(converter.convert());
      }
    }
  }
}
