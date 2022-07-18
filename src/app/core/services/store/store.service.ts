import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { first, filter, distinctUntilChanged, map } from 'rxjs/operators';
import {initWebSocket} from '~core/websocket';

import {State} from '~model';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private clientSocket: SocketIOClient.Socket;

  constructor() {
    this.clientSocket = initWebSocket();
  }

  public getClientSocket(): SocketIOClient.Socket {
    return this.clientSocket;
  }

  /* Event emitting when the state changes */
  private store = new ReplaySubject<Partial<State>>(1);
  /* State current value */
  private state: Partial<State> = {};

  /**
   * Get a property from the state *asynchronously* and listen to its changes *continuously*.
   *
   * As it's continuous, don't forget to unsubscribe when don't need to listen anymore.
   *
   * @param property Name of the property you want to get in the state
   * @returns An Observable emitting the current value and then emitting each change
   *
   * Example:
   * ```typescript
   * @Component({
   *   template: `<div *ngIf="isAuthenticated$ | async"></div>`
   * })
   * export class SomeComponent implements OnInit {
   *
   *   isAuthenticated$: Observable<boolean>;
   *
   *   ngOnInit(): void {
   *      this.isAuthenticated$ = this.store.select('isAuthenticated');
   *   }
   *
   * }
   * ```
   */
  select<T extends keyof State>(property: T): Observable<State[T]> {

    return this.store.pipe(
      /* The property may not to be initialized yet */
      filter((state) => (property in state)),
      /* Select a property in the state */
      map((state) => (state as State)[property]),
      /* Emit only when the value is new */
      distinctUntilChanged(),
    );

  }

  /**
   * Get a property from the state *asynchronously* but *just once*.
   *
   * As it's just once, it won't emit again on changes and you don't need to unsubscribe.
   *
   * @param property Name of the property you want to get in the state
   * @returns An Observable emitting the value you asked just once
   *
   * Example:
   * ```typescript
   * this.store.selectOnce('isAuthenticated').subscribe((isAuthenticated) => {});
   * ```
   */
  selectOnce<T extends keyof State>(property: T): Observable<State[T]> {

    return this.select(property).pipe(
      /* Emit just one value and then close the Observable */
      first(),
    );

  }

  /**
   * Get a property from the state *synchronously* and *just once*.
   *
   * **Warning**: this method is available as a convenience
   * for specific cases but should be used with caution.
   * Why? Because some properties of the state may require time to be initiliazed
   * (eg., authentification status needs to check in local storage first).
   * For these properties, if you try to get them via the snapshot
   * at initialization time (ie. in services' constructor, guards,...),
   * the value may be `undefined`.
   *
   * @param property Name of the property you want to get in the state
   * @returns The value you asked
   *
   * Example:
   * ```typescript
   * const equipments = this.store.selectSnapshot('equipments');
   * ```
   */
  selectSnapshot<T extends keyof State>(property: T): State[T] | undefined {
    return (property in this.state) ? this.state[property] as State[T] : undefined;
  }

  /**
   * Update the state
   * @param partialState Object with the properties you want to update
   *
   * Example:
   * ```typescript
   * this.store.update({ token: 'abcdefghijklmnopqrstuvwxyz' });
   * ```
   */
  update(partialState: Partial<State>): void {

    /* Catch errors of serialization */
    try {

      /* Remove object/array references */
      const flatPartialState = JSON.parse(JSON.stringify(partialState)) as Partial<State>;

      this.state = { ...this.state, ...flatPartialState };

      this.store.next(this.state);

    } catch {}

  }

}
