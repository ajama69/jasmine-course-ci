// Jasmine Docs for matchers: https://jasmine.github.io/api/4.5/matchers
// Third party matchers: https://github.com/JamieMason/Jasmine-Matchers

describe('calculator.js', function() {

    describe('Calculator', function() {
        let calculator;
        let calculator2;

        beforeEach(function() {
            // Anything inside this block executes before
            // each spec (it) inside this describe
            calculator = new Calculator();
            calculator2 = new Calculator();
        });

        afterEach(function() {
            // Anything inside this block executes after
            // each spec (it) inside this describe
        });

        it('should initialize the total', function() {
            expect(calculator.total).toBe(0);
            expect(calculator.total).toBeFalsy();
        });

        it('can be instantiated', function() {
            jasmine.addMatchers(customMatchers);

            expect(calculator).toBeCalculator();
            // expect(2).toBeCalculator(); // => false
            expect(2).not.toBeCalculator();
            // expect(calculator1).not.toBeCalculator(); // => false

            expect(calculator).toBeTruthy();
            expect(calculator2).toBeTruthy();
            expect(calculator).toEqual(calculator2);
            expect(calculator.constructor.name).toContain('Calc');
        });

        it('instantiates unique object', function() {
            // two different object references, hence toBe() returns false:
            // expect(calculator1).toBe(calculator2);

            // correct assertion with not.toBe():
            expect(calculator).not.toBe(calculator2);
        });

        it('has common operations', function() {
            expect(calculator.add).toBeDefined();  // or: not.toBeUndefined();
            expect(calculator.subtract).not.toBeUndefined();
            expect(calculator.multiply).not.toBeUndefined();
            expect(calculator.divide).not.toBeUndefined();
        });

        it('can overwrite total', function() {
            calculator.total = null;
            expect(calculator.total).toBeNull();
        });

        describe('add()', function() {
            it('should add numbers to total', function() {
                calculator.add(5);
                // expect total to be 5
                expect(calculator.total).toBe(5);
                // expect 5 + 5 to be 10
            });

            it('returns total', function() {
                calculator.total = 50;

                expect(calculator.add(20)).toBe(70);
                expect(calculator.total).toMatch(/-?\d+/);
                expect(typeof calculator.total).toMatch('number');
                expect(calculator.total).toBeNumber();

                // asymmetric matchers:
                // anything() matches primitives, objects, functions etc. but not "null" and "undefined"
                expect(calculator.total).toEqual(jasmine.anything());
                expect(function() {}).toEqual(jasmine.anything());
                // expect(null).not.toEqual(jasmine.anything());
                // expect(undefined).not.toEqual(jasmine.anything());
            });
        });

        describe('subtract()', function() {
            it('should subtract numbers from total', function() {
                calculator.total = 30;
                calculator.subtract(5);

                // 30 - 5 = 25
                expect(calculator.total).toBe(25);
            });
        });

        describe('multiply()', function() {
            it('should multiply total by number', function() {
                calculator.total = 100;
                calculator.multiply(2);

                expect(calculator.total).toBe(200);
            });

            it ('does not handle NaN', function() {
                calculator.total = 20;
                calculator.multiply('a');

                expect(calculator.total).toBeNaN();
            });

            it ('handles divide by zero', function() {
                expect(function() { calculator.divide(0) }).toThrow();
                expect(function() { calculator.divide(0) }).toThrowError(Error);
                expect(function() { calculator.divide(0) }).toThrowError(Error, 'Cannot divide by zero');
            });
        });

        describe('divide()', function() {
            it('should divide total by number', function() {
                calculator.total = 350;
                calculator.divide(7);

                expect(calculator.total).toBe(50);
            });
        });

        describe('get version', function() {
            // method #1 (without async / await)
            it('fetches version from external source (without async/await)', function(done) {
                spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                    new Response('{ "version": "0.1" }')
                ));

                calculator.version.then(function(version) {
                    expect(version).toBe('0.1');

                    done();
                });
            });

            // method #2 (with async / await)
            //
            // note: don't mix async/await with done()!
            // otherwise following error is reported:
            // Safari 16.2 (Mac OS 10.15.7) calculator.js Calculator get version fetches version from external source (with async/await) FAILED
            // An asynchronous before/it/after function was defined with the async keyword but also took a done callback. Either remove the done callback (recommended) or remove the async keyword. thrown
            it('fetches version from external source (with async/await)', async function() {
                spyOn(window, 'fetch').and.returnValue(Promise.resolve(
                    new Response('{ "version": "0.1" }')
                ));

                const version = await calculator.version;
                expect(version).toBe('0.1');
            });
        });
    });
});
