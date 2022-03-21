import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmailVariable, SelectOptionsModule, TemplateVariable } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { FieldType, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiValidationError } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiErrorModule, TuiHintModule } from '@taiga-ui/core';
import { PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent, QuillModule, QuillModules } from 'ngx-quill';
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
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<Record<string, never>>;
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
  readonly templateVariableCtrl = new FormControl();
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

  onEditorCreated(): void {
    (this.editor.quillEditor.getModule('toolbar') as QuillModules)?.['addHandler']('image', (clicked: boolean) => {
      if (clicked) {
        let fileInput: HTMLInputElement | null = this.document.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
          fileInput = this.document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
          fileInput.classList.add('ql-image');
          fileInput.addEventListener('change', (e) => {
            const files = (e.target as HTMLInputElement)?.files;
            if (files && files.length > 0) {
              const file = files[0];
              const type = file.type;
              const reader = new FileReader();

              reader.onload = (e) => {
                const dataUrl = e.target?.result;

                if (dataUrl) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  this.imageHandler(type, new QuillImageData(dataUrl, type, file.name));
                }
              };
              reader.readAsDataURL(file);
            }
          });
        }
        fileInput.click();
      }
    });
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