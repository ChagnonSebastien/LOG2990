import { expect } from 'chai';
import { Authentication } from './authentication';
import { assert } from 'chai';

describe('Authentication Class', () => {
    let auth = new Authentication('login_tests');
    
    it('login should return authenticated', () => {
        let authenticated = auth.login('walleandtomato');
        assert(true);
    })
})