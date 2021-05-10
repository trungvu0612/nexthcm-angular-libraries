import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FormlyModule } from '@ngx-formly/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

const routes: Routes = [];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ReactiveFormsModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
