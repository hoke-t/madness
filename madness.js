$(function () {
    reloadGame();
});

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

function reloadGame() {

    $('.board').html('');

    var reverse = function(array){
        var arrayOne = array
        var array2 = [];

        for (var i = arrayOne.length-1; i >= 0; i--){
          array2.push(arrayOne[i])
        }
        return array2
    }

    // Main object
    var madness = new function () {
    this.state = ['A', 'A', 'A', 'A', ' ', ' ', 'B', 'B', 'B', 'B'];
    this.goal = reverse(this.state);
    this.move = function (fromIndex, toIndex) {
        // Safety checks
        if (fromIndex < 0 || fromIndex > this.state.length) {
            return false;
        } else if (toIndex < 0 || toIndex > this.state.length) {
            return false;
        }

        if (this.state[fromIndex] == ' ') {
            return false;
        } else if (this.state[toIndex] != ' ') {
            return false;
        }

        // Move the peg
        if (this.state[fromIndex] == 'A') {
            if (toIndex == fromIndex + 1 ||
                (toIndex == fromIndex + 2 && this.state[fromIndex+1] != ' ')) {
                    this.state[toIndex] = this.state[fromIndex];
                    this.state[fromIndex] = ' ';
                    return true;
                }
        } else if (this.state[fromIndex] == 'B') {
            if (toIndex == fromIndex - 1 ||
                (toIndex == fromIndex - 2 && this.state[fromIndex-1] != ' ')) {
                    this.state[toIndex] = this.state[fromIndex];
                    this.state[fromIndex] = ' ';
                    return true;
                }
            }

            return false;
        };
    this.winning = function () {
            return this.state.equals(this.goal);
        }
    }

    var currentSelectedIdx = -1;

    $('.board').append('<div class="peg-container"></div>');

    for (var i = 0; i < madness.state.length; i++) {
        $('.peg-container').append('<div class="peg" id="{0}"></div>'.format(i));

        $('.peg#{0}'.format(i)).css('background-color',
        madness.state[i] == 'A' ? 'red':
        madness.state[i] == 'B' ? 'blue' : '').click(pegClickHandler);
    }

    function pegClickHandler() {
        if (currentSelectedIdx >= 0) {
            if (madness.move(currentSelectedIdx, parseInt($(this).attr('id')))) {
                console.log(madness.state);
                $('.peg#{0}'.format(currentSelectedIdx)).css('background-color',
                    madness.state[currentSelectedIdx] == 'A' ? 'red':
                    madness.state[currentSelectedIdx] == 'B' ? 'blue' : '')
                $('.peg#{0}'.format($(this).attr('id'))).css('background-color',
                    madness.state[parseInt($(this).attr('id'))] == 'A' ? 'red':
                    madness.state[parseInt($(this).attr('id'))] == 'B' ? 'blue' : '')
                    deselectAllPegs();
            } else {
                deselectAllPegs();
                selectPegAtIndex(parseInt($(this).attr('id')));
                console.log('Can\'t make that move from {0} to {1}.'.format(currentSelectedIdx, $(this).attr('id')));
            }
        } else {
            if (currentSelectedIdx == parseInt($(this).attr('id'))) {
                deselectAllPegs();
            } else {
                selectPegAtIndex(parseInt($(this).attr('id')));
            }
        }
        console.log('clicked {0}'.format($(this).attr('id')));
        if (madness.winning()) {
            $('body').append('<h1 style="color: green;">Congratulations! YOU WIN!!</h1>');
            $('.peg').click(function () {});
        }
    }

    function selectPegAtIndex(index) {
        currentSelectedIdx = index;
        if ($('.peg#{0}'.format(index)).attr('style') != null) {
            $('.peg#{0}'.format(index)).addClass('selected');
        }
    }

    function deselectAllPegs() {
        $('.selected').removeClass('selected');
        currentSelectedIdx = -1;
    }
}
