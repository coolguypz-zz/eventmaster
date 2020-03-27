
class Ticket{
  constructor(data,callbacks){
  this.handleDetailsClick = this.handleDetailsClick.bind(this);

    this.data = data;
    this.callbacks = callbacks;
    this.dom = {}
  }
  handleDetailsClick(e){
    if(e) e.preventDefault();
    this.callbacks.click(this);
  }
  handleChangeDetailPage(ticket){
   
    self.location = "details.html";
    new Details(ticket.data);


  }
  renderTicket(){
    var row = $("<div>",{
      class:"row list",
      click:this.handleDetailsClick
    })
    var imgDiv = $("<div>",{
      class:"col-1 imgDiv",
      style:`background-image:url(${this.data.images[9].url})`,
    })
    var dateTime = $("<div>",{
      class:"col-2  dateTime",
    })
    var date = $("<div>",{
      class:"col-12 date",
      text:this.data.dates.start.localDate,
    });
    var time = $("<div>",{
      class:"col-12 time",
      text:this.data.dates.start.localTime,
    });
    dateTime.append(date,time);
    
    var locationName = $("<div>",{
      class:"col-7 locationName",
    })
    var location = $("<div>",{
      class:"location col-12",
      text:this.data.dates.timezone,
    });
    var name = $("<div>",{
      class:"name col-12",
      text:this.data.name,
    });
    locationName.append(location,name);

    var buttonDiv = $("<div>",{
      class:"col-2 button",
    });
    var button = $("<button>",{
      text:"Check Ticket",
    })
    buttonDiv.append(button);
    
    row.append(imgDiv,dateTime,locationName,buttonDiv);
    
    return row;
  }

  homePageRender(){

    var imageRatio = this.data.images.map((v,i) => v.width == 2048);
    var index = imageRatio.indexOf(true);

    var col = $("<div>",{
      class:" newRelease",
      click:this.handleDetailsClick
    })
    var colLeft = $("<div>",{
      class:"col-left img-div",
      style:`background-image:url(${this.data.images[index].url})`,
    })
   

    // var colimg = $("<div>",{
      // class:"img-div",
      // style:`background-image:url(${this.data.images[index].url})`,
    // })
    // colLeft.append(colimg);

    var colright = $("<div>",{
      class:"col-right",
    })
    var colDate = $("<div>",{
      class:"col-md pb-2 text-left",
      text:this.data.dates.start.localDate
    })
    var colName = $("<div>",{
      class:"col-md h6 pb-1",
      text:this.data.name,
    })
    var colArea = $("<div>",{
      class:"col-md h7 ",
      text:this.data._embedded.venues[0].name
    })
    colright.append(colDate,colName,colArea);
    col.append(colLeft,colright);
    return col;
  }
}

