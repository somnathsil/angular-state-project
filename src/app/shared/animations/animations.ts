import {
  style,
  query,
  state,
  trigger,
  animate,
  transition,
} from '@angular/animations';

/**
 * *Fade In Out Animation
 *
 * @date 11 May 2022
 *
 */
export const fadeAnimation = trigger('fadeAnimation', [
  state('void', style({ opacity: 0 })),
  transition('void => *, * => void', [animate(150)]),
]);

/**
 * *Fade In Out Router Animation
 *
 * @date 11 May 2022
 *
 */
export const routerAnimation = trigger('routerAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [
        style({
          opacity: 1,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }),
        animate('0.15s', style({ opacity: 0 })),
      ],
      { optional: true }
    ),
    query(
      ':enter',
      [
        style({
          opacity: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }),
        animate('0.15s', style({ opacity: 1 })),
      ],
      { optional: true }
    ),
  ]),
]);

/**
 * *Slide In Out Router Animation
 *
 * @date 11 May 2022
 *
 */
export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateY(10px)', opacity: 0 }),
    animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({ transform: 'translateY(10px)', opacity: 0 })
    ),
  ]),
]);

/**
 * *height Animation
 *
 * @date 11 May 2022
 *
 */
export const toggleHeight = trigger('toggleHeight', [
  transition(':enter', [
    style({ height: '0', opacity: 0 }),
    animate(
      '400ms cubic-bezier(0.86, 0, 0.07, 1)',
      style({ height: '*', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    animate(
      '400ms cubic-bezier(0.86, 0, 0.07, 1)',
      style({ height: 0, opacity: 0 })
    ),
  ]),
]);

/**
 * *Slide In Left Animation
 *
 * @date 21 May 2023
 * @developer Your Name
 */
export const slideInLeft = trigger('slideInLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-50%)', opacity: 0 }),
    animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(
      '300ms ease-in',
      style({ transform: 'translateX(-50%)', opacity: 0 })
    ),
  ]),
]);

/**
 * *Slide In Right Animation
 *
 * @date 21 May 2023
 * @developer Your Name
 */
export const slideInRight = trigger('slideInRight', [
  transition(':enter', [
    style({ transform: 'translateX(50%)', opacity: 0 }),
    animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(
      '300ms ease-in',
      style({ transform: 'translateX(50%)', opacity: 0 })
    ),
  ]),
]);
