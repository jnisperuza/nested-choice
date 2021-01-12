import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Icon, Option } from '../nested-choice-field.models';

@Component({
  selector: 'select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss']
})
export class SelectItemComponent implements OnInit {
  @Input() optionTpl: TemplateRef<any>;
  @Input() data: Option[];
  @Input() level = 0;
  @Input() instance: number;
  @Input() isActive: (option: Option) => void;
  @Input() parseIcon: (option?: string) => Icon;
  @Input() select: ($event: Event, option: any) => void;
  @Input() openList: ($event: Event, childrenList: HTMLElement) => void;

  constructor() { }

  ngOnInit() { }
}
