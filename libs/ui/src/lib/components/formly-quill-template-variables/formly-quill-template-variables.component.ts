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
import { EditorChangeSelection, QuillEditorComponent, QuillModule } from 'ngx-quill';
import { EditorChangeContent } from 'ngx-quill/lib/quill-editor.component';
import { QuillModules } from 'ngx-quill/lib/quill-editor.interfaces';
import Quill from 'quill';
import QuillAutoDetectUrl from 'quill-auto-detect-url';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import QuillImageDropAndPaste, { ImageData as QuillImageData } from 'quill-image-drop-and-paste';

TemplateVariable.blotName = 'TemplateVariable';
TemplateVariable.tagName = 'span';
Quill.register({ 'formats/TemplateVariable': TemplateVariable });
Quill.register('modules/autoDetectUrl', QuillAutoDetectUrl);
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

@Component({
  selector: 'hcm-formly-quill-template-variables',
  templateUrl: './formly-quill-template-variables.component.html',
  styleUrls: ['./formly-quill-template-variables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyQuillTemplateVariablesComponent extends FieldType implements OnInit {
  @ViewChild('errorContent', { static: true }) errorContent?: PolymorpheusTemplate<Record<string, never>>;
  @ViewChild('editor', { static: true }) editor!: QuillEditorComponent;
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      quillModules: {
        /**
         * @see https://github.com/juyeong1260/quill-auto-detect-url
         */
        autoDetectUrl: true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        imageDropAndPaste: {
          handler: this.imageHandler.bind(this),
        },
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

  imageHandler(type: string, imageData: QuillImageData): void {
    imageData.minify({ quality: 0.7 }).then((miniImageData) => {
      if (miniImageData instanceof QuillImageData) {
        let index = (this.editor.quillEditor.getSelection() || {}).index;

        if (index === undefined || index < 0) {
          index = this.editor.quillEditor.getLength();
        }
        this.editor.quillEditor.insertEmbed(index, 'image', miniImageData.dataUrl, Quill.sources.USER);
        this.editor.quillEditor.setSelection(index + 1, 0, Quill.sources.SILENT);
      }
    });
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

  onEditorCreated(): void {
    (this.editor.quillEditor.getModule('toolbar') as QuillModules)?.addHandler('image', (clicked: boolean) => {
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
