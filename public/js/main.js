$(document).ready(function() {
  $('.delete-task').on('click', deleteTask);
  $('.change-status').on('click', changeStatus);
  $('.sort-tasks').on('click', sortTasks);
  $('.sort-dates').on('click', sortDates);
  $('.sort-priorities').on('click', sortPriorities);
});

function deleteTask() {
  var confirmation = confirm('Would you like it deleted?');

  if (confirmation) {
    $.ajax({
      type: 'DELETE',
      url: '/tasks/delete/' + $(this).data('id')
    })
    window.location.replace('/');
  } else {
    return false;
  }
}

function changeStatus() {
  var changeTo = prompt('What would you like to change this to?');

  if (changeTo != null) {
    $.ajax({
      type: 'POST',
      data: {
        str: changeTo
      },
      url: '/tasks/changeStatus/' + $(this).data('id')
    })
    window.location.replace('/');
  }
}

function sortTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks/sortTasks/'
  })
  window.location.replace('/');
}

function sortDates() {
  $.ajax({
    type: 'GET',
    url: '/tasks/sortDates/'
  })
  window.location.replace('/');
}

function sortPriorities() {
  console.log("here2");
  $.ajax({
    type: 'GET',
    url: '/tasks/sortPriorities/'
  })
  window.location.replace('/');
}
