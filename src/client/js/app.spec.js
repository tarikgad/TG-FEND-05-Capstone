import {postData} from './app';
import '@babel/polyfill';

test('test checker', async () => {
    await expect(postData('http://localhost:8080/add_position',{ inputdata:"I like the new football" })).not.toBe({});
});

