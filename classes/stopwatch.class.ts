import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';

import { IStopwatch } from '../interfaces/stopwatch.interface';

import { StopwatchState } from '../interfaces/stopwatch.interface';
import { Stopped } from '../interfaces/stopwatch.interface';
import { Timing } from '../interfaces/stopwatch.interface';
import { Waiting } from '../interfaces/stopwatch.interface';

import { StopwatchMode } from '../interfaces/stopwatch.interface';
import { CountDown } from '../interfaces/stopwatch.interface';
import { CountUp } from '../interfaces/stopwatch.interface';

export class Stopwatch implements IStopwatch
{

  // Interface Properties

  public get mode(): StopwatchMode
  {
    return this._mode!;
  }

  public get state(): StopwatchState
  {
    return this._state$.getValue();
  }

  public get interval(): number
  {
    return this._interval!;
  }

  public get duration(): number | null
  {
    return this._duration || null;
  }

  public get start$(): Observable<void>
  {
    return this._start$.asObservable();
  }

  public get tick$(): Observable<number>
  {
    return this._tick$.asObservable();
  }

  public get stop$(): Observable<number>
  {
    return this._stop$.asObservable();
  }

  // Private Instance Fields

  private _ticks: number;

  private readonly  _mode: StopwatchMode;

  private readonly  _interval: number;

  private readonly  _duration: number;

  private readonly  _state$: BehaviorSubject<StopwatchState>;

  private readonly  _counter$: BehaviorSubject<number>;

  private readonly  _start$: Subject<void>;

  private readonly  _tick$: Subject<number>;

  private readonly  _stop$: Subject<number>;

  // Private Instance Properties

  private get _increment(): number
  {
    return ((this.countsUp() ? 1 : -1))
  }

  // Constructor

  public constructor(mode: StopwatchMode = CountUp, interval: number = 1000, duration: number = 0)
  {
    this._mode = mode;
    this._interval = interval;
    this._duration = duration;
    this._ticks = ((duration === 0) ? duration : Math.ceil(duration / interval));
    this._state$ = new BehaviorSubject<StopwatchState>(Waiting);
    this._counter$ = new BehaviorSubject<number>(0);
    this._start$ = new Subject<void>();
    this._tick$ = new Subject<number>();
    this._stop$ = new Subject<number>();
  }

  // Interface Methods

  public start(): void
  {
    timer(0, this._interval)
      .pipe(map((timestamp: number, index: number) =>
      {
        if (index === 0)
        {
          this._state$.next(Timing);
          this._start$.next();
        }
        let counter = this._counter$.getValue();
        this._tick$.next(counter);
        counter += this._increment;
        if (this.countsUp() || counter > 0)
        {
          this._counter$.next(counter);
          return counter;
        }
        this._stop$.next(counter);
        return counter;
      }))
      .pipe(takeUntil(this._stop$))
      .subscribe(
        (counter: number) =>
        {
          console.log('Tick: Counter = ' + counter + '.');
        },
        (error: any) =>
        {
          console.log('Tick: An error occurred.');
        },
        () =>
        {
          this._state$.next(Stopped);
          console.log('Tick: Complete.');
        });
  }

  public restart(): void
  {
    this.stop();
    this.start();
  }

  public stop(): number
  {
    let counter = this._counter$.getValue();
    this._stop$.next(counter);
    return counter;
  }

  public countsUp(): boolean
  {
    return (this._mode === CountUp);
  }

  public countsDown(): boolean
  {
    return (this._mode === CountDown);
  }

}
