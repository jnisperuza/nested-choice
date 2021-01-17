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
  @Input() labelKey: string;
  @Input() idKey: string;
  @Input() iconKey: string;
  @Input() level = 0;
  @Input() instance: number;
  @Input() isActive: (option: Option) => void;
  @Input() parseIcon: (option: string) => Icon;
  @Input() mouseEnter: ($event: Event, label: string) => void;
  @Input() select: ($event: Event, option: Option) => void;
  @Input() openList: ($event: Event, childrenList: HTMLElement) => void;

  constructor() { }

  ngOnInit(): void { }
}
