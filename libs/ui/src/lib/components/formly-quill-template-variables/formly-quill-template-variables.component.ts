import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailVariable, SelectOptionsModule, TemplateVariable } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiErrorModule, TuiHintModule } from '@taiga-ui/core';
import { PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent, QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

TemplateVariable['blotName'] = 'TemplateVariable';
TemplateVariable['tagName'] = 'span';
Quill.register({ 'formats/TemplateVariable': TemplateVariable });

@Component({
  selector: 'hcm-formly-quill-template-variables',
  templateUrl: './formly-quill-template-variables.component.html',
  styleUrls: ['./formly-quill-template-variables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyQuillTemplateVariablesComponent extends FieldType implements OnInit {
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<Record<string, unknown>>;
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;

  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      quillModules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    },
  };
  focused = false;
  error: TuiValidationError | null = null;
  readonly context!: { $implicit: unknown };

  constructor(@Inject(DOCUMENT) private document: Document) {
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
      if (this.to['onTextChange']) {
        this.to['onTextChange'](converter.convert());
      }
    }
  }

  focus(): void {
    this.focused = true;
  }

  blur(): void {
    this.focused = false;
  }
}

@NgModule({
  declarations: [FormlyQuillTemplateVariablesComponent],
  imports: [
    PushModule,
    CommonModule,
    TranslocoModule,
    TuiHintModule,
    TuiButtonModule,
    QuillModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [{ name: 'quill-template-variables', component: FormlyQuillTemplateVariablesComponent }],
    }),
    TuiErrorModule,
    PolymorpheusModule,
    SelectOptionsModule,
  ],
  exports: [FormlyQuillTemplateVariablesComponent],
})
export class FormlyQuillTemplateVariablesComponentModule {}
