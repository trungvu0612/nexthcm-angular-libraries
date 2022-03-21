import { ChangeDetectionStrategy, Component, Injector, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { TUI_EDITOR_EXTENSIONS, TuiComponentRenderer, TuiEditorNewModule } from '@taiga-ui/addon-editor';
import tippy, { Instance } from 'tippy.js';

import { FormFieldModule } from '../../modules/formly-taiga-ui';
import { MentionListComponent } from '../mention-list/mention-list.component';

@Component({
  selector: 'hcm-formly-mention-editor',
  templateUrl: './formly-mention-editor.component.html',
  styleUrls: ['./formly-mention-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_EDITOR_EXTENSIONS,
      deps: [Injector],
      useFactory: (injector: Injector) => [
        import('@tiptap/starter-kit').then((m) => m.default),
        import('@tiptap/extension-mention').then((m) =>
          m.default.configure({
            HTMLAttributes: { class: 'hcm-mention' },
            suggestion: {
              render: () => {
                let renderer: TuiComponentRenderer<MentionListComponent, MentionListComponent>;
                let popup: Instance[];

                return {
                  onStart: ({ query, command, clientRect }) => {
                    renderer = new TuiComponentRenderer(MentionListComponent, injector, { query, command });
                    popup = tippy('body', {
                      getReferenceClientRect: clientRect,
                      appendTo: () => document.body,
                      content: renderer.dom,
                      showOnCreate: true,
                      interactive: true,
                      trigger: 'manual',
                    });
                  },
                  onUpdate({ query, command, clientRect }) {
                    renderer.updateProps({ query, command });
                    popup[0].setProps({ getReferenceClientRect: clientRect });
                  },
                  onKeyDown(props) {
                    return renderer.instance.onKeyDown(props.event);
                  },
                  onExit() {
                    popup[0].destroy();
                    renderer.destroy();
                  },
                };
              },
            },
          })
        ),
      ],
    },
  ],
})
export class FormlyMentionEditorComponent extends FieldType {}

@NgModule({
  declarations: [FormlyMentionEditorComponent],
  imports: [
    ReactiveFormsModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'mention-editor', component: FormlyMentionEditorComponent, wrappers: ['form-field'] }],
    }),
    TuiEditorNewModule,
  ],
  exports: [FormlyMentionEditorComponent],
})
export class FormlyMentionEditorComponentModule {}
