function initCanvas(canvasId){
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;

    var width = 150;
    var height = 150;


    var points =
        [
            [[0.2225,0.5],[0.5,0.09],[0.78,0.5],[0.5,0.9],[0.2225,0.5]],
            [[0.385,0.1025],[0.5225,0.1025],[0.5225,0.905],[0.5225,0.905],[0.5225,0.905]],
            [[0.28,0.3],[0.7225,0.305],[0.54,0.61],[0.285,0.885],[0.735,0.885]],
            [[0.31625,0.27],[0.4975,0.09],[0.4975,0.48],[0.5,0.9],[0.2825,0.715]],
            [[0.775,0.73],[0.215,0.73],[0.645,0.125],[0.645,0.73],[0.645,0.895]],
            [[0.73,0.1],[0.455,0.1],[0.36,0.39],[0.725,0.645],[0.225,0.77]],
            [[0.55,0.1],[0.55,0.1],[0.23,0.63],[0.765,0.63],[0.2675,0.5]],
            [[0.235,0.105],[0.79,0.105],[0.60335,0.3667],[0.4167,0.63335],[0.23,0.905]],
            [[0.505,0.48],[0.505,0.095],[0.505,0.48],[0.505,0.895],[0.505,0.48]],
            [[0.7325,0.5],[0.235,0.37],[0.77,0.37],[0.45,0.9],[0.45,0.9]]
        ];
    var control_one =
        [
            [[0.2225,0.3],[0.665,0.09],[0.78,0.7],[0.335,0.9]],
            [[0.385,0.1025],[0.5225,0.1025],[0.5225,0.905],[0.5225,0.905]],
            [[0.295,0.01],[0.7225,0.39],[0.47,0.69],[0.285,0.885]],
            [[0.315,0.135],[0.78,0.09],[0.79,0.48],[0.27,0.9]],
            [[0.775,0.73],[0.215,0.73],[0.645,0.125],[0.645,0.73]],
            [[0.455,0.1],[0.36,0.39],[0.485,0.33],[0.7,0.915]],
            [[0.55,0.1],[0.355,0.395],[0.26,1.04],[0.73,0.33]],
            [[0.235,0.105],[0.79,0.105],[0.60335,0.3667],[0.4167,0.63335]],
            [[0.22,0.475],[0.77,0.095],[0.22,0.48],[0.77,0.895]],
            [[0.62,0.68],[0.21,0.04],[0.76,0.54],[0.45,0.9]]
        ];
    var control_two =
        [
            [[0.335,0.09],[0.78,0.3],[0.665,0.9],[0.2225,0.7]],
            [[0.5225,0.1025],[0.5225,0.905],[0.5225,0.905],[0.5225,0.905]],
            [[0.715,0.02],[0.65,0.49],[0.37,0.775],[0.735,0.885]],
            [[0.43,0.09],[0.73,0.48],[0.75,0.9],[0.28,0.75]],
            [[0.215,0.73],[0.645,0.125],[0.645,0.73],[0.645,0.895]],
            [[0.455,0.1],[0.36,0.39],[0.725,0.425],[0.34,0.99]],
            [[0.55,0.1],[0.24,0.46],[0.79,0.96],[0.38,0.32]],
            [[0.79,0.105],[0.60335,0.3667],[0.4167,0.63335],[0.23,0.905]],
            [[0.22,0.095],[0.77,0.48],[0.18,0.895],[0.77,0.48]],
            [[0.27,0.67],[0.74,-0.04],[0.645,0.605],[0.45,0.9]]
        ];

    function normalize(array){
        for(var i = 0; i < array.length; i++){
            for(var j = 0; j < array[i].length; j++){
                array[i][j][0] = (array[i][j][0]) * width;
                array[i][j][1] = (array[i][j][1]) * height;
            }
        }
    }

    normalize(points);
    normalize(control_one);
    normalize(control_two);

    /**
     * Accelerate Decelerate interpolator.
     */
    function getInterpolation(input) {
        return (Math.cos((input + 1) * Math.PI) / 2) + 0.5;
    }

    /**
     * Draws each frame of the animation.
     */
    function draw(i, j, frame, position) {
        position = parseInt('' + position);
        ctx.clearRect(position * width, 0, (position + 1) * width, 200);
        ctx.beginPath();

        var current = points[i];
        var next = points[j];
        var curr1 = control_one[i];
        var next1 = control_one[j];
        var curr2 = control_two[i];
        var next2 = control_two[j];

        frame = getInterpolation(frame);

        var offsetX = position * width;
        ctx.moveTo(current[0][0] + ((next[0][0] - current[0][0]) * frame) + offsetX,
            current[0][1] + ((next[0][1] - current[0][1]) * frame));

        for (var index = 1; index < 5; index++) {
            ctx.bezierCurveTo(
                offsetX + curr1[index-1][0] + ((next1[index-1][0] - curr1[index-1][0]) * frame),
                curr1[index-1][1] + ((next1[index-1][1] - curr1[index-1][1]) * frame),
                offsetX + curr2[index-1][0] + ((next2[index-1][0] - curr2[index-1][0]) * frame),
                curr2[index-1][1] + ((next2[index-1][1] - curr2[index-1][1]) * frame),
                offsetX + current[index][0] + ((next[index][0] - current[index][0]) * frame),
                current[index][1] + ((next[index][1] - current[index][1]) * frame));
        }

        ctx.stroke();
    }

    var current = [];

    function drawNumber(number){
        var digits = ('' + number).split('');
        for(var i in digits){
            (function(){
                current[i] = current[i] || 0;
                var next = parseInt(digits[i]);
                var frame = 0;

                function nextFrame(position) {
                    if (frame >= 2 && frame <= 58) {
                        draw (current[position], next, (frame - 2) / 56, position);
                    }
                    frame++;
                    if (frame == 60) {
                        frame = 0;
                        current[position] = next;
                        return;
                    }
                    setTimeout(function(){
                        nextFrame(position)
                    }, 15);
                }
                nextFrame(i);
            })();
        }
    }

    return {
        transition: function (number){
            if(number < 10){
                number = '0' + number;
            }
            drawNumber('' + number);
        }
    }
}

var canvasHours = initCanvas('canvasHours');
var canvasMinutes = initCanvas('canvasMinutes');
var canvasSeconds = initCanvas('canvasSeconds');

setInterval(function(){
    var now = new Date();
    canvasSeconds.transition(now.getSeconds());
    canvasMinutes.transition(now.getMinutes());
    canvasHours.transition(now.getHours());
}, 1000);