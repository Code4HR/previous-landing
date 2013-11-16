$(document).ready(function(){
  $(document).on("click","#show-details", function(e) {
    e.preventDefault();
    $('#project_details').toggle();
  });
  $('#project_details').on("click","a.btn-info", function(e) {
    e.preventDefault();
    var c_id = $(this).attr("href");
    $('#project_details ul'+c_id).toggle();
  });
});