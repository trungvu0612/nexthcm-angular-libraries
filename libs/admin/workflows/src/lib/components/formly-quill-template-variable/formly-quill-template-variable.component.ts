import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { TuiValidationError } from '@taiga-ui/cdk';
import { PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { EditorChangeSelection, QuillEditorComponent } from 'ngx-quill';
import { EditorChangeContent } from 'ngx-quill/lib/quill-editor.component';
import Quill from 'quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { TemplateVariableModel } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-formly-quill-template-variable',
  templateUrl: './formly-quill-template-variable.component.html',
  styleUrls: ['./formly-quill-template-variable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyQuillTemplateVariableComponent extends FieldType implements OnInit {
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<{}>;
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;

  error: TuiValidationError | null = null;
  readonly templateVariables$ = this.adminWorkflowsService.select('templateVariables');
  readonly templateVariableCtrl = new FormControl<TemplateVariableModel>();
  readonly context!: { $implicit: unknown };

  constructor(private readonly adminWorkflowsService: AdminWorkflowsService) {
    super();
  }

  ngOnInit(): void {
    this.error = new TuiValidationError(this.errorContent || '');
  }

  onAddTemplateVariable(variable: TemplateVariableModel): void {
    const range = this.editor.quillEditor.getSelection(true);
    this.editor.quillEditor.insertEmbed(range.index, 'TemplateVariable', variable);
    this.editor.quillEditor.insertText(range.index + 1, ' ', Quill.sources.USER);
    this.editor.quillEditor.setSelection(range.index + 2, 0, Quill.sources.SILENT);
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
      this.form.controls.template.setValue(converter.convert());
    }
  }
}
