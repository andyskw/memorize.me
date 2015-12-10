var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var textHelper = require("../util/textHelper");

describe("Text helper", () => {

    var start;
    var end;
    var text;
    beforeEach(() => {
        start = "david";
        end = "thanks";
        text = "David go to the shop and buy me tartar sauce thanks";
    });

    it('should not return any todos if there were no start and end marks', () => {
        text = "go to the hell";
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(0);

    });
    it('should not return any todos if there was no start mark, but there was an end mark', () => {
        text = "Can you call me, please? thanks";
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(0);

    });

    it('should return the remaining string if the start mark was left open', () => {
        text = "david bring your wife tartar sauce";
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(1);
    });

    it('should return a todo properly if both the start and the end marks are there', () => {
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(1);
    });

    it('should return a todo properly if the start mark is inside the string and the end mark is also there ', () => {
        var todo = "please go to the shop and buy some tartar sauce";
        text = "while I am not forgetting this David " + todo + " thanks honey";
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(1);
    });


    it('should be able to return multiple todos', () => {
        var todo1 = "go to the shop and buy tartar sauce";
        var todo2 = "buy some milk too please";
        text = "David " + todo1 + " thanks and oh david " + todo2 + " thanks";
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(2);
        expect(todos[0]).to.be.equal(todo1);
        expect(todos[1]).to.be.equal(todo2);

    });

    it('should be able to process multiple lines', () => {
        text = `
                Hey all!

                We had the following agreement:
                    - andy will buy some milk in the shop
                    - szandi will bring the drinks - thanks, it is very nice of you!
                    - flyerz will write the code - thanks man, and dont worry,  Andy can help with the code in case if needed!

                Also, my wife said, that andy should go today to the school for the kids!
                `;
        start = 'andy';
        var todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(3);
        start = 'flyerz';
        todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(1);
        start = 'szandi';

        todos = textHelper.getTodosFromText(text, start, end);
        expect(todos.length).to.be.equal(1);



    });

});