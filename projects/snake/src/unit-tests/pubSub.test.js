const pubSubTest = require('../pubSub');  

test('Publish',() => {
    expect(pubSubTest.publish('subTest','')).toBe(undefined);
})

test('Publish Happy Path',() => {    
    let subResult = '';
    
    pubSubTest.subscribe('subHappy',(data) => subResult = data);

    pubSubTest.publish('subHappy','Published!');
    expect(subResult).toEqual('Published!')
})

test('Unsubscribe',() => {
    let subResult = '';

    let updateSubResult = pubSubTest.subscribe('unsubTest',(data) => subResult = data);

    pubSubTest.publish('unsubTest','Subscribed!');
    
    expect(subResult).toEqual('Subscribed!');

    updateSubResult.unsubscribe();
    pubSubTest.publish('unsubTest','Unsubscribed!');

    expect(subResult).toEqual('Subscribed!');

})