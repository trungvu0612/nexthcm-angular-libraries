import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RejectedFile } from '@nexthcm/ui';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService, tuiPure } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  mapTo,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { convertRejected } from '../../../utils/files';

@Component({
  selector: 'formly-sharing-file',
  templateUrl: './sharing-file.component.html',
  styleUrls: ['./sharing-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SharingFileComponent extends FieldType {
  defaultOptions: FormlyFieldConfig = {
    templateOptions: {
      accept: '',
      labelText: 'or drop it here',
      linkText: 'Choose a file',
      maxFileSize: 30000000,
      showSize: true,
      size: 'm',
      serverRequest: () => of(null),
      saveFile: (file: File) => of(file),
    },
  };

  constructor(private readonly destroy$: TuiDestroyService) {
    super();
  }

  @tuiPure
  get loading$(): Observable<ReadonlyArray<File>> {
    return this.requests$.pipe(
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
          this.formControl.setValue(null);
        }
      }),
      startWith([])
    );
  }

  @tuiPure
  private get requests$(): Observable<RejectedFile | File | null> {
    return this.formControl.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap((file: File | null) => {
        if (file && file instanceof File) {
          return (this.to.serverRequest(file) as Observable<string>).pipe(
            tap((path) => {
              if (this.to.onUploadedFile) {
                this.to.onUploadedFile(path);
              }
            }),
            mapTo(null),
            startWith(file),
            catchError(() => of(new RejectedFile(file, 'Something went wrong this time')))
          );
        } else {
          if (this.to.onUploadedFile) {
            this.to.onUploadedFile(null);
          }
          return of(null);
        }
      }),
      share(),
      takeUntil(this.destroy$)
    );
  }
}
