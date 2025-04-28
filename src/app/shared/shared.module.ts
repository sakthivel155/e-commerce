import { NgModule } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';

@NgModule({
  imports: [NgxMasonryModule],
  exports: [NgxMasonryModule],
})
export class SharedModule {}