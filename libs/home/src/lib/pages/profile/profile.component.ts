import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmployeesService, FilesService, PromptService, UserProfileService } from '@nexthcm/cdk';
import { of, Subject, switchMap, tap } from 'rxjs';
import { catchError, map, share, startWith } from 'rxjs/operators';

@Component({
  selector: 'hcm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  activeItemIndex = 0;
  readonly profile$ = this.userProfileService.general$.pipe(share());
  readonly isBirthday$ = this.userProfileService.isBirthday$;

  readonly fileInput = document.createElement('input');
  private readonly file$ = new Subject<File>();
  readonly uploading$ = this.file$.pipe(
    switchMap((file) => this.filesService.cropImage(file)),
    switchMap((file) =>
      this.filesService.uploadFile('employee', file).pipe(
        switchMap((filePath) =>
          this.employeesService.updateEmployeeGeneralInformation({
            ...this.userProfileService.get('general'),
            image: filePath,
          })
        ),
        tap(this.promptService.handleResponse(undefined, () => this.userProfileService.refreshGeneralInformation())),
        switchMap(() => this.profile$),
        catchError(() => of(true)),
        startWith(false)
      )
    ),
    map((v) => !v)
  );

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly employeesService: EmployeesService,
    private readonly promptService: PromptService,
    private readonly filesService: FilesService
  ) {
    userProfileService.doLoadGeneralInformation();
    userProfileService.doLoadIndividualInformation();

    this.fileInput.setAttribute('type', 'file');
    this.fileInput.setAttribute('accept', 'image/*');
    this.fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) this.file$.next(file);
      this.fileInput.value = '';
    });
  }
}
