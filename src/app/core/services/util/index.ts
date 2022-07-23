import { MemoizedSelector, Selector, Store,  } from "@ngrx/store";
import { Observable, take, lastValueFrom } from "rxjs";

export const toFirstUpperCase = (chain: string) => {
  return chain && chain[0].toUpperCase() + chain.slice(1);
}

export const getCurrentValue = async <T, R>(store : Store<T>, selector: MemoizedSelector<T, R>) => {
  return await lastValueFrom(store.select(selector).pipe(take(1)));
}
