import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import {schema, rules} from '@ioc:Adonis/Core/Validator';
import Crypto from 'App/Helpers/Crypto';

export default class AuthController {
    public async index(ctx: HttpContextContract) {
        var {view, session, response} = ctx;
        var isLoggedIn = session.get('isLoggedIn', false);
        if(!isLoggedIn) {
            return response.redirect('/login');
        }
        return view.render('home/home');
    }

    public async login(ctx: HttpContextContract) {
        var {request, session, response} = ctx;
        const formRules = schema.create({
            username: schema.string(),
            password: schema.string(),
        });
        try {
            await request.validate({
                schema: formRules,
                messages: {
                    required: 'The {{ field }} is required to create a new account',
                }
            });
        } catch (err) {
            session.flash(err);
            return response.redirect().back();
        }

        var username = request.input('username');
        var pass = request.input('password');
        var encryptedPass = new Crypto().encrypt(pass);
        var account = await User
            .query()
            .where('username', username)
            .where('password', encryptedPass)
            .first();
        if(account == null) {
            session.flash({
                loginFailed: 'Login failed, credentials not match.'
            });
            return response.redirect().back();
        }
        session.put('isLoggedIn', true);
        session.put('currentUser', account);
        return response.redirect('/')
    }

    public async register(ctx: HttpContextContract) {
        var {request, session, response} = ctx;
        const formRules = schema.create({
            username: schema.string({}, [
                rules.unique({ table: 'users', column: 'username', caseInsensitive: true,})
            ]),
            password: schema.string({}, [
                rules.minLength(8),
            ]),
            email: schema.string({}, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email', caseInsensitive: true,}),
            ]),
            address: schema.string(),
            phone: schema.string(),
        })

        try {
            await request.validate({
                schema: formRules,
                messages: {
                    required: 'The {{ field }} is required to create a new account',
                    unique: 'The {{ field }} is already exist!'
                }
            })
        } catch (err) {
            session.flash(err)
            return response.redirect().back();
        }

        const user = new User()
        user.username = request.input('username')
        user.password = request.input('password')
        user.email = request.input('email')
        user.address = request.input('address')
        user.phone = request.input('phone')

        await user.save()
        session.flash({
            registerSuccess: 'Register success! Please login with your account.'
        })
        return response.redirect('/login')
    }

    public async logout(ctx: HttpContextContract) {
        var {session, response} = ctx;
        session.clear()
        return response.redirect('/login')
    }

    public async viewLogin(ctx: HttpContextContract) {
        var {view} = ctx
        return view.render('auth/login')
    }

    public async viewRegister(ctx: HttpContextContract) {
        var {view} = ctx
        return view.render('auth/register')
    }
}
