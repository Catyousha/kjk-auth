/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'AuthController.index')
  Route.get('/login', 'AuthController.viewLogin'),
  Route.post('/login', 'AuthController.login'),
  Route.get('/register', 'AuthController.viewRegister'),
  Route.post('/register', 'AuthController.register'),
  Route.get('/logout', 'AuthController.logout')
})

Route.group(() => {
  Route.get('/forgot-password', 'ForgotPassesController.viewAskEmail')
  Route.post('/forgot-password', 'ForgotPassesController.askEmail')
  Route.get('/reset-password', 'ForgotPassesController.viewResetPass')
  Route.post('/reset-password', 'ForgotPassesController.resetPass')
})