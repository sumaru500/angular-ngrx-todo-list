import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {

  /**
   * Get an item in `localStorage`
   * Return type is unknown as the client could have altered the storage
   */
   getItem(index: string): unknown {

    let value = null;

    /* Catching the error is important to avoid a parse error */
    try {
      const unparsedValue = localStorage.getItem(index);
      value = unparsedValue ? JSON.parse(unparsedValue) : null;
    } catch (error) {
      value = null;
    }

    return value;

  }

  /**
   * Save an item in `localStorage`
   */
  setItem(index: string, value: unknown): void {

    localStorage.setItem(index, JSON.stringify(value));

  }

  /**
   * Remove an item in `localStorage`
   */
  removeItem(index: string): void {

    localStorage.removeItem(index);

  }

  /**
   * Save all items in `localStorage`
   */
  clear(): void {

    localStorage.clear();

  }

}
