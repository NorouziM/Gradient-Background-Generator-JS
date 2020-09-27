var _ = require("lodash");
console.log(_);
function interval() {
  var color1 = document.getElementById("color1").value;
  var color2 = document.getElementById("color2").value;
  var colorRange1 = document.querySelector(".color-range1").value;
  var colorRange2 = document.querySelector(".color-range2").value;
  var colorDegree = document
    .querySelector(".radius-picker.js-radius-picker")
    .getAttribute("data-degree");

  document.body.style.background = `linear-gradient( ${colorDegree}deg, ${color1} ${colorRange1}%, ${color2} ${colorRange2}% )`;
  document.querySelector(
    ".css-code"
  ).innerHTML = `linear-gradient( ${colorDegree}deg, ${color1} ${colorRange1}%, ${color2} ${colorRange2}% )`;
}
var interval = setInterval(interval, 100);

var copyCodebtn = document.querySelector(".btn-clipboard");
copyCodebtn.addEventListener("click", function (event) {
  var codeArea = document.querySelector(".css-code");
  codeArea.focus();
  codeArea.select();
  document.execCommand("copy");
});
/* =============================================
 *
 * Degree Picker
 *
 * ============================================= */

var DegreePicker = function (el, opts) {
  var defaults = {
    /**
     * Degrees step
     * @type {Number}
     */
    step: 1,

    /**
     * Function called after degree update
     * @param  {DOM Element}   self   Picker
     * @param  {Number}   degree
     */
    callback: function (self, degree) {},
  };

  opts = opts || {};

  for (var property in defaults) {
    if (!opts[property]) opts[property] = defaults[property];
  }

  var _ = {
    container: {
      el: null,
      x: null,
      y: null,
      radius: null,
      center: {
        x: null,
        y: null,
      },
    },
    handle: {
      el: null,
      x: null,
      y: null,
      size: 0,
      position: function (of) {
        return Math.round(
          _.container.radius *
            Math[of === "x" ? "cos" : "sin"](Math.atan2(_.handle.y, _.handle.x))
        );
      },
    },

    degree: {
      el: null,
      value: null,

      get: function () {
        return Math.round(this.value);
      },

      update: function () {
        this.value = (Math.atan2(_.handle.y * -1, _.handle.x) * 180) / Math.PI;

        this.value += this.value < 0 ? 360 : 0;
      },

      set: function (value) {
        value = value > 180 ? value - 360 : value;

        value = (value * Math.PI) / 180;

        _.handle.x = Math.cos(value);

        _.handle.y = -Math.sin(value);

        _.move();
      },
    },

    isDragging: false,

    init: function () {
      _.container.el = document.querySelector(el);
      _.container.x = _.container.el.offsetLeft;
      _.container.y = _.container.el.offsetTop;
      _.container.radius = _.container.el.offsetWidth / 2;
      _.updateElementCenter();

      _.handle.el = _.container.el.children[0];
      _.handle.size = _.handle.el.offsetWidth;

      _.degree.el = _.container.el.children[1];
      _.degree.set(_.container.el.getAttribute("data-degree") || 0);

      // Bind events
      _.handle.el.addEventListener("mousedown", _.onMouseDown);
      window.addEventListener("mouseup", _.onMouseUp);
      window.addEventListener("mousemove", _.onMouseMove);
      window.addEventListener("resize", _.updateElementCenter);
    },

    /* Events
     *************************************/
    onMouseDown: function (event) {
      _.isDragging = true;
      _.updateCoords(event);
      _.move();
    },

    onMouseUp: function () {
      _.isDragging = false;
    },

    onMouseMove: function (event) {
      if (_.isDragging) {
        _.updateCoords(event);
        _.move();
      }
    },

    /* Methods
     *************************************/
    updateElementCenter: function () {
      _.container.center.x = _.container.el.offsetLeft + _.container.radius;
      _.container.center.y = _.container.el.offsetTop + _.container.radius;
    },

    updateCoords: function (e) {
      _.handle.x = e.clientX - _.container.center.x;
      _.handle.y = e.clientY - _.container.center.y;
    },

    move: function () {
      _.degree.update();

      if (_.degree.get() % opts.step === 0) {
        _.degree.el.innerHTML = _.degree.get();
        _.container.el.setAttribute("data-degree", _.degree.get());
      }

      _.handle.el.style["-webkit-transform"] =
        "translate(" +
        _.handle.position("x") +
        "px, " +
        _.handle.position("y") +
        "px)";
      _.handle.el.style["-moz-transform"] =
        "translate(" +
        _.handle.position("x") +
        "px, " +
        _.handle.position("y") +
        "px)";
      _.handle.el.style["-o-transform"] =
        "translate(" +
        _.handle.position("x") +
        "px, " +
        _.handle.position("y") +
        "px)";
      _.handle.el.style.transform =
        "translate(" +
        _.handle.position("x") +
        "px, " +
        _.handle.position("y") +
        "px)";

      opts.callback(_.container.el, _.degree.get());
    },
  };

  _.init();

  /**
   * Picker API
   */
  return {
    /**
     * Get picker value
     * @return {Number}
     */
    getValue: _.degree.get,

    /**
     * Set value of picker
     * @param {Number} value
     */
    setValue: _.degree.set,
  };
};

var picker = new DegreePicker(".js-radius-picker");
