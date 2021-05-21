import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubmitLeave } from '../../models/submit-leave';

@Injectable({
  providedIn: 'root',
})
export class SubmitLeaveService {
  constructor() {}

  get(): Observable<SubmitLeave[]> {
    return of([
      { id: 5012, image: 'assets/icons/cake.svg', name: 'Dairy Omung' },
      { id: 851, image: 'assets/icons/cake.svg', name: 'Dutch Lady' },
      { id: 2271, image: 'assets/icons/cake.svg', name: 'Frisian Flag' },
      { id: 919, image: 'assets/icons/cake.svg', name: 'Gummy Candy' },
      { id: 988, image: 'assets/icons/cake.svg', name: 'Kitkat' },
      { id: 1018, image: 'assets/icons/cake.svg', name: 'Lays' },
      { id: 923, image: 'assets/icons/cake.svg', name: 'Loacker' },
      { id: 933, image: 'assets/icons/cake.svg', name: 'Nescafe' },
      { id: 5016, image: 'assets/icons/cake.svg', name: 'Olpers Cream' },
      { id: 5021, image: 'assets/icons/cake.svg', name: 'Olpers Flavored Milk' },
      { id: 5015, image: 'assets/icons/cake.svg', name: 'Olpers ProCal' },
      { id: 2467, image: 'assets/icons/cake.svg', name: 'Omela' },
      { id: 5017, image: 'assets/icons/cake.svg', name: 'Dobala' },
      { id: 965, image: 'assets/icons/cake.svg', name: 'Ovaltine' },
      { id: 3934, image: 'assets/icons/cake.svg', name: 'PEAK CHOCO' },
      { id: 3935, image: 'assets/icons/cake.svg', name: 'PEAK CONDENSE' },
      { id: 3936, image: 'assets/icons/cake.svg', name: 'PEAK EVAP' },
      { id: 3937, image: 'assets/icons/cake.svg', name: 'PEAK POWDER' },
      { id: 3938, image: 'assets/icons/cake.svg', name: 'PEAK UHT' },
      { id: 3939, image: 'assets/icons/cake.svg', name: 'PEAK YOGHURT' },
    ]);
  }
}
