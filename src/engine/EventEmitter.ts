export class EventEmitter<T> {
    // Events
    private _eventList: { [x: string]: ((obj: T, ...data: unknown[]) => void)[] } = {};
    private _target: T;

    constructor(target: T) {
        this._target = target;
    }

    on(event: string, callback: (obj: T) => void) {
        if (!this._eventList[event]) {
            this._eventList[event] = [];
        }
        this._eventList[event].push(callback);
    }

    emit(event: string, ...data: unknown[]) {
        if (!this._eventList[event]) {
            return;
        }

        this._eventList[event].forEach((x) => {
            x(this._target, ...data);
        });
    }
}
