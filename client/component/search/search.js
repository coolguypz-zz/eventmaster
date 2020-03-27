


$(document).ready(initilized);

function initilized() {
  var sl = new SearchList({
    listArea: ".listArea",
    navbar: ".navbarContainer",
  });
  sl.renderMenu();
  sl.getData();
}


class SearchList {
  constructor(elementConfig) {
 
    this.failProcessData = this.failProcessData.bind(this);
    this.processAjaxSearch = this.processAjaxSearch.bind(this);

    //callbacks Event
    //nav callbacks
    this.handlePageChange = this.handlePageChange.bind(this);

    //ticketList callbacks
    this.addTicket = this.addTicket.bind(this);
    this.handleDetailsClick = this.handleDetailsClick.bind(this);

    this.dom = {
      area: {
        listArea: $(elementConfig.listArea),
        navbar: $(elementConfig.navbar),
      }
    }
    this.events = [];
    this.selfLinks = null;
    this.data = null;
    this.navBar = new NavBar({
      click: this.handlePageChange,
    })

  }
  getData(){
    var rawData = JSON.parse(localStorage.getItem("self-links"));
    this.selfLinks = rawData.href;
    
    this.handleAjaxSearch();

  }

  renderMenu() {
    this.navBar.loadNav();
    var menubar = this.navBar.renderNavBar();
    this.dom.area.navbar.empty().append(menubar);
  }
  handlePageChange(navbar, nav) {

    this.navBar.callbacksChangePages(navbar, nav)
  }

  addTicket(ticket) {
    this.events.push(new Ticket(ticket, {
      click: this.handleDetailsClick
    }))
  }
  render(events) {
    var ticketRender = events.map(v => { return v.renderTicket() });
    this.dom.area.listArea.empty().append(ticketRender);
  }
  loadEvent(events) {
    events.forEach(this.addTicket);
  }
  displayAllEvents() {
    this.render(this.events)
  }
  handleDetailsClick(ticket) {
    this.handleChangeToDetailPage(ticket)
  }
  handleChangeToDetailPage(ticket) {
    self.location = "details.html";
  }

  handleAjaxSearch() {
    $.ajax({
      method: "GET",
      url: `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=Capital+One+Arena&apikey=C0p1JrHhaLuA2ean7zga5dZO32rQlNce`,
      dataType: "json",
    }).done(this.processAjaxSearch)
      .fail(this.failProcessData)
  }
  processAjaxSearch(res){
    console.log("object-res: ",res);
    this.data = res._embedded.venues
    this.loadEvent(this.data);
    this.displayAllEvents();
  }
  failProcessData(xhr){
    console.log("something is wrong in searchList: ",JSON.parse(xhr.responseText));
  }
}


