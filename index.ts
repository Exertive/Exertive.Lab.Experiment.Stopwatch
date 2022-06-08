import './style.css';

import { of, map, Observable } from 'rxjs';

import { Stopwatch } from './classes/stopwatch.class';

import { IStopwatch } from './interfaces/stopwatch.interface';

import { CountDown } from './interfaces/stopwatch.interface';

// Open the console in the bottom right to see results.

// Create a new Stopwatch instance.
let stopwatch = new Stopwatch(CountDown, 1000, 10000);

// Supscribe to its observables.

stopwatch.start$.subscribe(() =>
{
  console.log('Stopwatch: Started.');
});

stopwatch.tick$.subscribe((counter: number) =>
{
  console.log('Stopwatch: There are ' + counter + ' seconds to go.');
});

stopwatch.stop$.subscribe((_: number) =>
{
  console.log('Stopwatch: Time\'s up!.');
});

// Start the Stopwatch

stopwatch.start();
