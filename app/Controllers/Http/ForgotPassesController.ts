import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import {schema, rules} from '@ioc:Adonis/Core/Validator';

export default class ForgotPassesController {

    private async generateCode() {
        //...//
        return '123';
    }

    public async askEmail(ctx: HttpContextContract) {
        var {request, response, session} = ctx;
        var email = request.input('email');

        var account = await User.findBy('email', email)
        if(account == null) {
            session.flash('emailCheckFailed', 'No account is linked with this email!');
            session.flash('email', email)
            return response.redirect().back()
        }
        var code = await this.generateCode();
        session.put('code', code);
        session.put('acc-email', email);
        return response.redirect('/reset-password')
    }

    public async resetPass(ctx: HttpContextContract) {
        var {session, request, response} = ctx;
        if(!session.has('code') || !session.has('acc-email')) {
            return response.redirect('/forgot-password')
        }

        const formRules = schema.create({
            newPassword: schema.string({}, [
                rules.minLength(8),
            ]),
        });
        try {
            await request.validate({
                schema: formRules,
                messages: {
                    required: 'The {{ field }} is required!',
                }
            });
        } catch (err) {
            session.flash(err);
            return response.redirect().back();
        }

        var email = session.get('acc-email');
        var code = request.input('code');
        var newPass = request.input('newPassword');

        if(code != session.get('code')){
            session.flash('codeFailed', "Wrong code!");
            return response.redirect().back();
        };

        var acc = await User.findBy('email', email);
        acc!.password = newPass;
        acc!.save();

        session.forget('code');
        session.forget('acc-email');
        session.flash('resetPassSuccess', 'Password has been reset successfully!')
        return response.redirect('/login');
    }
    
    public async viewAskEmail(ctx: HttpContextContract) {
        var {view} = ctx;
        return view.render('forgot-password/ask-email');
    }

    public async viewResetPass(ctx: HttpContextContract) {
        var {view} = ctx;
        return view.render('forgot-password/reset-password');
    }
}
