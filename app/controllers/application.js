steroids.view.navigationBar.show("Goalden Hour");
function openLayer(location) {
  // Create a new WebView that...
  webView = new steroids.views.WebView({ location: "/views" + location });
  // ...is pushed to the navigation stack, opening on top of the current WebView.
  steroids.layers.push({ view: webView });
}
function openModal(location) {
  // Create a new WebView that...
  webView = new steroids.views.WebView({ location: "/views" + location });
  // ...opens as a modal screen on top of the current WebView.
  steroids.modal.push({ view: webView });
}
function hideModal() {
  // Hide a currently open modal
  steroids.modal.hide();
}


// Goal vars
var $goal_list;

// Goal functions
function onClickGoalModal($this, buttonIndex) {
  // clicked yes
  if(buttonIndex == 1) {
    var goal_table = new Lawnchair({db: 'goaldenhour', name: "goals"}, function(goal_table) {
      goal_table.remove($this.text(), function() {
        $this.remove();
      }); // end remove
    }); // end lawnchair
  } else {
    // uncheck checkbox
  } // end else
} // end on click goal modal
function onClickGoal(ev) {
  if(ev.isDefaultPrevented()) {
    return false;
  }

  ev.stopPropagation();
  ev.preventDefault();
  var $this = $(ev.target);
  if(!$this.hasClass("goal_item")) {
    $this = $this.parents(".goal_item");
  }

  navigator.notification.confirm(
    'Are you sure you have completed this goal?',
    onClickGoalModal.bind(this, $this),
    'Goal Completion',
    ['Yes', 'No']
  ); // end confirm
}
function addGoalToList(input) {
  $goal_list.append("<li class=\"goal_item item item-checkbox\"><label class=\"checkbox\"><input type=\"checkbox\"></label>" + input + "</li>");
  $(".goal_item").click(onClickGoal);
}
function addGoal(input) {
  var goal_table = new Lawnchair({db: 'goaldenhour', name: "goals"}, function(goal_table) {
    goal_table.save({key: input});
  }); // end lawnchair
  addGoalToList(input);
}
function onAddGoalModal(results) {
  // clicked add
  if(results.buttonIndex == 1) {
    var input = results.input1.trim();
    if(input.length > 0) {
      // check existence in db
      var goal_table = new Lawnchair({db: 'goaldenhour', name: "goals"}, function(goal_table) {
        goal_table.exists(input, function(exists) {
          if(exists) {
            navigator.notification.alert('That goal already exists!');
          } else {
            addGoal(input);
          } // end else
        }); // end check existence
      }); // end lawnchair
    } else {
      navigator.notification.alert('Invalid input');
    } // end else
  } // end if
} // end on add goal modal
function onAddGoal() {
  navigator.notification.prompt(
    'Type in a goal',       // message
    onAddGoalModal,         // callback to invoke
    'Add a goal',           // title
    ['Add','Exit']         // buttonLabels
  );
}

document.addEventListener('deviceready', function () {
  // test
  setTimeout(function() {
    window.plugin.notification.local.add({
      id: 1, // id must be present?
      title: 'Goalden Hour opportunity!',
      message: 'Start working on your goals!',
    });
  }, 3000);
  // initializations
  $goal_list = $('#goal_list');
  var goal_table = new Lawnchair({db: 'goaldenhour', name: "goals"}, function(goal_table) {
    // iterate through db and add each item to list
    goal_table.keys(function(keys) {
      keys.forEach(function(elem, index, arr) {
        addGoalToList(elem);
      }); // end for each
    }); // end keys
  }); // end lawnchair
  // event handlers
  $('#goal_add').click(onAddGoal);
}, false);
