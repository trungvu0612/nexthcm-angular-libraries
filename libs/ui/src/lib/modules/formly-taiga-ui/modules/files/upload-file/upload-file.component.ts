import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'hcm-formly-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      accept: '',
      serverRequest: (file: File) => of(file),
    },
  };
  loadingFile: TuiFileLike | null = null;
  rejectedFile: TuiFileLike | null = null;
  readonly control = new FormControl();
  readonly request$ = this.control.valueChanges.pipe(
    filter(isPresent),
    tap((file) => {
      this.rejectedFile = null;
      this.loadingFile = file;
    }),
    switchMap((file) =>
      (this.to['serverRequest'](file) as Observable<string>).pipe(
        catchError(() => {
          this.rejectedFile = file;
          this.control.setValue(null);
          return of(null);
        })
      )
    ),
    tap((file) => {
      this.loadingFile = null;
      this.formControl?.setValue(file);
    })
  );

  onReject(rejectedFile: TuiFileLike): void {
    this.rejectedFile = rejectedFile;
  }

  removeFile(): void {
    this.control.setValue(null);
    this.formControl?.setValue(null);
  }

  removeLoading(): void {
    this.loadingFile = null;
    this.removeFile();
  }

  removeRejected(): void {
    this.rejectedFile = null;
  }
}
