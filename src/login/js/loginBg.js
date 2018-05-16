(function() {

    var width, height, canvas, ctx, circles, target, animateHeader = true;
	var colors = ["255,103,103", "251,54,119", "254,89,201", "255,112,240",  
	"190,142,255","131,125,255", "123,,150,253", "83,176,255", "83,217,255",
	"5,254,228","20,247,122","121,243,12","209,251,16","244,252,25",
	"232,103,255","255,227,26","255,180,36","255,126,22","255,133,64"];
    // Main
    initHeader();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: 0, y: height};

        canvas = document.getElementById('loginBg');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create particles
        circles = [];
        for(var x = 0; x < width*0.16; x++) {
            var c = new Circle();
            circles.push(c);
        }
        animate();
    }

    // Event handling
//  function addListeners() {
//      window.addEventListener('scroll', scrollCheck);
//      window.addEventListener('resize', resize);
//  }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in circles) {
                circles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
        var _this = this;

        // constructor
        (function() {
            _this.pos = {};
            init();
        })();

        function init() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = height+Math.random()*200;
            _this.alpha = 0.5+Math.random()*0.5;
            _this.scale = 0.3+Math.random()*0.5;
            _this.velocity = Math.random();
            _this.color = colors[parseInt(Math.random()*19)]
        }

        this.draw = function() {
            if(_this.alpha <= 0) {
                init();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= 0.003;
            _this.scale = _this.scale*0.997;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*30, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba('+_this.color+','+ _this.alpha+')';
            ctx.fill();
        };
    }

})();