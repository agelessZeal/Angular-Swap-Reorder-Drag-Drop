import {NgModule} from '@angular/core';
import {
  SwapDragComponent,
  DragAndDropListContentOutletDirective,
  DragAndDropListDataDirective
} from './swap-drag.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    SwapDragComponent,
    DragAndDropListContentOutletDirective,
    DragAndDropListDataDirective
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [
    SwapDragComponent,
    DragAndDropListContentOutletDirective,
    DragAndDropListDataDirective
  ]
})
export class SwapDragComponentModule {
}
