

$(document).ready(initilized);

function initilized() {
  var at = new ArtTheater({
    pre: "#pre",
    next: "#next",
    newReleased: ".new-release",
    navbar: ".navbarContainer",
    footer: ".footer",
  });
  at.renderMenu();
  at.GetArtTheaterDataFromServer();
  at.addEventListner();
  at.renderFooter();
}


class ArtTheater {
  constructor(elementConfig) {
    this.ArtTheaterDataFromServer = this.ArtTheaterDataFromServer.bind(this);
    this.failArtTheaterDataFromServer = this.failArtTheaterDataFromServer.bind(this);

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
    this.arts = [];
    this.page = 1;

    this.navBar = new NavBar({
      click: this.handlePageChange,
    });

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
    this.arts.push(new Ticket(data, {
      click: this.handleDetalsClick
    }))
  }
  loadData(artsData) {
    artsData.forEach(this.addData)
  }
  renderData() {
    var renderarts = this.arts.map(v => v.homePageRender());
    this.dom.area.newReleased.empty().append(renderarts);
  }
  displayData() {
    this.renderData(this.arts)
  }
  GetArtTheaterDataFromServer() {
    $.ajax({
      url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=us&classificationName=arts&sort=random&size=6&apikey=${APIKEY}&page=${this.page}`,
      method: "GET",
      dataType: "JSON",
    }).done(this.ArtTheaterDataFromServer)
      .fail(this.failArtTheaterDataFromServer)
  }
  ArtTheaterDataFromServer(res) {
    var sport = res._embedded.events;
    this.loadData(sport);
    this.displayData();

  }
  failArtTheaterDataFromServer(xhr) {
    console.log("something is wrong:", xhr)
  }
  addEventListner() {
    this.dom.button.pre.click(this.paginationDecrement);
    this.dom.button.next.click(this.paginationIncrement);
  }
  paginationIncrement() {
    this.page++;
    this.GetArtTheaterDataFromServer();
  }
  paginationDecrement() {
    this.page--;
    if (this.page == 0) {
      this.page = 1;
    }
    this.GetArtTheaterDataFromServer();
  }
  handleDetalsClick(art) {
    self.location = `details.html?ticketId=${art.data.id}`;
  }
}