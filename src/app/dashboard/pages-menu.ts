import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Orders',
    icon: 'shopping-bag-outline',
    link: '/pages/AdminOrderListing',
    home: true,
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/pages/UsersListing',
    home: true,
  },
  {
    title: 'Drivers',
    icon: 'car-outline',
    link: '/pages/DriversListing',
    home: true,
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
