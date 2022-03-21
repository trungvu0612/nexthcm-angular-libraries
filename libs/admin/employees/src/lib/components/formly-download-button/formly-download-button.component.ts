import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FilesService } from '@nexthcm/cdk';
import { FieldType } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { FileSaverService } from 'ngx-filesaver';
import { Observable, of, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';

interface ComponentState {
  loading: boolean;
}

@Component({
  selector: 'hcm-formly-download-button',
  templateUrl: './formly-download-button.component.html',
  styleUrls: ['./formly-download-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class FormlyDownloadButtonComponent extends FieldType {
  // READS
  readonly loading$ = this.state.select('loading');

  // EVENTS
  readonly download$ = new Subject<void>();

  // HANDLERS
  readonly downloadHandler$ = this.download$.pipe(switchMap(() => this.onSave().pipe(startWith(null))));

  constructor(
    private readonly filesService: FilesService,
    private readonly fileSaverService: FileSaverService,
    private readonly state: RxState<ComponentState>
  ) {
    super();
    this.state.connect('loading', this.downloadHandler$.pipe(map((value) => !value)));
  }

  onSave(): Observable<Blob | null> {
    const arr = this.formControl?.value.split('/');

    return this.formControl
      ? this.filesService
          .getFile(this.formControl.value)
          .pipe(tap((blob) => this.fileSaverService.save(blob, arr[arr.length - 1])))
      : of(null);
  }
}
