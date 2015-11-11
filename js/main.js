var CalcController = function() {
    this.bartenders =[];
    this.reusing = false;
    // var self = this;
    function initialize(that) {
      $("#add-button").on("click", function(e) { that.addBartender(e) });
      $(".calc-button").on("click", function(e) { that.calcTips(e) });
      $("#bartender-to-add").on("click", ".remove-button", function(e) { that.removeBartender(e) });
      $("#error-list").on("click", ".close-error-btn", function(e){ that.closeError(e) });
      that.addBartender();
    }
    initialize(this);
}

CalcController.prototype = {

  removeBartender: function(e) {
    var $el = $(e.target);
    $el.closest(".bartender-info").animate({ "left": "-=400px" }, 500, function() {
      $(this).remove();
    });
    this.removeFromArray($el.closest(".bartender-info").find('input.name-box').val());
    setTimeout(function () {
      $(".calc-button").trigger("click");
    }, 800);
  },

  removeFromArray: function(name) {
    this.reusing = true;
    for (var i = 0; i < this.bartenders.length; i++) {
      if (this.bartenders[i].firstName === name) {
        this.bartenders.splice(i,1);
        return false;
      }
    }
  },

  closeError: function(e) {
    var $el = e.target;

    $el.closest(".errors").remove();
  },

  addBartender: function(e) {
      var addBartenderTemplate = $.trim($("#add-template").html());
      $("#bartender-to-add").append(addBartenderTemplate);
  },

  calcTips: function(e) {
    e.preventDefault();

    $('#error-list').empty();
    $('#name').remove();
    if (!this.reusing) { this.bartenders = []; this.createBartenders(); };

    var totalTips = $('input[name="totaltips"]').val();
    var hoursAdded = this.addHours();
    if (isNaN(totalTips) || totalTips === '') {
      this.renderTotalTipsError();
    } else if(hoursAdded === false) {
      return;
    } else {
      var rate = totalTips / hoursAdded;
      for (var i=0; i<this.bartenders.length; i++) {
        this.bartenders[i].tipsOwed = Math.round((this.bartenders[i].hrs * rate)*100)/100
      }
      this.renderResults();
    }
    this.reusing = false;
  },

  createBartenders: function() {
    var bartenders = this.bartenders;

    $('#bartender-to-add .bartender-info').each(function() {
      var name = $(this).find('input').val();
      var hrs = $(this).find('input').eq(1).val();
      if (name === '' && hrs === '') {
        // skips entry if user leaves name and hours blank
        return true;
      }else {
        bartenders.push(new Bartender(name, hrs));
      }
    });
  },

  addHours: function() {
    var sumHours = 0
    for(var i=0; i<this.bartenders.length; i++) {
      var hoursInteger = this.bartenders[i].hrs
      if (isNaN(hoursInteger) || hoursInteger === ''){
        this.renderNumHoursError();
        return false;
      }else if (this.bartenders[i].hrs < 0){
        this.renderNegNumberError();
        return false;
      }else {
        sumHours += parseFloat(hoursInteger);
      }
    }
    return sumHours
  },

  renderNumHoursError: function() {
    $('#error-list').append("<div class='errors's>Number required for Hours <img class='close-error-btn' src='img/red_close_button.png'></div>");
  },

  renderTotalTipsError: function() {
    $('#error-list').append("<div class='errors's>Number is required for Tip pool amount<img class='close-error-btn' src='img/red_close_button.png'></div>");
  },

  renderNegNumberError: function() {
    $('#error-list').append("<div class='errors's>Numbers greater than ' 0 ' required for Hours <img class='close-error-btn' src='img/red_close_button.png'></div>");
  },

  renderResults: function(){
    var source =  $('#render-results').html();
    var template = Handlebars.compile(source);
    var poolData = { people: this.bartenders }
    $('body #render-list').append(template(poolData));
  }
}

var Bartender = function(firstname, hrs) {
  this.firstName = firstname;
  this.hrs = hrs;
  this.tipsOwed = 0;
}


$(function() {
    var calcSetup = new CalcController();
});
