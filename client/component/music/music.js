
$(document).ready(initilized);

function initilized() {
  var m = new MusicEvent({
    pre: "#pre",
    next: "#next",
    newReleased: ".new-release",
    navbar: ".navbarContainer",
    footer: ".footer",
  });
  m.renderMenu();
  m.getMusicDataFromServer();
  m.addEventListner();
  m.renderFooter();
}


class MusicEvent {
  constructor(elementConfig) {
    this.processMusicDataFromServer = this.processMusicDataFromServer.bind(this);
    this.failProcessMusicDataFromServer = this.failProcessMusicDataFromServer.bind(this);

    //callbacks Event
    //nav callbacks
    this.handlePageChange = this.handlePageChange.bind(this);

    this.addTicket = this.addTicket.bind(this);
    this.handleDetailsClick = this.handleDetailsClick.bind(this);
    this.paginationIncrement = this.paginationIncrement.bind(this);

    this.dom = {
      area: {
        newReleased: $(elementConfig.newReleased),
        navbar: $(elementConfig.navbar),
        footer: $(elementConfig.footer),
      },
      button: {
        pre: $(elementConfig.pre),
        next: $(elementConfig.next),
      }
    }
    this.page = 1;
    this.events = [];
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
    var musicRender = events.map(v => { return v.homePageRender() });
    this.dom.area.newReleased.empty().append(musicRender);
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
  handleChangeToDetailPage(music) {
    self.location = `details.html?ticketId=${music.data.id}`;
  }
  getMusicDataFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&sort=random&size=6&apikey=${APIKEY}&page=${this.page}`,
      method: "GET",
    }).done(this.processMusicDataFromServer)
      .fail(this.failProcessMusicDataFromServer)
  }
  processMusicDataFromServer(res) {
    console.log("sucessed: ", res);
    var events = res._embedded.events;
    this.loadEvent(events);
    this.displayAllEvents();
  }
  failProcessMusicDataFromServer(xhr) {
    console.log("something is wrong in failProcessMusicDataFromServer : ", xhr);
  }
  addEventListner() {
    this.dom.button.pre.click(this.paginationDecrement);
    this.dom.button.next.click(this.paginationIncrement);
  }
  paginationIncrement() {
    this.page++;
    this.getMusicDataFromServer();
  }
}