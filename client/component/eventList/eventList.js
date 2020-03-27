



$(document).ready(initilized);

function initilized() {
  var tl = new EventList({
    listArea: ".listArea",
    navbar: ".navbarContainer",
    category: "#category",
    newReleased: ".new-release",
    footer: ".footer"
  });
  tl.renderMenu();
  tl.renderFooter();
  tl.getTicketDataFromServer();
}


class EventList {
  constructor(elementConfig) {
    this.processTicketDataFromServer = this.processTicketDataFromServer.bind(this);
    this.failProcessTicketDataFromServer = this.failProcessTicketDataFromServer.bind(this);

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
        category: $(elementConfig.category),
        newReleased: $(elementConfig.newReleased),
        footer: $(elementConfig.footer),
      }
    }
    this.events = [];
    this.onsaleEvents = [];
    this.page = 1;
    this.listVal = null;
    this.navBar = new NavBar({
      click: this.handlePageChange,
    })
    this.footer = new Footer();
  }
  renderMenu() {
    this.navBar.loadNav();
    var menubar = this.navBar.renderNavBar();
    this.dom.area.navbar.empty().append(menubar);
  }
  handlePageChange(navbar, nav) {
    if (nav.data.link == "MAP") {
      localStorage.setItem("tickets", JSON.stringify(this.events));
    }
    this.navBar.callbacksChangePages(navbar, nav)
  }
  renderFooter() {
    this.dom.area.footer.empty().append(this.footer.renderFooter());
  }
  addTicket(ticket) {
    this.events.push(new Ticket(ticket, {
      click: this.handleDetailsClick
    }))
  }
  render(events) {
    var ticketRender = events.map(v => { return v.homePageRender() });
    this.dom.area.newReleased.empty().append(ticketRender);
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
    self.location = `details.html?ticketId=${ticket.data.id}`;
  }
  getTicketDataFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=us&sort=random&size=6&includesTBD=yes&apikey=${APIKEY}&page=${this.page}`,
      method: "GET",
    }).done(this.processTicketDataFromServer)
      .fail(this.failProcessTicketDataFromServer)
  }
  processTicketDataFromServer(res) {
    var events = res._embedded.events;
    this.loadEvent(events);

    // var es = [];
    // var newReleased = [];
    // events.forEach(a => {
    //   var found = es.some(v => v.name === a.name);
    //   if (!found) {
    //     es.push(a);
    //   } 
    // })
    // if(es.length % 2 != 0){
    //   newReleased =  es.slice(0,es.length-1);
    // }else{
    //   newReleased = es.slice(0,6);
    // }

    // this.loadEvent(newReleased);
    this.displayAllEvents();
  }
  failProcessTicketDataFromServer(xhr) {
    console.log("something is wrong in failProcessTicketDataFromServer : ", xhr);
  }

}



