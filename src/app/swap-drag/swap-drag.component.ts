import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';

@Directive({
  selector: '[swapDragAndDropListData]'
})
export class DragAndDropListDataDirective {
  constructor(public template: TemplateRef<any>) {
  }
}

@Directive({selector: '[swapContentOutlet]'})
export class DragAndDropListContentOutletDirective {
  constructor(public viewContainer: ViewContainerRef) {
  }
}

@Component({
  selector: 'app-swap-drag',
  templateUrl: './swap-drag.component.html',
  styleUrls: ['./swap-drag.component.scss']
})
export class SwapDragComponent implements AfterViewInit, OnChanges {



  @Input() public items: Array<any>;
  @Input() public columnNumber = 1;

  @ViewChildren(DragAndDropListContentOutletDirective) contentOutlet: QueryList<DragAndDropListContentOutletDirective>;
  @ContentChildren(DragAndDropListDataDirective) dragAndDropListData: QueryList<DragAndDropListDataDirective>;

  @ViewChild(CdkDropListGroup, {static: true}) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, {static: true}) placeholder: CdkDropList;

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public activeContainer;
  public reorders = [];

  private static __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
  }

  private static __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
    const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
    return y >= top && y <= bottom && x >= left && x <= right;
  }

  constructor(private changeDetector: ChangeDetectorRef, private viewportRuler: ViewportRuler) {
    this.target = null;
    this.source = null;
  }

  ngAfterViewInit() {
    this.renderItems();

    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {

      if (!this.contentOutlet) {
        return;
      }
      // this.renderItems();
    }
  }

  public renderItems() {
    this.changeDetector.detectChanges();

    this.contentOutlet.toArray().forEach((outlet: DragAndDropListContentOutletDirective, index: number) => {
      outlet.viewContainer.clear();
      outlet.viewContainer.createEmbeddedView(
        this.dragAndDropListData.first.template, {
          $implicit: this.items[index],
          index
        });
    });
    this.changeDetector.detectChanges();
  }

  dragMoved(e: CdkDragMove) {
    const point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (SwapDragComponent.__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  public enter = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop === this.placeholder) {
      return true;
    }

    if (drop !== this.activeContainer) {
      return false;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = Array.from(dropElement.parentElement.children).indexOf(this.source ? phElement : sourceElement);
    const dropIndex = Array.from(dropElement.parentElement.children).indexOf(dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    return false;
  }

  drop() {
    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;
    phElement.style.display = 'none';
    this.target = null;
    this.source = null;
    if (this.sourceIndex !== this.targetIndex) {
      const sourceItem =  this.items[this.sourceIndex];
      const targetItem =  this.items[this.targetIndex];
      this.items.splice(this.sourceIndex, 1);
      if (sourceItem.width === 2 ) {
        this.items.splice(this.targetIndex, 0, sourceItem);
      } else {
        if (this.targetIndex > this.sourceIndex) {
          this.items.splice(this.targetIndex - 1, 1);
        } else {
          this.items.splice(this.targetIndex, 1);
        }

        if (this.targetIndex > this.sourceIndex) {
          this.items.splice(this.sourceIndex, 0, targetItem);
          this.items.splice(this.targetIndex, 0, sourceItem);
        } else {
          this.items.splice(this.targetIndex, 0, sourceItem);
          this.items.splice(this.sourceIndex, 0, targetItem);
        }
      }


      this.sort();
      this.renderItems();
      this.saveOrders();
    }
  }
  sort() {
    let total = 0;
    for ( let index = 0; index < this.items.length - 1; index ++) {
      const item = this.items[index];
      if ( item.width === 2 && total % 2 === 1) {
        if (index === 11) {
          const nextOneItem  =  this.items[12];
          this.items.splice(12, 1);
          this.items.splice(11, 0, nextOneItem);
          break;
        } else {
          const nextOneItem  =  this.getOneItem(index);
          this.items.splice(index, 0, nextOneItem);
          break;
        }
      }
      total += item.width;
    }
  }

  saveOrders() {
    this.reorders = [];
    this.items.forEach( item => {
      this.reorders.push(item.number);
    });
    localStorage.setItem('swapDrags', JSON.stringify(this.reorders));
  }

  getOneItem( currentIndex ) {
    for ( let index = 0; index < this.items.length; index ++) {
      const item = this.items[index];
      if (item !== undefined || item.width !== undefined) {
        if (item.width === 1 && index > currentIndex) {
          const  nextOneItem = this.items [index];
          this.items.splice(index, 1);
          return nextOneItem;
        }
      }
    }
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = SwapDragComponent.__isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }
}
