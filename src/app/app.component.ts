import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nested-choice';
  data = [];

  opened(): void {
    this.data = [
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
                icon: 'https://cdn4.iconfinder.com/data/icons/simplicio/128x128/piechart.png',
                id: 6
              }
            ]
          },
          {
            label: 'Human resources',
            icon: 'https://cdn4.iconfinder.com/data/icons/top-search-7/128/_contact_book_contacts-_address_phonebook_human_list_profile_resources-256.png',
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



}
