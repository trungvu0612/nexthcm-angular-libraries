import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { tuiPure } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, of } from 'rxjs';
import { map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { convertRejected, RejectedFile } from '../../../models';

@Component({
  selector: 'formly-upload-file',
  templateUrl: './upload-file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      accept: '',
      labelText: 'or drop it here',
      linkText: 'Choose a file',
      maxFileSize: 30000000,
      multiple: false,
      showSize: true,
      size: 'm',
      textfieldLabelOutside: true,
      serverRequest: (file: File) => of(file),
    },
  };
  readonly control = new FormControl();
  context!: { $implicit: any };

  @tuiPure
  get loading$(): Observable<ReadonlyArray<File>> {
    return this.requests$.pipe(
      tap((file) => {
        if (typeof file === 'string' || file instanceof File || file === null) {
          this.formControl.setValue(file);
        }
      }),
      map((file) => (file instanceof File ? [file] : [])),
      startWith([])
    );
  }

  @tuiPure
  get rejected$(): Observable<ReadonlyArray<TuiFileLike>> {
    return this.requests$.pipe(
      map((file) => (file instanceof RejectedFile ? [convertRejected(file)] : [])),
      tap(({ length }) => {
        if (length) {
          this.control.setValue(null);
          this.formControl.setValue(null);
        }
      }),
      startWith([])
    );
  }

  @tuiPure
  private get requests$(): Observable<string | RejectedFile | File | null> {
    return this.control.valueChanges.pipe(
      switchMap((file) =>
        file
          ? (this.to.serverRequest(file).pipe(startWith(file)) as Observable<string | RejectedFile | File | null>)
          : of(null)
      ),
      share()
    );
  }
}
