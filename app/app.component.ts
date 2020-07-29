import {
    Component,
    ViewEncapsulation
} from '@angular/core';

import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { OrdersService } from './northwind.service';

@Component({
    selector: 'my-app',
    providers: [OrdersService],
    /*
     * Set a fixed row height of 36px (20px line height, 2 * 8px padding)
     *
     * [row height] = [line height] + [padding] + [border]
     *
     * Note: If using the Kendo UI Material theme, add 1px to the row height
     * to account for the bottom border width.
     */
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .k-grid tbody td {
            white-space: nowrap;
            line-height: 20px;
            padding: 8px 12px;
        }
    `],
    template: `
      <kendo-grid
          [data]="query | async"
          [loading]="loading"
          [skip]="state.skip"
          [pageSize]="state.take"
          scrollable="virtual"
          [rowHeight]="36"
          [height]="450"
          (pageChange)="pageChange($event)"
        >
        <kendo-grid-column field="OrderID" [width]="80" title="ID"></kendo-grid-column>
        <kendo-grid-column field="ShipName" title="Ship Name" [width]="200"></kendo-grid-column>
        <kendo-grid-column field="ShipAddress" title="Ship Address" [width]="200"></kendo-grid-column>
        <kendo-grid-column field="ShipCity" title="Ship City" [width]="100"></kendo-grid-column>
        <kendo-grid-column field="ShipCountry" title="Ship Country" [width]="100"></kendo-grid-column>
      </kendo-grid>
  `
})
export class AppComponent {
    public loading: boolean;

    public state: any = {
        skip: 0,
        take: 100
    };

    public query: any;
    private stateChange = new BehaviorSubject<any>(this.state);

    constructor(private service: OrdersService) {

        this.query = this.stateChange.pipe(
            tap(state => {
                this.state = state;
                this.loading = true;
            }),
            switchMap(state => service.fetch(state)),
            tap(() => {
                this.loading = false;
            })
        );
    }

    public pageChange(state: any): void {
        this.stateChange.next(state);
    }
}
