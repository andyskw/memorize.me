exports.getTodosFromText = (text, startMark, endMark) => {

    var todos = [];

    var ind = 0;
    var start = startMark.toLowerCase();
    var end = endMark.toLowerCase();
    var textArray = text.split("\n");
    textArray.forEach((t) => {
        "use strict";
        t = t.toLowerCase().trim();
        let started = false;
        while (t.length > 0) {
            var myIndex = 0;
            if (!started) {
                myIndex = t.indexOf(start);
            }
            if (myIndex >= 0 && !started) {
                started = true;
                t = t.substr(myIndex + start.length).trim();
            } else {
                //No start bit will be here in the future.
                return todos;
            }
            if (started) {
                var endIndex = t.indexOf(end);
                if (endIndex > 0) {
                    var todo = t.substr(0, endIndex);
                    todos.push(todo.trim());
                    t = t.substr(endIndex + end.length);
                    started = false;
                } else {
                    todos.push(t);

                }
            }
        }
    });

    return todos;
};