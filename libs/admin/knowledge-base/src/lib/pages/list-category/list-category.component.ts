import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'hcm-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  imports: [],
  declarations: [ListCategoryComponent],
  exports: [ListCategoryComponent]
})
export class ListCategoryComponentModule {
}
