$('a[href="#"]').click(function(){
  return false;
});


var animationEndEvent = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var count = 0;
var counter_yes = 0;
var counter_no = 0;
var Person = {
  wrap: $('#people'),
  people: [
    {
      name: 'Question',
      age: 1,
      img: "img/q1.png"
    },
    {
      name: 'Question',
      age: 2,
      img: "img/q2.jpg"
    },
    {
      name: 'Question',
      age: 3,
      img: "img/q3.jpg"
    },
    {
      name: 'Question',
      age: 4,
      img: "img/q4.png"
    },
    {
      name: 'Question',
      age: 5,
      img: "img/q5.png"
    },
    {
      name: 'Question',
      age: 6,
      img: "img/q6.jpg"
    },
    {
      name: 'Question',
      age: 7,
      img: "img/q7.png"
    },
    {
      name: 'Question',
      age: 8,
      img: "img/q8.jpg"
    },
    {
      name: 'Question',
      age: 9,
      img: "img/q9.png"
    }
    
  ],   
  add: function(){
    var random =  this.people[count++];
    this.wrap.append("<div class='person'><img alt='" + random.name + "' src='" + random.img + "' /><span><strong>" + random.name + "</strong>, " + random.age + "</span></div>");
  }
}

var App = {
  yesButton: $('.button.yes .trigger'),
  noButton: $('.button.no .trigger'),
  blocked: false,
  like: function(liked){
    var animate = liked ? 'animateYes' : 'animateNo';
    if (liked) {
      counter_yes++;
      $('#count_yes').text(counter_yes);
    }
    else {
      counter_no++;
      $('#count_no').text(counter_no);
    }
    var self = this;
    if (!this.blocked) {
      this.blocked = true;
      $('.person').eq(0).addClass(animate).one(animationEndEvent, function() {
        $(this).remove();
        Person.add();
        self.blocked = false;
      });
    }
  }
};

var Phone = {
  wrap: $('#phone'),
  clock: $('.clock'),
  updateClock: function() {
    var date = new Date();
    var hours = date.getHours();
    var min = date.getMinutes();
    hours = (hours < 10 ? "0" : "") + hours;
    min = (min < 10 ? "0" : "") + min;
    var str = hours + ":" + min;
    this.clock.text(str);
  }
}

App.yesButton.on('mousedown', function() {
  App.like(true);
});

App.noButton.on('mousedown', function() {
  App.like(false);
});

$(document).ready(function() {
  Phone.updateClock();
  setInterval('Phone.updateClock()', 1000);
  Person.add();
  Person.add();
  Person.add();
  Person.add();
});