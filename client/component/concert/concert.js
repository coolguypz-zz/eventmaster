
$(document).ready(initilized);

function initilized() {
  var cc = new Concert({
    pre: "#pre",
    next: "#next",
    newReleased: ".new-release",
    navbar: ".navbarContainer",
    footer: ".footer",
  });
  cc.renderMenu();
  cc.GetConcertDataFromServer();
  cc.addEventListner();
  cc.renderFooter();
}


class Concert {
  constructor(elementConfig) {
    this.ConcertDataFromServer = this.ConcertDataFromServer.bind(this);
    this.failConcertDataFromServer = this.failConcertDataFromServer.bind(this);

    this.paginationIncrement = this.paginationIncrement.bind(this);
    this.paginationDecrement = this.paginationDecrement.bind(this);

    this.addData = this.addData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);


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
    this.data = null;
    this.concerts = [];
    this.page = 1;

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
  addData(data) {
    this.concerts.push(new Ticket(data, {
      click: this.handleDetalsClick
    }))
  }
  loadData(concertData) {
    concertData.forEach(this.addData)
  }
  renderData() {
    var renderConcert = this.concerts.map(v => v.homePageRender());
    this.dom.area.newReleased.empty().append(renderConcert);
  }
  displayData() {
    this.renderData(this.concerts)
  }
  GetConcertDataFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=us&classificationName=concert&sort=relevance,asc&size=6&apikey=${APIKEY}&page=${this.page}`,
      method: "GET",
      dataType: "JSON",
    }).done(this.ConcertDataFromServer)
      .fail(this.failConcertDataFromServer)
  }
  ConcertDataFromServer(res) {
    var concert = res._embedded.events;
    this.loadData(concert);
    this.displayData();

  }
  failConcertDataFromServer(xhr) {
    console.log("something is wrong:", xhr)
  }
  addEventListner() {
    this.dom.button.pre.click(this.paginationDecrement);
    this.dom.button.next.click(this.paginationIncrement);
  }
  paginationIncrement() {
    this.page++;
    this.GetConcertDataFromServer();
  }
  paginationDecrement() {
    this.page--;
    if (this.page == 0) {
      this.page = 1;
    }
    this.GetConcertDataFromServer();
  }
  handleDetalsClick(concert) {
    self.location = `details.html?ticketId=${concert.data.id}`;
  }
}