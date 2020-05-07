function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var getAllRecords = function() {
  $.getJSON(
    "https://api.airtable.com/v0/appLNrzkbjkQWITFC/Shows?api_key=keyDFviFmwAg6ZHxA&view=list",
    function(airtable) {
      var html = [];
      $.each(airtable.records, function(index, record) {
        var id = record.id;
        var photo = record.fields["Photo"];
        var title = record.fields["Title"];
        var network = record.fields["Network"];
        html.push(listView(id, photo, title, network));
      });
      $(".list-view").append(html);
    }
  );
};

var listView = function(id, photo, title, network) {
  return ` <div class="col-sm-4"> 
    <div class="card border-dark" style="width:18rem; height:25rem">
    ${photo ? `<img src="${photo[0].url}">` : ``}
    <div class="card-body">
      <h2 class="card-title"><a href="index.html?id=${id}">${title}</h2></a>
      <p class="card-text">Network: <strong>${network}</strong></p>
      </div>
    </div>
    </div>
  `;
};
var getOneRecord = function(id) {
  $.getJSON(
   `https://api.airtable.com/v0/appLNrzkbjkQWITFC/Actors/?api_key=keyDFviFmwAg6ZHxA`,
    function (actors) {
      $.getJSON(
        `https://api.airtable.com/v0/appLNrzkbjkQWITFC/Shows/${id}?api_key=keyDFviFmwAg6ZHxA`,
        function(record) {
          var html = [];                   
          var  actorsids = record.fields["Actors"];
          
          var actorData = actors.records.filter(function(actorRecord){
            return actorsids.includes(actorRecord.id);
          });
          
          var photo = record.fields["Photo"];
          var title = record.fields["Title"];
          var network = record.fields["Network"];
          var genre = record.fields["Genre"];
          var description = record.fields["Description"];
          var link = record.fields["Link"];
          var date = record.fields["Date"];
          var rating = record.fields["Rating"];
          html.push(
            detailView(          
              actorData ,
              photo,
              title,
              network,
              genre,
              description,
              link,
              date,
              rating,
            )
          );
          $(".detail-view").append(html);
        }
      );
    })
 
};

var detailView = function(
      actors,
      photo,    
      title,
          network,
          genre,
          description,
          link,
          date,
          rating,
) {
  return `
  <div class="card mb-3" ;">
  <div class="row no-gutters">
    <div class="col-md-4">
      ${photo ? `<img src="${photo[0].url}" class="card-img" >` : ``}
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h1 class="card-title">${title}</h1>
        <p class="card-text">Network: <strong>${network}</strong></p>
        <p class="card-text">Genre: <strong>${genre}</strong></p>
        <br><br><br><a href="index.html"><button type="button" class="btn btn-primary">Home</button></a>
      </div>
    </div>
  </div>
</div>
  <div class="row row-cols-1 row-cols-md-3">
  <div class="col mb-4">
    <div class="card h-100">
      
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">Cast: ${actors.map(function(actor) { return actor.fields['Name'] } )}</p>
        <p class="card-text">${description}</p>
        <p class="card-text">${date}</p>
        <p class="card-text">${rating}</p>
        <p class="card-text"><a href="${link}" target="_blank">${title}'s IMDB Page</a></p>
  `;
};





var id = getParameterByName("id");
if (id) {
  getOneRecord(id);
} else {
  getAllRecords();
}
