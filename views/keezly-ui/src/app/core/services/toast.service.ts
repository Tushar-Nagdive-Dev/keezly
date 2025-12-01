import { Injectable } from "@angular/core";
import { Toast } from "../models/item";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _toasts = new Subject<Toast>();

    toasts$ = this._toasts.asObservable();
    
    private _id = 1;

    push(message: string, type: 'success' | 'error' | 'info' = 'info', timeout: number = 3000) {
        const t: Toast = {id: this._id++, message, type, timeout};
        this._toasts.next(t);
        return t;
    }
}