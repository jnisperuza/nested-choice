import {
  ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ViewContainerRef,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostListener,
  HostBinding
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import {
  filter,
  takeUntil,
  distinctUntilChanged,
  debounceTime
} from 'rxjs/operators';
import { PopperRef, Option, Icon } from './nested-choice-field.models';

@Component({
  selector: 'nested-choice-field',
  templateUrl: './nested-choice-field.component.html',
  styleUrls: ['./nested-choice-field.component.scss']
})
export class NestedChoiceFieldComponent
  implements OnInit, OnChanges {
  @Input() labelKey = 'label';
  @Input() idKey = 'id';
  @Input() iconKey = 'icon';
  @Input() visibleOptions = 10;
  @Input() data: Option[] = [];
  @Input() currentOption: Option | number | string;
  @Input() optionTpl: TemplateRef<any>;
  @Input() required: boolean;
  @Input() searchbox: boolean;
  @Input() placeholderSearch = 'Search';
  @Input() textNoOptions = 'No options';
  @Input() labelText: string;
  @Input() width: string | number;
  @Input() disabled: boolean;
  @Input() hidden: boolean;
  @Output() selectChange = new EventEmitter();
  @Output() opened = new EventEmitter();
  @Output() closed = new EventEmitter();

  @ViewChild('nestedChoiceField') nestedChoiceField: ElementRef;
  @ViewChild('origin') origin: ElementRef;
  @ViewChild('dropdown') dropdown: TemplateRef<any>;

  instance = Math.floor(Math.random() * Date.now());
  searchControl: FormControl = new FormControl();
  widthSelectMenu: number;
  searching: boolean;

  private view: EmbeddedViewRef<any>;
  private originalData: Option[] = [];
  private originalVisibleOptions = 10;
  private popperRef: PopperRef;

  @HostBinding('style.width') hostWidth: string;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.close();
  }
  @HostListener('window:resize', ['$event']) onResize() {
    this.updateWidthSelectMenu();
  }

  constructor(
    private vcr: ViewContainerRef,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: value => {
          this.searching = true;
          setTimeout(() => this.search(value), 100);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.loadData();
    }
    if (changes.visibleOptions?.isFirstChange) {
      this.originalVisibleOptions = changes.visibleOptions.currentValue;
    }
    if (changes.width?.currentValue) {
      this.updateWidthSelectMenu();
    }
  }

  get label(): string {
    return this.currentOption && this.currentOption[this.labelKey];
  }

  get icon(): Icon {
    return this.currentOption
      ? this.parseIcon(this.currentOption[this.iconKey]) : this.parseIcon();
  }

  get isOpen(): boolean {
    return !!this.popperRef;
  }

  search(value: string): void {
    if (value) {
      this.flatChildren(this.originalData).then((allItems: Option[]) => {
        this.data = allItems
          .map(item => {
            item.isParent = !!item.children;
            return item;
          })
          .filter(
            (option: Option, index: number) => {
              if (allItems.length - 1 === index) {
                this.searching = false;
              }
              return !option.isParent &&
                option[this.labelKey].toLowerCase().includes(value.toLowerCase());
            }
          );
      });
    } else {
      this.searching = false;
      this.data = this.originalData;
      requestAnimationFrame(() => {
        this.closeAllChildrenList();
      });
    }
    requestAnimationFrame(() => {
      this.updateVisibleOptions();
    });
  }

  select($event: Event, option: Option): void {
    if (!option.disabled) {
      const selector = $event.target as HTMLElement;
      if ($event) {
        $event.stopPropagation();
      }
      if (selector && !selector.classList.contains('has-child')) {
        this.currentOption = option;
        this.selectChange.emit(option);
        this.close();
      }
    }
  }

  isActive(option: Option): boolean {
    if (!this.currentOption) {
      return false;
    }
    if (option.children?.length) {
      return !!option.children.find(
        currentOption =>
          currentOption[this.idKey] === this.currentOption[this.idKey]
      );
    } else {
      return option[this.idKey] === this.currentOption[this.idKey];
    }
  }

  open(): void {
    if (!this.isOpen && !this.disabled) {
      this.opened.emit();
      this.updateVisibleOptions();
      this.updateWidthSelectMenu();
      this.createEmbeddedView();
    }
  }

  openList($event: Event, childOption: HTMLElement): void {
    if (!this.disabled) {
      const target = $event.target as HTMLElement;
      const option =
        target.tagName === 'MAT-ICON'
          ? (target.parentNode as HTMLElement)
          : target;
      const selectors = [option, childOption];
      const isOpen = childOption.classList.contains('opened');
      const childListHeight = childOption.offsetHeight;

      if ($event) {
        $event.stopPropagation();
      }
      selectors.forEach(selector => {
        if (!selector) {
          return;
        }
        if (isOpen) {
          this.closeChildrenList(childOption);
          selector.classList.remove('opened');
        } else {
          selector.classList.add('opened');
        }
      });

      const amountChilds = !isOpen
        ? Array.from(childOption.children).length
        : (childListHeight / 32) * -1;

      this.updateVisibleOptions(amountChilds);
    }
  }

  parseIcon(icon?: string): Icon {
    return icon ?
      (icon.includes('http') ? { type: 'img', path: icon } : { type: 'matIcon', path: icon }) :
      { type: null, path: null };
  }

  mouseEnter(event: Event, label: string): void {
    const option = event.target as HTMLElement;
    if (!option.title) {
      if (option.offsetWidth < (label.length / 10) * 100) {
        option.title = label;
      }
    }
  }

  private loadData(): void {
    const COPT = this.currentOption instanceof Object ? this.currentOption[this.idKey] : String(this.currentOption);
    if (this.data) {
      this.originalData = [...this.data];
      this.flatChildren(this.data).then((allItems: Option[]) => {
        if (this.currentOption !== undefined) {
          this.currentOption = allItems.find(
            currentOption => String(currentOption[this.idKey]) === COPT
          );
        }
      });
      this.updateVisibleOptions();
    }
  }

  private createEmbeddedView(): void {
    const dropdownTpl = this.dropdown;
    const origin = this.origin?.nativeElement;

    if (dropdownTpl && origin) {
      this.view = this.vcr.createEmbeddedView(dropdownTpl);
      const dropdown = this.view.rootNodes[0];

      document.body.appendChild(dropdown);

      this.zone.runOutsideAngular(() => {
        origin.appendChild(dropdown);
        this.popperRef = {
          reference: origin,
          popper: dropdown,
          destroy() {
            if (this?.popper) {
              this.popper.remove();
            }
          }
        };
      });
      this.handleClickOutside();
    }
  }

  private close(): void {
    this.closed.emit();
    this.searchControl.patchValue('');
    if (this.popperRef && this.view) {
      this.popperRef.destroy();
      this.view.destroy();
      this.view = null;
      this.popperRef = null;
    }
  }

  private handleClickOutside(): void {
    fromEvent(document, 'click')
      .pipe(
        filter(($event: MouseEvent) => {
          const target = $event.target as HTMLElement;
          const origin = this.popperRef.reference;

          return (
            origin.contains(target) === false &&
            target.dataset.instance !== String(this.instance)
          );
        }),
        takeUntil(this.closed)
      )
      .subscribe(() => {
        this.close();
        this.cdr.detectChanges();
      });
  }

  private updateVisibleOptions(amountChilds?: number): void {
    const size = Number.isInteger(amountChilds)
      ? this.visibleOptions + amountChilds
      : this.data.length;

    this.visibleOptions = !size
      ? 1
      : size < this.originalVisibleOptions
        ? size
        : this.originalVisibleOptions;
  }

  private flatChildren(data: Option[]): Promise<Option[]> {
    return new Promise(resolve => {
      const allItems = [...data];
      const addOption = (option: Option) => {
        const found = allItems.find(_option => _option.id === option.id);
        if (!found) {
          allItems.push(option);
        }
      };
      const toCheck = (_data: Option[]) => {
        _data.forEach((option: Option) => {
          if (option.children) {
            addOption(option);
            toCheck(option.children);
          } else {
            addOption(option);
          }
        });
      };
      toCheck(allItems);
      resolve(allItems);
    });
  }

  private closeChildrenList(selector: HTMLElement | Element): void {
    if (selector) {
      selector.classList.remove('opened');
      Array.from(selector.children).forEach(child => {
        if (child.children.length) {
          this.closeChildrenList(child);
        }
      });
    }
  }

  private closeAllChildrenList(): void {
    const selectors = document.querySelectorAll(
      'div[data-instance=\'' + this.instance + '\']'
    );
    Array.from(selectors).forEach(selector => {
      this.closeChildrenList(selector);
    });
  }

  private updateWidthSelectMenu(): void {
    requestAnimationFrame(() => {
      this.widthSelectMenu = this.nestedChoiceField?.nativeElement?.offsetWidth;
    });
  }
}
