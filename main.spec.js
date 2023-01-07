describe('main.js', function() {
    describe('calculate()', function() {
        it('validates expression when the first number is invalid', function() {
            spyOn(window, 'updateResult').and.stub();

            calculate('a+3');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledWith('Expression not recognized');
            expect(window.updateResult).toHaveBeenCalledTimes(1);
        });

        it('validates expression when the second number is invalid', function() {
            spyOn(window, 'updateResult');   // .and.stub() is the default, can be omitted

            calculate('3+a');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledWith('Expression not recognized');
            expect(window.updateResult).toHaveBeenCalledTimes(1);
        });

        it('validates expression when operation is invalid', function() {
            spyOn(window, 'updateResult');

            calculate('a_3');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledWith('Expression not recognized');
            expect(window.updateResult).toHaveBeenCalledTimes(1);
        });

        it('calls add', function() {
            const spy = spyOn(Calculator.prototype, 'add');

            calculate('3+4');

            // expect(Calculator.prototype.add).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(3);
            expect(spy).toHaveBeenCalledWith(4);
        });

        it('calls subtract', function() {
            const spy = spyOn(Calculator.prototype, 'subtract');

            calculate('3-7');

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(7);
        });

        it('calls multiply', function() {
            const spy = spyOn(Calculator.prototype, 'multiply');

            calculate('3*8');

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).not.toHaveBeenCalledWith(3);
            expect(spy).toHaveBeenCalledWith(8);
        });

        it('calls divide', function() {
            const spy = spyOn(Calculator.prototype, 'divide');

            calculate('3/2');

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).not.toHaveBeenCalledWith(3);
            expect(spy).toHaveBeenCalledWith(2);
        });

        it('calls updateResult (example using .and.callThrough)', function() {
            spyOn(window, 'updateResult');
            spyOn(Calculator.prototype, 'multiply').and.callThrough();

            calculate('5*5');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledTimes(1);
            expect(window.updateResult).toHaveBeenCalledWith(25);
        });

        it('calls updateResult (example using .and.callFake)', function() {
            spyOn(window, 'updateResult');
            spyOn(Calculator.prototype, 'multiply').and.callFake(function(number) {
                return 'it works';
            });

            calculate('5*5');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledTimes(1);
            // expect(window.updateResult).toHaveBeenCalledWith(25);
            expect(window.updateResult).toHaveBeenCalledWith('it works');
        });

        it('calls updateResult (example using .and.returnValue)', function() {
            spyOn(window, 'updateResult');
            spyOn(Calculator.prototype, 'multiply').and.returnValue('whatever [multiply] returns');

            calculate('5*5');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledTimes(1);
            // expect(window.updateResult).toHaveBeenCalledWith(25);
            expect(window.updateResult).toHaveBeenCalledWith('whatever [multiply] returns');
        });

        it('calls updateResult (example using .and.returnValues)', function() {
            spyOn(window, 'updateResult');
            spyOn(Calculator.prototype, 'add').and.returnValues(null, 'whatever [add] returns');

            calculate('5+5');

            expect(window.updateResult).toHaveBeenCalled();
            expect(window.updateResult).toHaveBeenCalledTimes(1);
            // expect(window.updateResult).toHaveBeenCalledWith(25);
            expect(window.updateResult).toHaveBeenCalledWith('whatever [add] returns');
        });

        it('does not handle errors', function() {
           spyOn(Calculator.prototype, 'multiply').and.throwError('some error');

           // calculate('5*5');   <- does not work because it directly throws the error
           //                        without Jasmine being able to handle it.
           //                        Therefore no assertion is possible
           expect(function() { calculate('5*5') }).toThrowError('some error');
        });
    });

    describe('updateResult()', function() {
        // variable "element" is the state of this suite for alle functions inside this suite
        // Jasmine offers a way to do this without having to define a variable using the
        // keyword "this".
        // It allows to add references to the state that Jasmine will keep and will make
        // available among the different blocks => share state between specs.
        //
        // But: Be careful with arrow functions! The scope of keyword "this" changes!

        // let element;

        beforeAll(function() {

            // Executed ONCE before all specs are executed
            // element = document.createElement('div');
            const element = document.createElement('div');
            element.setAttribute('id', 'result');

            document.body.appendChild(element);

            this.element = element;

            // additional hint (after lesson #62):
            // When using spies it isn't necessary to manipulate the DOM (adding elements)
            // because these elements are being mocked/doubled!
        });

        afterAll(function () {
            // Executed ONCE after all specs are executed
            // const element = document.getElementById('result');   => not necessary becaus of "this" in Jasmine

            document.body.removeChild(this.element);
        });

        it('adds result to DOM element', function() {
            updateResult('5');

            expect(this.element.innerText).toBe('5');
        });
    });

    describe('showVersion()', function() {
        it('calls calculator.version', function(done) {
            spyOn(document, 'getElementById').and.returnValue({
                innerText: null
            });

            // spyOn() does not work on getter/setter
            // spyOn(Calculator.prototype, 'version');
            // showVersion();
            // expect(Calculator.prototype).toHaveBeenCalled();

            // Before installing the spy 'spyOnProperty' the getter works well.
            // After installing the spy, the getter is replaced by Jasmine and doesn't return a value.
            //
            // debugger;
            // spyOnProperty(Calculator.prototype, 'version', 'get');
            // showVersion();
            // expect(Calculator.prototype.version).toHaveBeenCalled();

            // method #1 (bad alternative)
            // spyOnProperty(Calculator.prototype, 'version', 'get');
            // showVersion();
            // expect(Object.getOwnPropertyDescriptor(Calculator.prototype, 'version').get).toHaveBeenCalled();

            // method #2 (better alternative)
            // const spy = spyOnProperty(Calculator.prototype, 'version', 'get');
            // showVersion();
            // expect(spy).toHaveBeenCalled();

            // changes for fetching version from external source
            // no value for response needed because showVersion only depends on the resolving of the Promise
            const spy = spyOnProperty(Calculator.prototype, 'version', 'get').and.returnValue(Promise.resolve(
                // new Response('{ "version": "0.1" }')
                new Response()
            ));
            showVersion();
            expect(spy).toHaveBeenCalled();

            done();
        });
    });
});