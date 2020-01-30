import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import { UserService } from './user.service';
import {AngularFireAuth} from "@angular/fire/auth";


@Injectable()
export class AuthService implements CanActivate {


    constructor(private router: Router,
                private user: UserService,
                private afAuth: AngularFireAuth) {

    }

    async canActivate(route) {
        if (await this.user.isAuthenticated()) {
            return true
        }
        this.router.navigate(['/login'])
        return false
    }

    getAuth() {
        return this.afAuth.auth;
    }

    /**
     * Initiate the password reset process for this user
     * @param email email of the user
     */
    resetPasswordInit(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }
}
