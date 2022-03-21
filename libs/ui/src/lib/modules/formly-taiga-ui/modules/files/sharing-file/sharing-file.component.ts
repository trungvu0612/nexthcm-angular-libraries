import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { tuiPure } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'hcm-formly-sharing-file',
  templateUrl: './sharing-file.component.html',
  styleUrls: ['./sharing-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharingFileComponent extends FieldType {
  override defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      accept: '',
      serverRequest: () => of(null),
      saveFile: (file: File) => of(file),
    },
  };
  loadingFile: TuiFileLike | null = null;
  rejectedFile: TuiFileLike | null = null;

  @tuiPure
  get request$(): Observable<unknown> {
    return this.formControl?.valueChanges.pipe(
      filter((file) => file instanceof File),
      tap((file) => {
        this.rejectedFile = null;
        this.loadingFile = file;
      }),
      switchMap((file) =>
        (this.to['serverRequest'](file) as Observable<string>).pipe(
          catchError(() => {
            this.rejectedFile = file;
            this.formControl.setValue(null);
            return of(null);
          })
        )
      ),
      tap((path) => {
        this.loadingFile = null;
        this.to['onUploadedFile'] && this.to['onUploadedFile'](path);
      })
    );
  }

  onReject(rejectedFile: TuiFileLike): void {
    this.rejectedFile = rejectedFile;
  }

  removeFile(): void {
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
