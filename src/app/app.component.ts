import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nested-choice';


  data = [
    {
      label: 'Company',
      icon: '',
      id: 1,
      children: [
        {
          label: 'Process',
          icon: '',
          id: 3,
          children: [
            {
              label: 'Home',
              icon: 'home',
              id: 5
            },
            {
              label: 'Statistics',
              icon: 'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-05.png',
              id: 6
            }
          ]
        },
        {
          label: 'Human resources',
          icon: '',
          id: 4
        }
      ]
    },
    {
      label: 'Financial',
      icon: '',
      id: 2
    }
  ];

}
